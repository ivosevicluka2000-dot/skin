import { getChatGPTUser } from "@/app/chatgpt-auth";
import { ApiValidationError, optionalString } from "./api";

export async function resolveOwner(candidate: unknown): Promise<{ ownerId: string; email: string | null; authenticated: boolean }> {
  const user = await getChatGPTUser();
  if (user) return { ownerId: `oai:${user.userId}`, email: user.email, authenticated: true };
  const sessionId = optionalString(candidate, "ownerId", 128);
  if (!sessionId || !/^[a-zA-Z0-9_-]{16,128}$/.test(sessionId)) {
    throw new ApiValidationError("A valid guest session is required.", "ownerId");
  }
  return { ownerId: `guest:${sessionId}`, email: null, authenticated: false };
}
