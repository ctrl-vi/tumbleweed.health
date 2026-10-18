"use client";
import { useEffect, useRef, useState } from "react";
import { partnerErrors, type PartnerDetails } from "@/lib/validation";
import s from "./site.module.css";
const empty = { organization: "", email: "", area: "", details: "" };
const fields = [
  ["organization", "Organization name", "Your organization"],
  ["email", "Contact email", "name@organization.org"],
  ["area", "Town or ZIP code", "Where you serve"],
  [
    "details",
    "Resource details",
    "Location, hours, languages, and access information",
  ],
] as const;
export function PartnerForm({ enabled }: { enabled: boolean }) {
  const [data, setData] = useState<PartnerDetails>(empty),
    [errors, setErrors] = useState<
      Partial<Record<keyof PartnerDetails, string>>
    >({}),
    [stage, setStage] = useState<"edit" | "review" | "success">("edit"),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  const requestId = useRef("");
  useEffect(() => {
    if (stage !== "edit") heading.current?.focus();
  }, [stage]);
  async function submit() {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestId.current,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) throw new Error();
      setStage("success");
    } catch {
      setError(
        "We couldn’t confirm receipt. Your details are still here. Please try again.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  if (stage === "success")
    return (
      <div className={s.notice}>
        <h2 ref={heading} tabIndex={-1}>
          Thank you for sharing.
        </h2>
        <p>
          Your details have been received for review. They will not be published
          automatically.
        </p>
        <button
          className={s.button}
          onClick={() => {
            setData(empty);
            setStage("edit");
          }}
        >
          Add another resource
        </button>
      </div>
    );
  if (stage === "review")
    return (
      <div className={s.form}>
        <h2 ref={heading} tabIndex={-1}>
          Review your details.
        </h2>
        <dl className={s.review}>
          {fields.map(([key, label]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>{data[key]}</dd>
            </div>
          ))}
        </dl>
        <p className={s.hint}>
          {enabled
            ? "Submitting shares these details with Tumbleweed for review."
            : "Nothing has been submitted. Partner intake is not open yet; this review stays in your browser."}{" "}
          <a href="/privacy">Privacy information</a>
        </p>
        {error && (
          <p role="alert" className={s.error}>
            {error}
          </p>
        )}
        <div className={s.actions}>
          <button
            disabled={pending}
            className={s.button}
            onClick={() => {
              setStage("edit");
              setError("");
            }}
          >
            Back to edit
          </button>
          {enabled && (
            <button
              disabled={pending}
              className={`${s.button} ${s.primary}`}
              onClick={submit}
            >
              {pending ? "Submitting…" : "Submit for review"}
            </button>
          )}
        </div>
      </div>
    );
  return (
    <form
      className={s.form}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const problems = partnerErrors(data);
        setErrors(problems);
        if (Object.keys(problems).length) {
          document.getElementById(Object.keys(problems)[0])?.focus();
          return;
        }
        requestId.current = crypto.randomUUID();
        setStage("review");
      }}
    >
      {fields.map(([key, label, placeholder]) => (
        <div className={s.field} key={key}>
          <label htmlFor={key}>{label}</label>
          {key === "details" ? (
            <textarea
              id={key}
              value={data[key]}
              placeholder={placeholder}
              maxLength={3000}
              required
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
            />
          ) : (
            <input
              id={key}
              type={key === "email" ? "email" : "text"}
              autoComplete={
                key === "email"
                  ? "email"
                  : key === "organization"
                    ? "organization"
                    : "off"
              }
              value={data[key]}
              maxLength={key === "email" ? 254 : 160}
              placeholder={placeholder}
              required
              aria-invalid={!!errors[key]}
              aria-describedby={errors[key] ? `${key}-error` : undefined}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
            />
          )}{" "}
          {errors[key] && (
            <p id={`${key}-error`} className={s.error}>
              {errors[key]}
            </p>
          )}
        </div>
      ))}
      <button className={`${s.button} ${s.primary}`} type="submit">
        Review details
      </button>
      <p className={s.hint}>
        Only share information your organization is comfortable providing.{" "}
        <a href="/privacy">How this information is used.</a>
      </p>
      <noscript>
        Reviewing this form needs JavaScript. No information has been sent.
      </noscript>
    </form>
  );
}
