import { products } from "@/lib/data/catalog";
import { json, routeError } from "@/lib/server/api";
import { getDatabase } from "@/lib/server/db";
import { getChatGPTUser } from "@/app/chatgpt-auth";

type SummaryRow = {
  orderCount: number;
  revenueCents: number;
  pendingCount: number;
  customerCount: number;
};

type TrendRow = { day: string; revenueCents: number; orderCount: number };
type EventRow = { eventType: string; createdAt: string; subjectId: string | null };

export async function GET(): Promise<Response> {
  try {
    const user = await getChatGPTUser();
    if (!user) return json({ ok: false, error: { code: "AUTH_REQUIRED", message: "Admin sign-in is required." } }, 401);
    const database = await getDatabase();
    const [summary, trendResult, eventResult, routineCount, subscriberCount] = await Promise.all([
      database.prepare(`SELECT
        COUNT(*) AS orderCount,
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_cents ELSE 0 END), 0) AS revenueCents,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pendingCount,
        COUNT(DISTINCT email) AS customerCount
        FROM orders`).first<SummaryRow>(),
      database.prepare(`SELECT
        substr(created_at, 1, 10) AS day,
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_cents ELSE 0 END), 0) AS revenueCents,
        COUNT(*) AS orderCount
        FROM orders
        WHERE datetime(created_at) >= datetime('now', '-6 days')
        GROUP BY substr(created_at, 1, 10)
        ORDER BY day ASC`).all<TrendRow>(),
      database.prepare(`SELECT event_type AS eventType, subject_id AS subjectId, created_at AS createdAt
        FROM event_log ORDER BY created_at DESC LIMIT 8`).all<EventRow>(),
      database.prepare("SELECT COUNT(*) AS count FROM saved_routines").first<{ count: number }>(),
      database.prepare("SELECT COUNT(*) AS count FROM newsletter_signups").first<{ count: number }>(),
    ]);

    return json({
      ok: true,
      overview: {
        orders: summary?.orderCount ?? 0,
        revenueCents: summary?.revenueCents ?? 0,
        pending: summary?.pendingCount ?? 0,
        customers: summary?.customerCount ?? 0,
        routines: routineCount?.count ?? 0,
        subscribers: subscriberCount?.count ?? 0,
        catalogSize: products.length,
        lowStock: products.filter((product) => product.stock.quantity <= 20).map((product) => ({
          id: product.id,
          name: product.name,
          quantity: product.stock.quantity,
          status: product.stock.status,
        })),
        trend: trendResult.results ?? [],
        events: eventResult.results ?? [],
      },
    });
  } catch (error) {
    return routeError(error);
  }
}
