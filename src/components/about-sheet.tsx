"use client";

/**
 * AI_NOTE:
 * Role: renders the editorial about-sheet section using audited content data.
 * Motion should stay delegated to useGsapScrollReveal; avoid embedding new scroll runtime here.
 */

import { Fragment, useRef } from "react";

import { ABOUT_SHEET_CONTENT } from "@/content/about-sheet";
import { useGsapScrollReveal } from "@/lib/gsap-reveal";

export function AboutSheet() {
  // AI_CONTEXT:
  // These refs only support the shared GSAP reveal helper.
  // Keep DOM measurement local to this section instead of lifting it into global runtime state.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  // AI_CONTEXT:
  // Reveal thresholds are tuned for this section's editorial pacing.
  // If the title/body structure changes, revisit this mapping together with the CSS spacing.
  useGsapScrollReveal(() => [
    {
      element: titleRef.current,
      fromY: 58,
      toY: -42,
      start: "top 96%",
      end: "bottom 78%",
    },
    ...paragraphRefs.current.map((paragraph, index) => ({
      element: paragraph,
      fromY: 32 + Math.min(index, 2) * 4,
      toY: -26,
      start: "top 97%",
      end: "bottom 86%",
    })),
  ]);

  // AI_CONTEXT:
  // The title is rendered from structured `titleLines` content.
  // Avoid reintroducing HTML-like formatting into the content source.
  return (
    <section aria-labelledby="about-sheet-title" className="about-sheet">
      <div className="about-sheet__content">
        <div className="about-sheet__main">
          <div className="about-sheet__hero">
            <p className="about-sheet__eyebrow">{ABOUT_SHEET_CONTENT.eyebrow}</p>
            <h2 className="about-sheet__title" id="about-sheet-title" ref={titleRef}>
              {ABOUT_SHEET_CONTENT.titleLines.map((line, index) => (
                <Fragment key={`${line}-${index}`}>
                  {line}
                  {index < ABOUT_SHEET_CONTENT.titleLines.length - 1 ? <br /> : null}
                </Fragment>
              ))}
            </h2>
          </div>

          <div className="about-sheet__body">
            {ABOUT_SHEET_CONTENT.paragraphs.map((paragraph, index) => (
              <p
                className="about-sheet__paragraph"
                key={paragraph}
                ref={(node) => {
                  paragraphRefs.current[index] = node;
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
