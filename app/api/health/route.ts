import { getDatabase } from "@/lib/server/db";
import { json, routeError } from "@/lib/server/api";

export async function GET(): Promise<Response> {
  try {
    const database = await getDatabase();
    const probe = await database.prepare("SELECT 1 AS healthy").first<{ healthy: number }>();

    return json({
      ok: probe?.healthy === 1,
      service: "zlatna-koka-api",
      database: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return routeError(error);
  }
}
