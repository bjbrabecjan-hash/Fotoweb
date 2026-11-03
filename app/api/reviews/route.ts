import { NextResponse } from "next/server";
import { publicReviews } from "@/lib/review-store";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ reviews: await publicReviews() }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Recenze nyní nejsou dostupné." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
