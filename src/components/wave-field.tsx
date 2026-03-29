import type { CSSProperties } from "react";

const TOTAL_LINES = 26;

function createPath(index: number) {
  const offset = index * 13;
  const startY = 850 - index * 12;
  const c1y = 790 - offset;
  const c2y = 1080 - index * 6;
  const midY = 760 - index * 18;
  const c3y = 520 - index * 9;
  const endY = 250 + index * 7;

  return `M -220 ${startY} C 120 ${c1y}, 360 ${c2y}, 760 ${midY} S 1180 ${c3y}, 1680 ${endY}`;
}

export function WaveField() {
  return (
    <div aria-hidden="true" className="wave-field">
      <svg
        className="wave-field__svg"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        {Array.from({ length: TOTAL_LINES }, (_, index) => (
          <path
            className="wave-field__line"
            d={createPath(index)}
            key={index}
            pathLength="1"
            style={
              {
                "--line-delay": `${index * 0.05}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>
    </div>
  );
}
