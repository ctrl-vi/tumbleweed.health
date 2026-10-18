"use client";
import { useState } from "react";
import { service } from "@/lib/config";
import s from "./site.module.css";
export function CopyNumber() {
  const [status, setStatus] = useState("");
  return (
    <>
      <button
        className={s.button}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(service.phone);
            setStatus("Number copied.");
          } catch {
            setStatus("Select the number above to copy it.");
          }
        }}
      >
        Copy number
      </button>
      <p role="status" className={s.hint}>
        {status}
      </p>
    </>
  );
}
