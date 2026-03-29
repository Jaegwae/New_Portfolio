"use client";

import { useRef } from "react";

import { ABOUT_SHEET_CONTENT } from "@/content/about-sheet";
import { useGsapScrollReveal } from "@/lib/gsap-reveal";

export function AboutSheet() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const titleWords = ABOUT_SHEET_CONTENT.title.split(/\s+/).filter(Boolean);

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

  return (
    <section aria-labelledby="about-sheet-title" className="about-sheet">
      <div className="about-sheet__content">
        <div className="about-sheet__main">
          <div className="about-sheet__hero">
            <p className="about-sheet__eyebrow">{ABOUT_SHEET_CONTENT.eyebrow}</p>
            <h2 className="about-sheet__title" id="about-sheet-title" ref={titleRef}>
              {titleWords.map((word) => (
                <span className="about-sheet__title-word" key={word}>
                  {word}
                </span>
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
