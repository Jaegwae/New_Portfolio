import { expect, test } from "@playwright/test";

import { expectElementIntersectsViewport, jumpToSection, openHome } from "./helpers";

test.describe("HOME smoke", () => {
  test("identity copy and section navigation render on load", async ({ page }) => {
    await openHome(page);

    await expect(page.locator(".hero-heading")).toBeVisible();
    await expect(page.locator(".hero-typed-line")).toContainText("I'm a");
    await expect(page.getByRole("navigation", { name: "Section navigation" })).toBeVisible();
  });

  test("manifesto section enters with copy visible before intro cover takes over", async ({ page }) => {
    await openHome(page);
    await jumpToSection(page, ".manifesto-anchor", 24);
    await expectElementIntersectsViewport(page, ".manifesto-section__copy");
    await expect(page.locator(".manifesto-section__word")).toHaveCount(9);

    const coverProgress = await page.locator(".hero-page").evaluate((node) => {
      const value = window.getComputedStyle(node).getPropertyValue("--cover-progress");
      return Number.parseFloat(value) || 0;
    });
    expect(coverProgress).toBeLessThan(0.05);
  });
});
