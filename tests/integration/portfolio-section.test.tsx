import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/scroll-motion", () => ({
  DEFAULT_SECTION_TITLE_REVEAL: {
    enterOffset: 58,
    exitOffset: 42,
    fadeInStart: 0.04,
    fadeInEnd: 0.22,
  },
  applyRevealStyles: vi.fn(),
  resetRevealStyles: vi.fn(),
  useScrollScene: vi.fn(),
}));

import { PortfolioSection } from "@/components/portfolio-section";

describe("PortfolioSection integration", () => {
  it("toggles the AI filter and narrows the visible project set", async () => {
    const user = userEvent.setup();
    render(<PortfolioSection />);

    const aiFilter = screen.getByRole("button", { name: "AI" });
    await user.click(aiFilter);

    expect(aiFilter).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: /Selected work \(3\)/i })).toBeInTheDocument();

    const cards = screen.getAllByRole("button", { name: /상세 보기$/ });
    expect(cards).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Plimo 상세 보기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "높이 예측 모델 상세 보기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI+지역전문가 콜렉터블 검수 상세 보기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "멘토스 상세 보기" })).not.toBeInTheDocument();
  });

  it("traps focus inside the modal and restores the launcher on close", async () => {
    const user = userEvent.setup();
    render(<PortfolioSection />);

    const launcher = screen.getByRole("button", { name: "Plimo 상세 보기" });
    await user.click(launcher);

    const dialog = await screen.findByRole("dialog", { name: "Plimo" });
    const closeButton = within(dialog).getByRole("button", { name: "모달 닫기" });
    const githubLink = within(dialog).getByRole("link", { name: "GitHub" });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    await user.tab({ shift: true });
    expect(githubLink).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Plimo" })).not.toBeInTheDocument();
    });
    expect(launcher).toHaveFocus();
  });
});
