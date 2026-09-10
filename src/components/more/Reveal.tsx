"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealVariant = "up" | "down" | "left" | "right" | "zoom" | "tilt" | "mask";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  as?: "div" | "section" | "span" | "h2" | "h3" | "p";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
      data-variant={variant}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* MaskedLines — headline lines slide up out of an overflow mask.      */
/* Observes the untransformed wrapper: the translated inner line is    */
/* fully clipped by the mask, so observing IT would never trigger.     */
/* ------------------------------------------------------------------ */
export function MaskedLines({
  lines,
  delayStep = 110,
  startDelay = 0,
  lineClassName = "",
  wrapperClassName = "",
}: {
  lines: ReactNode[];
  delayStep?: number;
  startDelay?: number;
  lineClassName?: string;
  wrapperClassName?: string;
}) {
  return (
    <span className={`block ${wrapperClassName}`}>
      {lines.map((line, i) => (
        <MaskedLine
          key={i}
          delay={startDelay + i * delayStep}
          lineClassName={lineClassName}
        >
          {line}
        </MaskedLine>
      ))}
    </span>
  );
}

function MaskedLine({
  children,
  delay,
  lineClassName,
}: {
  children: ReactNode;
  delay: number;
  lineClassName?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            inner.classList.add("is-visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={wrapRef}
      className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"
    >
      <span
        ref={innerRef}
        data-variant="mask"
        className={`reveal block ${lineClassName}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}
