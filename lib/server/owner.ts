import { ApiValidationError, optionalString } from "./api";

export async function resolveOwner(candidate: unknown): Promise<{ ownerId: string; email: string | null; authenticated: boolean }> {
  const sessionId = optionalString(candidate, "ownerId", 128);
  if (!sessionId || !/^[a-zA-Z0-9_-]{16,128}$/.test(sessionId)) {
    throw new ApiValidationError("A valid guest session is required.", "ownerId");
  }
  return { ownerId: `guest:${sessionId}`, email: null, authenticated: false };
}
