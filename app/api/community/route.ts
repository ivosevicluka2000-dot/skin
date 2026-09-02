import { courses } from "@/lib/data";
import { ApiValidationError, boundedInteger, json, optionalString, readJsonObject, requiredString, routeError } from "@/lib/server/api";
import { eventStatement, getDatabase, stableId } from "@/lib/server/db";
import { resolveOwner } from "@/lib/server/owner";

const spaces = new Set(courses.map((course) => course.slug));

type PostRow = { id: string; spaceId: string; authorName: string; title: string; body: string; likeCount: number; replyCount: number; createdAt: string };

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const selectedSpace = optionalString(url.searchParams.get("spaceId"), "spaceId", 100);
    if (selectedSpace && !spaces.has(selectedSpace)) throw new ApiValidationError("Unknown community space.", "spaceId");
    const rawLimit = url.searchParams.get("limit");
    const limit = boundedInteger(rawLimit === null ? 20 : Number(rawLimit), "limit", 1, 50);
    const database = await getDatabase();
    const result = await database.prepare(`SELECT p.id, p.space_id AS spaceId, p.author_name AS authorName, p.title, p.body, p.like_count AS likeCount, COUNT(c.id) AS replyCount, p.created_at AS createdAt FROM community_posts p LEFT JOIN community_comments c ON c.post_id = p.id AND c.status = 'published' WHERE p.status = 'published' ${selectedSpace ? "AND p.space_id = ?" : ""} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ?`).bind(...(selectedSpace ? [selectedSpace, limit] : [limit])).all<PostRow>();
    return json({ ok: true, posts: result.results ?? [] });
  } catch (error) { return routeError(error); }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonObject(request);
    const owner = await resolveOwner(body.ownerId);
    const spaceId = requiredString(body.spaceId, "spaceId", 100);
    if (!spaces.has(spaceId)) throw new ApiValidationError("Unknown community space.", "spaceId");
    const authorName = requiredString(body.authorName, "authorName", 80);
    const title = requiredString(body.title, "title", 160);
    const postBody = requiredString(body.body, "body", 1500);
    if (title.length < 6 || postBody.length < 12) throw new ApiValidationError("Add a clearer title and a little more context.", "body");
    const id = stableId("pst");
    const database = await getDatabase();
    await database.batch([
      database.prepare("INSERT INTO community_posts (id, owner_id, space_id, author_name, title, body, status) VALUES (?, ?, ?, ?, ?, ?, 'published')").bind(id, owner.ownerId, spaceId, authorName, title, postBody),
      eventStatement(database, "community.posted", "community_post", id, { spaceId, ownerType: owner.authenticated ? "user" : "guest" }),
    ]);
    return json({ ok: true, post: { id, spaceId, authorName, title, body: postBody, likeCount: 0, replyCount: 0 } }, 201);
  } catch (error) { return routeError(error); }
}
