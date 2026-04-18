import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback/google`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    return NextResponse.json(
      { error: tokens.error, description: tokens.error_description },
      { status: 400 }
    );
  }

  // Display the refresh token so you can copy it to .env.local
  return new NextResponse(
    `<html>
      <body style="background:#101014;color:white;font-family:monospace;padding:40px;">
        <h2 style="color:#EDFF21;">Google Calendar Connected!</h2>
        <p>Copy this refresh token and add it to your <code>.env.local</code> as:</p>
        <pre style="background:#1a1a1f;padding:16px;border-radius:8px;overflow-x:auto;border:1px solid #333;">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
        <p style="color:#888;">Then restart your dev server. You only need to do this once.</p>
        <p style="color:#555;font-size:12px;margin-top:32px;">Access token (temporary): ${tokens.access_token?.slice(0, 20)}...</p>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
