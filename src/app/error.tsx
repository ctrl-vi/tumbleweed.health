"use client";
import { Page, s } from "@/components/site";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Page
      title="Something didn’t load."
      intro="Please try again. You can still use your phone to text Tumbleweed at (509) 206-9073."
    >
      <button className={s.button} onClick={reset}>
        Try again
      </button>
    </Page>
  );
}
