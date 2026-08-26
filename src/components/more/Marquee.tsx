const TEXT = "GROW EVERY DAY · ";

/* A huge rotating dial: only its top arc peeks above the fold, so the
   forest band + ticker text appear curved exactly like a circle edge. */
export function Marquee() {
  const repeated = Array.from({ length: 10 }).map((_, i) => TEXT).join("");

  return (
    <section
      aria-hidden="true"
      className="relative z-10 -mt-2 h-[240px] overflow-hidden sm:h-[300px]"
    >
      <div className="animate-spin-slower absolute left-1/2 top-6 h-[1400px] w-[1400px] -translate-x-1/2 sm:top-10">
        <svg viewBox="0 0 1400 1400" className="h-full w-full">
          <defs>
            <path
              id="dial-path"
              d="M700,700 m-600,0 a600,600 0 1,1 1200,0 a600,600 0 1,1 -1200,0"
              fill="none"
            />
          </defs>
          {/* forest band drawn along the circle */}
          <circle
            cx="700"
            cy="700"
            r="600"
            fill="none"
            stroke="var(--forest)"
            strokeWidth="96"
          />
          {/* ticker text riding the same circle */}
          <text
            fill="var(--sage)"
            className="font-display"
            fontSize="64"
            letterSpacing="6"
          >
            <textPath href="#dial-path">{repeated}</textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
