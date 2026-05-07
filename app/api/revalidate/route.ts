import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity webhook target.
 *
 * When the dancer publishes any document in the Studio, Sanity sends a POST
 * request here with the document's _id and _type. We invalidate every page
 * (root layout) so the next visitor sees fresh content immediately.
 *
 * SETUP (one-time, in Sanity dashboard):
 *
 * 1. Add `SANITY_REVALIDATE_SECRET` to your Vercel + .env.local env vars
 *    (any random string — generate with `openssl rand -base64 32`).
 * 2. In sanity.io/manage → API → Webhooks → Create Webhook:
 *    - URL:    https://YOUR-DOMAIN.com/api/revalidate
 *    - Trigger on:  Create, Update, Delete
 *    - Filter:  _type in ["siteSettings", "portfolioItem", "resumeSection"]
 *    - HTTP method: POST
 *    - Secret: paste the same value as SANITY_REVALIDATE_SECRET
 *    - Headers: (leave default)
 *
 * 3. Publish a change in Sanity → site updates within seconds.
 *
 * Sanity sends the secret in the `sanity-webhook-signature` header, but for
 * simplicity here we accept it as a Bearer token. Switch to signature
 * verification (`@sanity/webhook`'s `parseBody`) for stricter security if
 * you start handling more sensitive payloads.
 */

const SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.nextUrl.searchParams.get("secret");

  if (provided !== SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid secret" },
      { status: 401 },
    );
  }

  try {
    revalidatePath("/", "layout");
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        revalidated: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET handler — convenient manual trigger from the browser:
 *   https://your-site.com/api/revalidate?secret=YOUR_SECRET
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
