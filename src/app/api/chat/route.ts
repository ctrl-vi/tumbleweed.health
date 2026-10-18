import { NextResponse } from "next/server";
import { allowedOrigin, jsonError, readBody } from "@/lib/server/request";
export async function POST(request: Request) {
  if (!allowedOrigin(request))
    return jsonError("This request could not be accepted.", 403);
  const base = process.env.TUMBLEWEED_API_URL;
  if (!base)
    return jsonError(
      "The browser demo is not connected yet. You can still text Tumbleweed.",
      503,
    );
  let body;
  try {
    body = await readBody(request);
  } catch {
    return jsonError("Please send a valid question.", 400);
  }
  if (
    typeof body.text !== "string" ||
    !body.text.trim() ||
    body.text.length > 1000 ||
    typeof body.handle !== "string" ||
    !/^web:[A-Za-z0-9-]{1,64}$/.test(body.handle)
  )
    return jsonError("Enter a question of up to 1,000 characters.", 422);
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: body.handle, text: body.text.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(40000),
    });
    if (!res.ok)
      return jsonError(
        res.status === 429
          ? "The service is busy. Please wait a moment and try again."
          : "We couldn’t get a reply. Your question is still here to retry.",
        res.status === 429 ? 429 : 502,
      );
    const result = await res.json();
    if (typeof result.reply !== "string" || !result.reply.trim())
      return jsonError(
        "We received an incomplete reply. Please try again.",
        502,
      );
    return NextResponse.json(
      { reply: result.reply },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return jsonError(
      "The service did not respond in time. Please try again, or start a text.",
      504,
    );
  }
}
