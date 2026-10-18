import type { ReactNode } from "react";
import { examples, type Topic } from "@/content/examples";
import { service } from "@/lib/config";
import s from "./site.module.css";
export { s };
export function Action({
  href,
  children,
  primary = false,
  className = "",
  current = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  className?: string;
  current?: boolean;
}) {
  return (
    <a
      href={href}
      className={`${s.button} ${primary ? s.primary : ""} ${current ? s.selected : ""} ${className}`}
      aria-current={current ? "page" : undefined}
    >
      {children}
    </a>
  );
}
export function TextAction() {
  return (
    <Action primary href={service.smsHref}>
      Text Tumbleweed
    </Action>
  );
}
export function Header() {
  return (
    <header className={s.header}>
      <a className={s.brand} href="/" aria-label="Tumbleweed home">
        <img
          className={s.logo}
          src="/brand/tumbleweed.png"
          alt=""
          width={40}
          height={40}
        />
        <span>tumbleweed</span>
      </a>
      <Action className={s.example} href="/examples/food">
        See an example
      </Action>
      <Action className={s.partners} href="/partners">
        For partners
      </Action>
      <Action className={s.language} href="/language">
        Language
      </Action>
    </header>
  );
}
export function Footer() {
  return (
    <footer className={s.footer}>
      <h2>A useful next step.</h2>
      <nav className={s.footerLinks} aria-label="Footer">
        <Action href="/help">Help & privacy</Action>
        <Action href="/start">Start texting</Action>
        <Action href="/demo">Browser demo</Action>
      </nav>
      <p className={s.hint}>
        DubHacks ’26 preview. Sample conversations are illustrative.
      </p>
      <p className={s.hint}>
        <a href="/privacy">Privacy information</a> ·{" "}
        <a href="/">Back to home</a>
      </p>
    </footer>
  );
}
export function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className={s.page}>
      <h1>{title}</h1>
      {intro && <p className={s.lede}>{intro}</p>}
      {children}
    </div>
  );
}
export function Conversation({ topic = "food" }: { topic?: Topic }) {
  const e = examples[topic];
  return (
    <section
      className={s.conversation}
      aria-label={`${e.label}: sample text conversation`}
    >
      <div className={s.conversationHeader}>
        <strong>Tumbleweed</strong>
        <p className={s.hint}>Sample text conversation</p>
      </div>
      <div className={`${s.message} ${s.user}`}>
        <small>You</small>
        <p>{e.question}</p>
      </div>
      <div className={s.message}>
        <small>Tumbleweed</small>
        <p>{e.reply}</p>
      </div>
      <p className={s.hint}>Example only. No message is sent.</p>
    </section>
  );
}
