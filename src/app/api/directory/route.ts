import { NextResponse } from "next/server";
import { getSnapshot, mutate } from "@/server/directory";

// Always run fresh against the DB.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("GET /api/directory failed", err);
    return NextResponse.json({ error: "Failed to load directory" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { action?: string; payload?: Record<string, unknown> };
    if (!body.action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }
    const result = await mutate(body.action, body.payload ?? {});
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Mutation failed";
    console.error("POST /api/directory failed", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
