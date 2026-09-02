import { DatabaseUnavailableError } from "@/lib/server/db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ApiValidationError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = "ApiValidationError";
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  let value: unknown;

  try {
    value = await request.json();
  } catch {
    throw new ApiValidationError("Request body must be valid JSON.");
  }

  if (!isRecord(value)) {
    throw new ApiValidationError("Request body must be a JSON object.");
  }

  return value;
}

export function requiredString(
  value: unknown,
  field: string,
  maxLength = 200,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiValidationError(`${field} is required.`, field);
  }

  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new ApiValidationError(`${field} is too long.`, field);
  }

  return normalized;
}

export function optionalString(
  value: unknown,
  field: string,
  maxLength = 200,
): string | null {
  if (value === undefined || value === null || value === "") return null;
  return requiredString(value, field, maxLength);
}

export function normalizedEmail(value: unknown, required = true): string | null {
  if (!required && (value === undefined || value === null || value === "")) return null;

  const email = requiredString(value, "email", 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new ApiValidationError("Enter a valid email address.", "email");
  }

  return email;
}

export function boundedInteger(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) {
    throw new ApiValidationError(
      `${field} must be an integer between ${minimum} and ${maximum}.`,
      field,
    );
  }

  return value as number;
}

export function optionalBoundedInteger(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
  fallback: number,
): number {
  if (value === undefined || value === null || value === "") return fallback;
  return boundedInteger(value, field, minimum, maximum);
}

export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function routeError(error: unknown): Response {
  if (error instanceof ApiValidationError) {
    return json(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.message,
          ...(error.field ? { field: error.field } : {}),
        },
      },
      400,
    );
  }

  if (error instanceof DatabaseUnavailableError) {
    return json(
      {
        ok: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "Supabase baza još nije povezana. Pokušajte ponovo kasnije.",
        },
      },
      503,
    );
  }

  console.error("API request failed", error);
  return json(
    {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
    },
    500,
  );
}
