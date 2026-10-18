"use client";
import { useEffect, useRef, useState } from "react";
import { examples } from "@/content/examples";
import s from "./site.module.css";
type Message = { role: "user" | "assistant"; text: string };
export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]),
    [draft, setDraft] = useState(""),
    [pending, setPending] = useState(false),
    [error, setError] = useState(""),
    [announcement, setAnnouncement] = useState("");
  const busy = useRef(false),
    controller = useRef<AbortController | null>(null),
    generation = useRef(0),
    handle = useRef(""),
    transcript = useRef<HTMLDivElement>(null),
    input = useRef<HTMLTextAreaElement>(null),
    nearBottom = useRef(true);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (nearBottom.current && transcript.current)
      transcript.current.scrollTop = transcript.current.scrollHeight;
  }, [messages, pending]);
  async function send() {
    const text = draft.trim();
    if (busy.current) return;
    if (!text) {
      setError("Enter a question to start.");
      input.current?.focus();
      return;
    }
    if (!handle.current) handle.current = `web:${crypto.randomUUID()}`;
    const version = generation.current;
    busy.current = true;
    setPending(true);
    setError("");
    setAnnouncement("Sending your question.");
    setMessages((old) => [...old, { role: "user", text }]);
    setDraft("");
    const abort = new AbortController();
    controller.current = abort;
    const timer = setTimeout(() => abort.abort(), 45000);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.current, text }),
        signal: abort.signal,
      });
      const body = await res.json();
      if (!res.ok || typeof body.reply !== "string")
        throw new Error(body.error || "We couldn’t get a reply.");
      if (version !== generation.current) return;
      setMessages((old) => [...old, { role: "assistant", text: body.reply }]);
      setAnnouncement(`Tumbleweed: ${body.reply}`);
    } catch (err) {
      if (version !== generation.current) return;
      setMessages((old) => old.slice(0, -1));
      setDraft(text);
      setError(
        err instanceof Error && err.name !== "AbortError"
          ? err.message
          : "The reply took too long. Your question is still here. Try again.",
      );
      setAnnouncement("No reply received. Your question is ready to retry.");
    } finally {
      clearTimeout(timer);
      if (version === generation.current) {
        busy.current = false;
        setPending(false);
      }
    }
  }
  function reset() {
    generation.current++;
    controller.current?.abort();
    busy.current = false;
    handle.current = "";
    setMessages([]);
    setDraft("");
    setPending(false);
    setError("");
    setAnnouncement("New conversation started.");
    input.current?.focus();
  }
  return (
    <section className={s.conversation} aria-label="Live browser conversation">
      <div className={s.conversationHeader}>
        <strong>Tumbleweed</strong>
        <p className={s.hint}>Ask in your own words.</p>
      </div>
      <div
        className={s.transcript}
        ref={transcript}
        role="region"
        aria-label="Conversation messages"
        tabIndex={0}
        onScroll={(e) => {
          const n = e.currentTarget;
          nearBottom.current =
            n.scrollHeight - n.scrollTop - n.clientHeight < 80;
        }}
      >
        {messages.length === 0 ? (
          <p>
            What would help today? Ask about food nearby, a meal idea, or food
            programs.
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`${s.message} ${m.role === "user" ? s.user : ""}`}
            >
              <small>{m.role === "user" ? "You" : "Tumbleweed"}</small>
              <p style={{ whiteSpace: "pre-wrap" }}>{m.text}</p>
            </div>
          ))
        )}
        {pending && <p className={s.chatStatus}>Looking into your question…</p>}
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {messages.length === 0 && (
        <div className={s.actions}>
          {Object.values(examples).map((e) => (
            <button
              key={e.label}
              disabled={pending}
              className={s.button}
              onClick={() => {
                setDraft(e.question);
                input.current?.focus();
              }}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}
      <form
        className={`${s.form} ${s.composer}`}
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <div className={s.field}>
          <label htmlFor="question">Your question</label>
          <textarea
            ref={input}
            id="question"
            value={draft}
            maxLength={1000}
            disabled={pending}
            aria-invalid={!!error}
            aria-describedby={error ? "chat-error" : "chat-hint"}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="For example, where can I find food near Omak?"
          />
          <p id="chat-hint" className={s.hint}>
            Up to 1,000 characters. Shift + Enter adds a new line.
          </p>
        </div>
        {error && (
          <p id="chat-error" role="alert" className={s.error}>
            {error}
          </p>
        )}
        <div className={s.actions}>
          <button
            disabled={pending}
            className={`${s.button} ${s.primary}`}
            type="submit"
          >
            {pending ? "Sending…" : error ? "Try again" : "Send question"}
          </button>
          <button className={s.button} type="button" onClick={reset}>
            New conversation
          </button>
        </div>
      </form>
      <p className={s.hint}>
        A new conversation clears this view; it does not delete messages already
        received by the service. <a href="/privacy">Privacy information</a>
      </p>
      <noscript>
        The live demo needs JavaScript. You can still{" "}
        <a href="/start">text Tumbleweed</a> or read the sample conversations.
      </noscript>
    </section>
  );
}
