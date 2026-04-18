import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const SYSTEM = `You are a meeting scheduling assistant for Jayson's portfolio. Extract scheduling details from the conversation.

Today's date is ${todayStr} (${today.toISOString().slice(0, 10)}). Timezone: Asia/Manila.

Return STRICT JSON only (no prose, no code fences) with this shape:
{
  "date": "YYYY-MM-DD" | null,
  "time": "HH:MM AM/PM" | null,   // meeting start time, 12-hour format like "01:00 PM"
  "name": string | null,
  "email": string | null,
  "message": string | null,        // purpose of meeting
  "missing": string[],             // any of: "date","time","name","email","message"
  "reply": string                  // friendly short reply to the user. If missing fields, ask only for what is missing in one sentence. If all fields present, confirm you are creating the meeting now.
}

Rules:
- Interpret relative dates ("tomorrow","next Monday") using today's date above.
- If user gives a range like "1pm - 2pm", use the start time ("01:00 PM"). Meetings default to 1 hour.
- If the user writes an obviously impossible time like "1am - 2pm", assume they meant "1pm - 2pm" and use "01:00 PM".
- Only mark a field as provided when the user clearly stated it.
- Keep "reply" under 2 sentences, warm and concise.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const text = response.choices[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        reply:
          "Sorry, I couldn't understand those details. Could you share the date, time, your name, email, and what you'd like to discuss?",
        missing: ["date", "time", "name", "email", "message"],
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("parse-schedule error:", error);
    return NextResponse.json(
      { error: "Failed to parse" },
      { status: 500 }
    );
  }
}
