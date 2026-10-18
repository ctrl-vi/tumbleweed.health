import { NextResponse } from "next/server";
import { allowedOrigin, jsonError, readBody } from "@/lib/server/request";
import { partnerErrors, type PartnerDetails } from "@/lib/validation";
export async function POST(request: Request) {
  if (!allowedOrigin(request))
    return jsonError("This request could not be accepted.", 403);
  const endpoint = process.env.PARTNER_INTAKE_URL;
  if (!endpoint)
    return jsonError(
      "Partner intake is not open yet. Nothing has been submitted.",
      503,
    );
  let body;
  try {
    body = await readBody(request);
  } catch {
    return jsonError("Please check your details.", 400);
  }
  if (
    !["organization", "email", "area", "details"].every(
      (key) => typeof body[key] === "string",
    )
  )
    return jsonError("Please complete all fields.", 422);
  const data = {
    organization: (body.organization as string).trim(),
    email: (body.email as string).trim(),
    area: (body.area as string).trim(),
    details: (body.details as string).trim(),
  } satisfies PartnerDetails;
  if (Object.keys(partnerErrors(data)).length)
    return jsonError("Please check your details.", 422);
  const key = request.headers.get("Idempotency-Key");
  if (!key || !/^[A-Za-z0-9-]{1,64}$/.test(key))
    return jsonError(
      "Please review your details again before submitting.",
      400,
    );
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": key,
        ...(process.env.PARTNER_INTAKE_TOKEN
          ? { Authorization: `Bearer ${process.env.PARTNER_INTAKE_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok)
      return jsonError("We couldn’t confirm receipt. Please try again.", 502);
    return NextResponse.json(
      { received: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return jsonError("We couldn’t confirm receipt. Please try again.", 504);
  }
}
