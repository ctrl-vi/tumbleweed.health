"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import m from "./motion.module.css";

export function MorphingText() {
  return (
    <span className={m.morphGroup}>
      <span className="sr-only">Start with a text or call.</span>
      <span aria-hidden="true" className={m.morph}>
        <span className={m.morphText}>Start with a text.</span>
        <span className={m.morphCall}>Start with a call.</span>
      </span>
    </span>
  );
}

const useCases = [
  "Find local food resources.",
  "Ideas for meals.",
  "Help understanding food programs.",
];
export function Text3DFlip() {
  const [active, setActive] = useState(false);
  const [choice, setChoice] = useState(0);
  const last = useRef(-1);
  const reduced = useReducedMotion();
  const reveal = () => {
    const choices = useCases.map((_, i) => i).filter((i) => i !== last.current);
    const next = choices[Math.floor(Math.random() * choices.length)];
    last.current = next;
    setChoice(next);
    setActive(true);
  };
  const text = active ? useCases[choice] : "Ask in your own words.";
  return (
    <button
      type="button"
      className={m.flip}
      aria-label="Ask in your own words. Explore example questions"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") reveal();
      }}
      onPointerLeave={() => setActive(false)}
      onFocus={reveal}
      onBlur={() => setActive(false)}
      onClick={reveal}
    >
      <span className="sr-only" aria-live="polite">
        {active ? useCases[choice] : ""}
      </span>
      <span className={m.flipSizer} aria-hidden="true">
        Help understanding food programs.
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          className={m.flipLine}
          aria-hidden="true"
          initial="enter"
          animate="visible"
          exit="exit"
        >
          {text.split(" ").map((word, wi, words) => (
            <span className={m.flipWord} key={wi}>
              {Array.from(word + (wi < words.length - 1 ? "\u00a0" : "")).map(
                (char, ci) => {
                  const i = words.slice(0, wi).join(" ").length + ci;
                  return (
                    <motion.span
                      className={m.flipChar}
                      key={ci}
                      variants={{
                        enter: {
                          opacity: 0,
                          transform: reduced
                            ? "none"
                            : "rotateX(-90deg) translateY(35%)",
                        },
                        visible: {
                          opacity: 1,
                          transform: "rotateX(0deg) translateY(0%)",
                        },
                        exit: {
                          opacity: 0,
                          transform: reduced
                            ? "none"
                            : "rotateX(90deg) translateY(-35%)",
                        },
                      }}
                      transition={
                        reduced
                          ? { duration: 0.15 }
                          : {
                              type: "spring",
                              damping: 25,
                              stiffness: 160,
                              delay: i * 0.03,
                            }
                      }
                    >
                      {char}
                    </motion.span>
                  );
                },
              )}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const items = [
  { href: "/examples/food", label: "See an example", prefix: "/examples" },
  { href: "/partners", label: "For partners", prefix: "/partners" },
  { href: "/language", label: "Language", prefix: "/language" },
];
export function PillNavigation() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const current = items.find((item) => pathname.startsWith(item.prefix))?.href;
  return (
    <nav className={m.navigation} aria-label="Main navigation">
      <div className={m.pillBar} onPointerLeave={() => setHovered(null)}>
        {items.map((item) => (
          <div
            key={item.href}
            className={m.pillItem}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setHovered(item.href);
            }}
          >
            {(hovered || current) === item.href && (
              <motion.span
                className={m.pillIndicator}
                layoutId="navigation-pill"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 360, damping: 32 }
                }
              />
            )}
            <Link
              href={item.href}
              className={m.pillLink}
              aria-current={current === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
