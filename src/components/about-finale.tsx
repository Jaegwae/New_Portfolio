"use client";

import { useRef } from "react";

import { ABOUT_FINALE_CONTENT } from "@/content/about-finale";
import { useGsapScrollReveal } from "@/lib/gsap-reveal";

export function AboutFinale() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGsapScrollReveal(() => [
    {
      element: titleRef.current,
      fromY: 58,
      toY: -42,
      start: "top 96%",
      end: "bottom 78%",
    },
  ]);

  return (
    <section aria-labelledby="about-finale-title" className="about-finale">
      <div className="about-finale__inner">
        <div className="about-finale__hero">
          <h2 className="about-finale__title" id="about-finale-title" ref={titleRef}>
            {ABOUT_FINALE_CONTENT.title}
          </h2>
        </div>

        <div className="about-board">
          <article className="about-panel about-panel--portrait">
            <div className="about-panel__frame about-panel__frame--portrait">
              <div className="about-panel__label about-panel__label--portrait" />
              <div className="about-panel__ghost-face">
                <span />
                <span />
                <span />
              </div>
              <div className="about-panel__timestamp" />
            </div>
          </article>

          <article className="about-panel about-panel--brief">
            <div className="about-panel__frame about-panel__frame--brief">
              <div className="about-panel__heading about-panel__heading--feature">
                <span aria-hidden="true" className="about-panel__heading-title" />
                <span />
              </div>
              <div className="about-panel__copy-block">
                <span className="is-wide" />
                <span className="is-wide" />
                <span className="is-wide" />
                <span className="is-medium" />
                <span className="is-short" />
              </div>
            </div>
          </article>

          <article className="about-panel about-panel--disc">
            <div className="about-panel__frame about-panel__frame--disc">
              <div className="about-panel__disc-art">
                <span className="about-panel__disc-hole" />
              </div>
              <div className="about-panel__mini-stack">
                <span className="is-tiny" />
                <span className="is-small" />
                <span className="is-medium" />
                <span className="is-medium" />
                <span className="is-short" />
              </div>
            </div>
          </article>

          <article className="about-panel about-panel--tools">
            <div className="about-panel__frame about-panel__frame--tools">
              <div className="about-panel__heading">
                <span aria-hidden="true" className="about-panel__heading-title" />
                <span />
              </div>
              <div className="about-panel__tool-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>

          <article className="about-panel about-panel--services">
            <div className="about-panel__frame about-panel__frame--services">
              <div className="about-panel__heading">
                <span aria-hidden="true" className="about-panel__heading-title" />
                <span />
              </div>
              <div className="about-panel__pill-cloud">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>

          <article className="about-panel about-panel--device">
            <div className="about-panel__frame about-panel__frame--device">
              <div className="about-panel__device">
                <span className="about-panel__device-screen" />
                <span className="about-panel__device-wheel" />
              </div>
              <div className="about-panel__device-footer">
                <span />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
