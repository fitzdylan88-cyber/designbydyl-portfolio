/** Leaves draft mode and goes back to the page you were on. */
import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL(request.nextUrl.searchParams.get("redirect") ?? "/", request.url));
}
