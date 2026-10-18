import type { ReactNode } from "react";
import { PillNavigation } from "./motion";
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
    <Action primary className={s.shiny} href={service.smsHref}>
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
      <PillNavigation />
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
      className={s.productPreview}
      aria-label={`${e.label}: sample text conversation`}
    >
      <div className={s.device}>
        <div className={s.deviceScreen}>
          <div className={s.statusBar} aria-hidden="true">
            <span>9:41</span>
            <span className={s.island} />
            <span className={s.statusIcons}>
              ▮▮▮ <span className={s.battery} />
            </span>
          </div>
          <div className={s.contactHeader}>
            <span className={s.backChevron} aria-hidden="true">
              ‹
            </span>
            <img src="/brand/tumbleweed.png" width={36} height={36} alt="" />
            <strong>
              Tumbleweed <span aria-hidden="true">›</span>
            </strong>
          </div>
          <div className={s.phoneTranscript}>
            <p className={s.transcriptDate}>
              Text message · SMS
              <br />
              <span>Today 9:41 AM</span>
            </p>
            <div className={`${s.bubble} ${s.sentBubble}`}>
              <span className="sr-only">You: </span>
              <p>{e.question}</p>
            </div>
            <div className={`${s.bubble} ${s.receivedBubble}`}>
              <span className="sr-only">Tumbleweed: </span>
              <p>{e.reply}</p>
            </div>
          </div>
          <div className={s.mockComposer} aria-hidden="true">
            <span>＋</span>
            <div>
              Text message <span>↑</span>
            </div>
          </div>
          <div className={s.homeIndicator} aria-hidden="true" />
        </div>
      </div>
      <p className={s.previewCaption}>
        Sample conversation <span aria-hidden="true">·</span> No message is
        sent.
      </p>
    </section>
  );
}
