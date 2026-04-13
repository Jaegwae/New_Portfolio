"use client";

/**
 * AI_NOTE:
 * Role: renders manifesto copy and visual word-reveal styling.
 * Input wordProgress is controlled by the hero manifesto runtime, not locally derived here.
 */

import { useMemo } from "react";

const MANIFESTO_LINES = [
  ["복잡한", "문제를", "구조화합니다."],
  ["자연스러운", "디지털 경험을", "설계합니다."],
  ["의미있는", "사용자 경험을", "전달합니다."],
] as const;

type ManifestoSectionProps = {
  wordProgress: number;
};

export function ManifestoSection({ wordProgress }: ManifestoSectionProps) {
  // AI_CONTEXT:
  // One normalized progress number is mapped into per-word visual state.
  // Timing decisions belong to the runtime; rendering decisions belong here.
  const wordStyles = useMemo(() => {
    const muted: [number, number, number] = [10, 10, 12];
    const bright: [number, number, number] = [245, 243, 237];
    const totalWords = MANIFESTO_LINES.reduce((count, line) => count + line.length, 0);
    const revealStart = 0.06;
    const revealEnd = 0.98;

    return MANIFESTO_LINES.map((line, lineIndex) =>
      line.map((_, wordIndex) => {
        const flatIndex =
          MANIFESTO_LINES.slice(0, lineIndex).reduce((count, currentLine) => count + currentLine.length, 0) + wordIndex;
        const start =
          totalWords > 1 ? revealStart + ((revealEnd - revealStart) * flatIndex) / (totalWords - 1) : revealStart;
        const isActive = wordProgress >= start;

        const style = {
          color: `rgb(${(isActive ? bright : muted).join(" ")})`,
        };

        return style;
      }),
    );
  }, [wordProgress]);

  return (
    <section className="manifesto-section">
      <div className="manifesto-section__sticky">
        <div className="manifesto-section__copy">
          {MANIFESTO_LINES.map((line, lineIndex) => (
            <p className="manifesto-section__line" key={line.join("-")}>
              {line.map((word, wordIndex) => (
                <span className="manifesto-section__word" key={`${word}-${wordIndex}`} style={wordStyles[lineIndex][wordIndex]}>
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
