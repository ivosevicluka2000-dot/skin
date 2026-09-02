export async function GET() {
  return Response.json({ ok: false, member: null }, { status: 401 });
}
