import { expect, test, type Page } from "@playwright/test";

import { expectElementIntersectsViewport, jumpToSection, openHome } from "./helpers";

async function openPortfolioSection(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  await jumpToSection(page, ".portfolio-anchor", 24);
  await expectElementIntersectsViewport(page, ".portfolio-section__title");
}

test.describe("Portfolio smoke", () => {
  test("selected work section renders heading, filters, and all project cards", async ({ page }) => {
    await openPortfolioSection(page);

    await expect(page.locator(".portfolio-section__title")).toContainText("(8)");
    await expect(page.locator(".portfolio-filters").getByRole("button")).toHaveCount(5);
    await expect(page.locator(".portfolio-card")).toHaveCount(8);
    await expect(page.locator(".portfolio-card__title")).toHaveText([
      "멘토스",
      "Plimo",
      "높이 예측 모델",
      "구로창의융합교육장",
      "서울 퓨처랩",
      "음반 시장 수요공급 분석",
      "하이톤",
      "AI+지역전문가 콜렉터블 검수",
    ]);
  });

  test("portfolio launchers expose accessible project detail entry points", async ({ page }) => {
    await openPortfolioSection(page);

    await expect(page.getByRole("button", { name: "멘토스 상세 보기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Plimo 상세 보기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "높이 예측 모델 상세 보기" })).toBeVisible();
  });
});
