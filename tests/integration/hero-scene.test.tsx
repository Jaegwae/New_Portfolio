import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { gsapToMock, lenisMock, scrollTriggerRefreshRef, scrollTriggerUpdateRef } = vi.hoisted(() => ({
  gsapToMock: vi.fn(),
  lenisMock: {
    scrollTo: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    on: vi.fn(() => vi.fn()),
  },
  scrollTriggerRefreshRef: {
    current: null as null | (() => void),
  },
  scrollTriggerUpdateRef: {
    current: null as null | (() => void),
  },
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    to: gsapToMock,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: (config: { onUpdate?: () => void; onRefresh?: () => void }) => {
      scrollTriggerUpdateRef.current = config.onUpdate ?? null;
      scrollTriggerRefreshRef.current = config.onRefresh ?? null;

      return {
        kill: vi.fn(),
      };
    },
    refresh: vi.fn(() => {
      scrollTriggerRefreshRef.current?.();
    }),
    update: vi.fn(() => {
      scrollTriggerUpdateRef.current?.();
    }),
  },
}));

vi.mock("gsap/ScrollToPlugin", () => ({
  ScrollToPlugin: {},
}));

vi.mock("@/components/about-sheet", () => ({
  AboutSheet: () => <section>About sheet</section>,
}));

vi.mock("@/components/hero-fluid-background", () => ({
  HeroFluidBackground: () => <div aria-hidden="true">Hero fluid background</div>,
}));

vi.mock("@/components/manifesto-section", async () => {
  const actual = await vi.importActual<typeof import("@/components/manifesto-section")>("@/components/manifesto-section");

  return {
    ...actual,
    ManifestoSection: ({ wordProgress }: { wordProgress: number }) => (
      <div data-testid="manifesto-progress" data-word-progress={wordProgress}>
        <actual.ManifestoSection wordProgress={wordProgress} />
      </div>
    ),
  };
});

vi.mock("@/components/portfolio-section", () => ({
  PortfolioSection: () => <section>Portfolio</section>,
}));

vi.mock("@/components/rotating-role", () => ({
  RotatingRoleInner: () => <span className="hero-typed-line__word">PRODUCT DEVELOPER</span>,
}));

vi.mock("@/components/smooth-scroll-provider", () => ({
  useLenis: () => lenisMock,
}));

import { HeroScene } from "@/components/hero-scene";

function mockAnchorRect(element: Element, top: number, height = 1000) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: top,
    top,
    bottom: top + height,
    left: 0,
    right: 1000,
    width: 1000,
    height,
    toJSON: () => ({}),
  });
}

