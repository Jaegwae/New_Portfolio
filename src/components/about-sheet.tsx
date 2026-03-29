"use client";

import { useRef } from "react";

import { ABOUT_SHEET_CONTENT } from "@/content/about-sheet";
import {
  applyRevealStyles,
  DEFAULT_SECTION_TITLE_REVEAL,
  resetRevealStyles,
  useScrollScene,
} from "@/lib/scroll-motion";

export function AboutSheet() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useScrollScene(({ prefersReducedMotion }) => {
    const viewportHeight = window.innerHeight;

    if (titleRef.current) {
      if (prefersReducedMotion) {
        resetRevealStyles(titleRef.current);
      } else {
        applyRevealStyles(titleRef.current, viewportHeight, DEFAULT_SECTION_TITLE_REVEAL);
      }
    }

    paragraphRefs.current.forEach((paragraph, index) => {
      if (!paragraph) {
        return;
      }

      if (prefersReducedMotion) {
        resetRevealStyles(paragraph);
        return;
      }

      applyRevealStyles(paragraph, viewportHeight, {
        enterOffset: 32 + Math.min(index, 2) * 4,
        exitOffset: 26,
        fadeInStart: 0.03,
        fadeInEnd: 0.14,
      });
    });
  });

  return (
    <section aria-labelledby="about-sheet-title" className="about-sheet">
      <div className="about-sheet__content">
        <div className="about-sheet__main">
          <div className="about-sheet__hero">
            <p className="about-sheet__eyebrow">{ABOUT_SHEET_CONTENT.eyebrow}</p>
            <h2 className="about-sheet__title" id="about-sheet-title" ref={titleRef}>
              {ABOUT_SHEET_CONTENT.title}
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
