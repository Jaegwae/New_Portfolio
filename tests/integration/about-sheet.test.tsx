import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/gsap-reveal", () => ({
  useGsapScrollReveal: vi.fn(),
}));

import { AboutSheet } from "@/components/about-sheet";

describe("AboutSheet integration", () => {
  it("renders the structured title and supporting paragraphs", () => {
    render(<AboutSheet />);

    expect(
      screen.getByRole("heading", {
        name: "인간의 도구,인공지능",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/AI 기술/)[0]).toBeInTheDocument();
    expect(screen.getByText(/조직의 서비스에서도 AI는 이런 방식으로 적용될 수 있다고 생각합니다\./)).toBeInTheDocument();
  });
});
