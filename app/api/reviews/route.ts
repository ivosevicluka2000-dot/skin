import {
  ApiValidationError,
  boundedInteger,
  json,
  normalizedEmail,
  optionalBoundedInteger,
  optionalString,
  readJsonObject,
  requiredString,
  routeError,
} from "@/lib/server/api";
import { eventStatement, getDatabase, stableId } from "@/lib/server/db";

interface ReviewRow {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verifiedPurchase: number;
  createdAt: string;
}

interface ReviewStatsRow {
  averageRating: number | null;
  reviewCount: number;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonObject(request);
    const productId = requiredString(body.productId, "productId", 120);
    const authorName = requiredString(body.authorName, "authorName", 100);
    const email = normalizedEmail(body.email, false);
    const rating = boundedInteger(body.rating, "rating", 1, 5);
    const title = optionalString(body.title, "title", 120);
    const reviewBody = requiredString(body.body, "body", 3000);
    if (reviewBody.length < 10) {
      throw new ApiValidationError("body must contain at least 10 characters.", "body");
    }

    const reviewId = stableId("rev");
    const database = await getDatabase();
    await database.batch([
      database
        .prepare(
          `INSERT INTO reviews
            (id, product_id, author_name, email, rating, title, body, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        )
        .bind(reviewId, productId, authorName, email, rating, title, reviewBody),
      eventStatement(database, "review.submitted", "review", reviewId, {
        productId,
        rating,
      }),
    ]);

    return json(
      {
        ok: true,
        review: {
          id: reviewId,
          productId,
          authorName,
          rating,
          title,
          body: reviewBody,
          status: "pending",
        },
        message: "Review submitted for moderation.",
      },
      201,
    );
  } catch (error) {
    return routeError(error);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const productId = requiredString(url.searchParams.get("productId"), "productId", 120);
    const rawLimit = url.searchParams.get("limit");
    const limit = optionalBoundedInteger(
      rawLimit === null ? undefined : Number(rawLimit),
      "limit",
      1,
      50,
      20,
    );
    const database = await getDatabase();
    const [reviewsResult, stats] = await Promise.all([
      database
        .prepare(
          `SELECT
            id, product_id AS productId, author_name AS authorName,
            rating, title, body, verified_purchase AS verifiedPurchase,
            created_at AS createdAt
           FROM reviews
           WHERE product_id = ? AND status = 'published'
           ORDER BY created_at DESC
           LIMIT ?`,
        )
        .bind(productId, limit)
        .all<ReviewRow>(),
      database
        .prepare(
          `SELECT AVG(rating) AS averageRating, COUNT(*) AS reviewCount
           FROM reviews
           WHERE product_id = ? AND status = 'published'`,
        )
        .bind(productId)
        .first<ReviewStatsRow>(),
    ]);

    return json({
      ok: true,
      productId,
      summary: {
        averageRating: stats?.averageRating ?? 0,
        reviewCount: stats?.reviewCount ?? 0,
      },
      reviews: (reviewsResult.results ?? []).map((review: ReviewRow) => ({
        ...review,
        verifiedPurchase: Boolean(review.verifiedPurchase),
      })),
    });
  } catch (error) {
    return routeError(error);
  }
}
