import {
  json,
  normalizedEmail,
  optionalString,
  readJsonObject,
  routeError,
  ApiValidationError,
} from "@/lib/server/api";
import { eventStatement, getDatabase, stableId } from "@/lib/server/db";

interface NewsletterRow {
  id: string;
  email: string;
  firstName: string | null;
  source: string;
  createdAt: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await readJsonObject(request);
    if (body.consent === false) {
      throw new ApiValidationError("Consent is required to join the newsletter.", "consent");
    }

    const email = normalizedEmail(body.email) as string;
    const firstName = optionalString(body.firstName, "firstName", 80);
    const source = optionalString(body.source, "source", 80) ?? "website";
    const id = stableId("nws");
    const database = await getDatabase();

    await database.batch([
      database
        .prepare(
          `INSERT INTO newsletter_signups
            (id, email, first_name, source, consent)
           VALUES (?, ?, ?, ?, 1)
           ON CONFLICT(email) DO UPDATE SET
             first_name = COALESCE(excluded.first_name, newsletter_signups.first_name),
             source = excluded.source,
             consent = 1,
             updated_at = CURRENT_TIMESTAMP`,
        )
        .bind(id, email, firstName, source),
      eventStatement(database, "newsletter.signup", "newsletter_signup", id, { source }),
    ]);

    const signup = await database
      .prepare(
        `SELECT id, email, first_name AS firstName, source, created_at AS createdAt
         FROM newsletter_signups
         WHERE email = ?`,
      )
      .bind(email)
      .first<NewsletterRow>();

    return json({ ok: true, signup }, 201);
  } catch (error) {
    return routeError(error);
  }
}
