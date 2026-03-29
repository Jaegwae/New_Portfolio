"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";

import { PortfolioModal } from "@/components/portfolio-modal";
import {
  PORTFOLIO_FILTERS,
  PORTFOLIO_MARQUEE_WORDS,
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
} from "@/content/portfolio-projects";
import { useGsapScrollReveal } from "@/lib/gsap-reveal";

function MarqueeRow({
  direction,
  offset,
}: {
  direction: "left" | "right";
  offset: "top" | "middle" | "bottom";
}) {
  const marqueeText = `${PORTFOLIO_MARQUEE_WORDS.join(" • ")} • ${PORTFOLIO_MARQUEE_WORDS.join(" • ")}`;

  return (
    <div aria-hidden="true" className={`portfolio-marquee portfolio-marquee--${offset}`}>
      <div className={`portfolio-marquee__track portfolio-marquee__track--${direction}`}>
        <span>{marqueeText}</span>
        <span>{marqueeText}</span>
      </div>
    </div>
  );
}

function PortfolioCard({
  project,
  onOpen,
}: {
  project: PortfolioProject;
  onOpen: (project: PortfolioProject) => void;
}) {
  return (
    <article className="portfolio-card">
      <button
        aria-label={`${project.title} 상세 보기`}
        className="portfolio-card__button"
        onClick={() => onOpen(project)}
        type="button"
      >
        <div className="portfolio-card__visual">
          <Image
            alt={`${project.title} 프로젝트 썸네일`}
            className="portfolio-card__image"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 25vw"
            src={project.thumbnailPath}
          />
          <div aria-hidden="true" className="portfolio-card__cursor">
            <span className="portfolio-card__cursor-mark">↗</span>
          </div>
        </div>

        <div className="portfolio-card__meta">
          <div className="portfolio-card__title-group">
            <h3 className="portfolio-card__title">{project.title}</h3>
            <p className="portfolio-card__summary">{project.subtitle}</p>
          </div>

          <div className="portfolio-card__tags">
            {project.tags.map((tag) => (
              <span className="portfolio-card__tag" key={`${project.id}-${tag}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </button>
    </article>
  );
}

export function PortfolioSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<(typeof PORTFOLIO_FILTERS)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useGsapScrollReveal(() => [
    {
      element: titleRef.current,
      fromY: 58,
      toY: -42,
      start: "top 96%",
      end: "bottom 78%",
    },
  ]);

  const visibleProjects = useMemo(() => {
    if (selectedFilter === "All") {
      return PORTFOLIO_PROJECTS;
    }

    return PORTFOLIO_PROJECTS.filter((project) => project.category === selectedFilter);
  }, [selectedFilter]);

  return (
    <>
      <section aria-labelledby="portfolio-title" className="portfolio-section">
        <MarqueeRow direction="left" offset="top" />
        <MarqueeRow direction="right" offset="middle" />
        <MarqueeRow direction="left" offset="bottom" />

        <div className="portfolio-section__inner">
          <div className="portfolio-section__header">
            <div className="portfolio-section__heading">
              <h2 className="portfolio-section__title" id="portfolio-title" ref={titleRef}>
                Selected work <span>({visibleProjects.length})</span>
              </h2>
            </div>

            <div aria-label="Portfolio filters" className="portfolio-filters" role="group">
              {PORTFOLIO_FILTERS.map((filter) => (
                <button
                  aria-controls="portfolio-grid"
                  aria-pressed={selectedFilter === filter}
                  className={`portfolio-filter${selectedFilter === filter ? " is-active" : ""}`}
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="portfolio-grid" id="portfolio-grid">
            {visibleProjects.map((project) => (
              <PortfolioCard key={project.id} onOpen={setSelectedProject} project={project} />
            ))}
          </div>
        </div>
      </section>

      <PortfolioModal onClose={() => setSelectedProject(null)} project={selectedProject} />
    </>
  );
}
