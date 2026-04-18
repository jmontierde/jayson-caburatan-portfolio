import { NextRequest, NextResponse } from "next/server";

async function getAccessToken() {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  return data.access_token || null;
}

function buildGoogleCalendarUrl(
  start: Date,
  end: Date,
  name: string,
  email: string,
  message: string
) {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Meeting with ${name}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Scheduled via portfolio\nName: ${name}\nEmail: ${email}\nMessage: ${message || "N/A"}`,
    add: `${email},caburatanjayson92@gmail.com`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function POST(req: NextRequest) {
  try {
    const { date, time, name, email, message } = await req.json();

    if (!date || !time || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [hourStr, minutePart] = time.split(":");
    const [minutes, period] = minutePart.split(" ");
    let hour = parseInt(hourStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const start = new Date(date);
    start.setHours(hour, parseInt(minutes), 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const fallbackUrl = buildGoogleCalendarUrl(start, end, name, email, message);

    // Try creating event with OAuth
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        fallback: true,
        googleCalendarUrl: fallbackUrl,
      });
    }

    const event = {
      summary: `Meeting with ${name}`,
      description: `Scheduled via portfolio\n\nName: ${name}\nEmail: ${email}\nMessage: ${message || "N/A"}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "Asia/Manila",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Asia/Manila",
      },
      attendees: [
        { email: "caburatanjayson92@gmail.com" },
        { email },
      ],
      conferenceData: {
        createRequest: {
          requestId: `portfolio-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(event),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Google Calendar API error:", err);
      return NextResponse.json({
        success: false,
        fallback: true,
        googleCalendarUrl: fallbackUrl,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      eventId: data.id,
      htmlLink: data.htmlLink,
      meetLink: data.conferenceData?.entryPoints?.find(
        (e: { entryPointType: string }) => e.entryPointType === "video"
      )?.uri || null,
    });
  } catch (error) {
    console.error("Schedule API error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
