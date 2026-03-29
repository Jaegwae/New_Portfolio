import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { lenisMock, useScrollSceneMock, scrollSceneUpdateRef } = vi.hoisted(() => ({
  lenisMock: {
    scrollTo: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  },
  useScrollSceneMock: vi.fn(),
  scrollSceneUpdateRef: {
    current: null as null | ((context: { prefersReducedMotion: boolean }) => void),
  },
}));

vi.mock("@/components/about-finale", () => ({
  AboutFinale: () => <section>About finale</section>,
}));

vi.mock("@/components/about-sheet", () => ({
  AboutSheet: () => <section>About sheet</section>,
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

vi.mock("@/components/wave-field", () => ({
  WaveField: () => <div aria-hidden="true">Wave</div>,
}));

vi.mock("@/lib/scroll-motion", async () => {
  const actual = await vi.importActual<typeof import("@/lib/scroll-motion")>("@/lib/scroll-motion");

  return {
    ...actual,
    useScrollScene: (update: (context: { prefersReducedMotion: boolean }) => void) => {
      scrollSceneUpdateRef.current = update;
      useScrollSceneMock(update);
    },
  };
});

import { HeroScene } from "@/components/hero-scene";

describe("HeroScene integration", () => {
  beforeEach(() => {
    lenisMock.scrollTo.mockReset();
    lenisMock.start.mockReset();
    lenisMock.stop.mockReset();
    useScrollSceneMock.mockReset();
    scrollSceneUpdateRef.current = null;
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

  it("brightens manifesto words after manifesto lock input advances progress", async () => {
    render(<HeroScene />);

    const manifestoAnchor = document.querySelector(".manifesto-anchor");
    const sheetAnchor = document.querySelector(".about-sheet-anchor");

    expect(manifestoAnchor).toBeInstanceOf(HTMLDivElement);
    expect(sheetAnchor).toBeInstanceOf(HTMLDivElement);
    expect(scrollSceneUpdateRef.current).not.toBeNull();

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1000,
    });

    vi.spyOn(manifestoAnchor as HTMLDivElement, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      bottom: 1000,
      left: 0,
      right: 1000,
      width: 1000,
      height: 1000,
      toJSON: () => ({}),
    });
    vi.spyOn(sheetAnchor as HTMLDivElement, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 1000,
      top: 1000,
      bottom: 2000,
      left: 0,
      right: 1000,
      width: 1000,
      height: 1000,
      toJSON: () => ({}),
    });

    await act(async () => {
      scrollSceneUpdateRef.current?.({ prefersReducedMotion: false });
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
});