describe("HeroScene integration", () => {
  beforeEach(() => {
    gsapToMock.mockReset();
    lenisMock.scrollTo.mockReset();
    lenisMock.start.mockReset();
    lenisMock.stop.mockReset();
    lenisMock.on.mockClear();
    scrollTriggerRefreshRef.current = null;
    scrollTriggerUpdateRef.current = null;
  });

  it("uses lenis scrollTo when the portfolio nav item is clicked", async () => {
    const user = userEvent.setup();
    render(<HeroScene />);

    await user.click(screen.getByRole("button", { name: "포트폴리오" }));

    expect(lenisMock.scrollTo).toHaveBeenCalledTimes(1);

    const [target, options] = lenisMock.scrollTo.mock.calls[0] as [
      HTMLElement,
      {
        duration: number;
        easing: (t: number) => number;
        lock: boolean;
        force: boolean;
        onComplete: () => void;
      },
    ];

    expect(target).toBeInstanceOf(HTMLDivElement);
    expect(options).toMatchObject({
      duration: 1,
      lock: true,
      force: true,
    });
    expect(typeof options.easing).toBe("function");
    expect(typeof options.onComplete).toBe("function");
  });

  it("renders the current section navigation and static profile items", () => {
    render(<HeroScene />);

    expect(screen.getByRole("button", { name: "HOME" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "슬로건" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "자기소개" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "포트폴리오" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "ABOUT" })).not.toBeInTheDocument();

    expect(screen.getByText("2000.03.30 (만 26세)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "kimjk4031@naver.com" })).toHaveAttribute(
      "href",
      "mailto:kimjk4031@naver.com",
    );
    expect(screen.getByRole("link", { name: "010-9127-4031" })).toHaveAttribute("href", "tel:01091274031");
  });

  it("brightens manifesto words after manifesto lock input advances progress", async () => {
    render(<HeroScene />);

    const manifestoAnchor = document.querySelector(".manifesto-anchor");
    const sheetAnchor = document.querySelector(".about-sheet-anchor");

    expect(manifestoAnchor).toBeInstanceOf(HTMLDivElement);
    expect(sheetAnchor).toBeInstanceOf(HTMLDivElement);
    expect(scrollTriggerUpdateRef.current).not.toBeNull();

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1000,
    });

    mockAnchorRect(manifestoAnchor as HTMLDivElement, 0);
    mockAnchorRect(sheetAnchor as HTMLDivElement, 1000);

    await act(async () => {
      scrollTriggerUpdateRef.current?.();
    });

    const words = screen.getAllByText(/복잡한|문제를|구조화합니다.|자연스러운|디지털 경험을|설계합니다.|그렇게|해결합니다./);
    const firstWord = words.find((node) => node.textContent === "복잡한");
    expect(firstWord).toBeTruthy();
    expect(window.getComputedStyle(firstWord as HTMLElement).color).toBe("rgb(10, 10, 12)");
    expect(screen.getByTestId("manifesto-progress")).toHaveAttribute("data-word-progress", "0");

    await act(async () => {
      fireEvent.wheel(window, { deltaY: 400 });
      fireEvent.wheel(window, { deltaY: 400 });
      await Promise.resolve();
    });

    expect(lenisMock.stop).toHaveBeenCalled();
    expect(Number(screen.getByTestId("manifesto-progress").getAttribute("data-word-progress"))).toBeGreaterThan(0.06);
    expect(window.getComputedStyle(screen.getByText("복잡한")).color).toBe("rgb(245, 243, 237)");
  });

  it("marks the portfolio nav item active when the portfolio section reaches the active threshold", async () => {
    render(<HeroScene />);

    const manifestoAnchor = document.querySelector(".manifesto-anchor");
    const sheetAnchor = document.querySelector(".about-sheet-anchor");
    const portfolioAnchor = document.querySelector(".portfolio-anchor");

    expect(manifestoAnchor).toBeInstanceOf(HTMLDivElement);
    expect(sheetAnchor).toBeInstanceOf(HTMLDivElement);
    expect(portfolioAnchor).toBeInstanceOf(HTMLDivElement);

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1600,
    });

    mockAnchorRect(manifestoAnchor as HTMLDivElement, -900);
    mockAnchorRect(sheetAnchor as HTMLDivElement, 120);
    mockAnchorRect(portfolioAnchor as HTMLDivElement, 520);

    await act(async () => {
      scrollTriggerUpdateRef.current?.();
    });

    expect(screen.getByRole("button", { name: "포트폴리오" })).toHaveClass("is-active");
    expect(screen.getByRole("button", { name: "HOME" })).not.toHaveClass("is-active");
  });

  it("completes manifesto reveal immediately in reduced motion and ignores lock wheel input", async () => {
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<HeroScene />);

    const manifestoAnchor = document.querySelector(".manifesto-anchor");
    const sheetAnchor = document.querySelector(".about-sheet-anchor");

    expect(manifestoAnchor).toBeInstanceOf(HTMLDivElement);
    expect(sheetAnchor).toBeInstanceOf(HTMLDivElement);

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1000,
    });

    mockAnchorRect(manifestoAnchor as HTMLDivElement, 0);
    mockAnchorRect(sheetAnchor as HTMLDivElement, 1000);

    await act(async () => {
      scrollTriggerUpdateRef.current?.();
    });

    expect(screen.getByTestId("manifesto-progress")).toHaveAttribute("data-word-progress", "1");

    await act(async () => {
      fireEvent.wheel(window, { deltaY: 400 });
      await Promise.resolve();
    });

    expect(lenisMock.stop).not.toHaveBeenCalled();
    window.matchMedia = originalMatchMedia;
  });
});
