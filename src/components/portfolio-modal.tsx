"use client";

/**
 * AI_NOTE:
 * Role: project-detail modal renderer.
 * Accessibility side effects (scroll lock, focus trap, focus return) are delegated to dedicated hooks in src/lib/.
 */

import { useRef } from "react";
import Image from "next/image";

import type { PortfolioProject } from "@/content/portfolio-projects";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useFocusReturn } from "@/lib/use-focus-return";
import { useFocusTrap } from "@/lib/use-focus-trap";

type PortfolioModalProps = {
  project: PortfolioProject | null;
  onClose: () => void;
};

export function PortfolioModal({ project, onClose }: PortfolioModalProps) {
  // AI_CONTEXT:
  // Refs are consumed by accessibility hooks rather than inline imperative logic.
  // Keep focus/scroll side effects in src/lib hooks, not in this component body.
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // AI_CONTEXT:
  // These hooks intentionally model three separate modal concerns:
  // body scroll lock, focus return, and in-modal focus trapping.
  useBodyScrollLock(!!project);
  useFocusReturn(!!project);
  useFocusTrap({
    active: !!project,
    containerRef: overlayRef,
    initialFocusRef: closeButtonRef,
    onEscape: onClose,
  });

  if (!project) {
    // AI_CONTEXT:
    // Null-render is the modal's inactive state.
    // Side-effect hooks above key off the same boolean so lifecycle stays aligned.
    return null;
  }

  const marqueeText = Array.from({ length: 6 }, () => project.title).join(" • ");
  const dialogTitleId = `portfolio-modal-title-${project.id}`;

  return (
    <div
      aria-labelledby={dialogTitleId}
      aria-modal="true"
      className="portfolio-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={overlayRef}
      role="dialog"
      tabIndex={-1}
    >
      <button
        aria-label="모달 닫기"
        className="portfolio-modal-close"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        ×
      </button>

      <div aria-hidden="true" className="portfolio-modal-marquee">
        <div className="portfolio-modal-marquee__track">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>

      <div className="portfolio-modal-stage">
        <article className="portfolio-modal-card">
          <div className="portfolio-modal-card__visual">
            <Image
              alt={`${project.title} 프로젝트 썸네일`}
              className="portfolio-modal-card__image"
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 900px) 82vw, 72vw"
              src={project.thumbnailPath}
            />
            <div aria-hidden="true" className="portfolio-modal-card__cursor">
              <span className="portfolio-modal-card__cursor-mark">↗</span>
            </div>
          </div>

          <div className="portfolio-modal-card__meta">
            <h3 className="portfolio-modal-title" id={dialogTitleId}>
              {project.title}
            </h3>
            <p className="portfolio-modal-subtitle">{project.subtitle}</p>

            <div className="portfolio-modal-tags">
              {project.tags.map((tag) => (
                <span className="portfolio-modal-tag" key={`${project.id}-${tag}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="portfolio-modal-sections">
              <section>
                <h4>Challenge</h4>
                <p>{project.challenge}</p>
              </section>

              <section>
                <h4>Solution</h4>
                <p>{project.solution}</p>
              </section>
            </div>

            <div className="portfolio-modal-actions">
              <a
                className="portfolio-modal-action portfolio-modal-action--primary"
                href={project.pdfPath}
                rel="noreferrer"
                target="_blank"
              >
                View PDF
              </a>

              <a
                className="portfolio-modal-action portfolio-modal-action--secondary"
                download
                href={project.pdfPath}
              >
                Download PDF
              </a>

              {project.githubUrl && (
                <a
                  className="portfolio-modal-action portfolio-modal-action--secondary"
                  href={project.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              )}

              {project.completionCertificate && (
                <a
                  className="portfolio-modal-action portfolio-modal-action--secondary"
                  href={project.completionCertificate.path}
                  rel="noreferrer"
                  target="_blank"
                >
                  Certificate
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
