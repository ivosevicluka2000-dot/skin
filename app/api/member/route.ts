import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ ok: false, member: null }, { status: 401 });
  return Response.json({ ok: true, member: { id: user.userId, name: user.displayName, email: user.email, source: "chatgpt" } });
}
