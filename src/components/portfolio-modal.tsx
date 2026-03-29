"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import type { PortfolioProject } from "@/content/portfolio-projects";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

type PortfolioModalProps = {
  project: PortfolioProject | null;
  onClose: () => void;
};

export function PortfolioModal({ project, onClose }: PortfolioModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusableElements = () => {
      const overlay = overlayRef.current;

      if (!overlay) {
        return [];
      }

      return Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const overlay = overlayRef.current;
      const focusableElements = getFocusableElements();

      if (!overlay || focusableElements.length === 0) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const isFocusInsideOverlay = !!activeElement && overlay.contains(activeElement);

      if (event.shiftKey) {
        if (!isFocusInsideOverlay || activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }

        return;
      }

      if (!isFocusInsideOverlay || activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusedElementRef.current?.focus();
    };
  }, [onClose, project]);

  if (!project) {
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
