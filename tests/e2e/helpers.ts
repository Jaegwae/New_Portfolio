import { expect, type Page } from "@playwright/test";

const NAV_TIMEOUT_MS = 12_000;
const HOME_TOP_TOLERANCE_PX = 40;
const VIEWPORT_EDGE_MARGIN_PX = 48;

async function waitForAnimationFrames(page: Page, frameCount = 2) {
  await page.evaluate(async (count) => {
    await new Promise<void>((resolve) => {
      let remaining = count;

      const step = () => {
        remaining -= 1;

        if (remaining <= 0) {
          resolve();
          return;
        }

        window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    });
  }, frameCount);
}

export async function openHome(page: Page) {
  await page.goto("/");
  await expect(page.locator(".hero-heading")).toBeVisible();
  await expect(page.locator(".manifesto-anchor")).toBeVisible();
  await expect(page.locator(".portfolio-anchor")).toBeVisible();
  try {
    await expect
      .poll(
        async () => {
          const value = (await page.locator(".hero-typed-line__word").textContent()) ?? "";
          return value.trim().length;
        },
        { timeout: 1500 },
      )
      .toBeGreaterThan(0);
  } catch {
    // Reduced-motion and headless runs do not always expose the typing state in time.
  }
  await waitForAnimationFrames(page, 3);
}

export async function expectHomeAtTop(page: Page) {
  await expect
    .poll(
      () => page.evaluate((tolerance) => window.scrollY <= tolerance, HOME_TOP_TOLERANCE_PX),
      { timeout: NAV_TIMEOUT_MS },
    )
    .toBe(true);
  await expect(page.locator(".hero-heading")).toBeVisible();
}

export async function expectElementIntersectsViewport(page: Page, selector: string) {
  await expect
    .poll(
      () => page.locator(selector).evaluate((node) => node.getBoundingClientRect().top),
      { timeout: NAV_TIMEOUT_MS },
    )
    .toBeLessThan(page.viewportSize()?.height ? page.viewportSize()!.height - VIEWPORT_EDGE_MARGIN_PX : 952);
}

export async function jumpToSection(page: Page, selector: string, offset = 32) {
  await page
    .locator(selector)
    .evaluate((node, topOffset) => window.scrollTo(0, window.scrollY + node.getBoundingClientRect().top - topOffset), offset);
  await waitForAnimationFrames(page, 2);
}
