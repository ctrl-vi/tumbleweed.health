import { test, expect } from "@playwright/test";
test("hero motion, keyboard topics, and reduced motion", async ({ page }) => {
  await page.goto("/");
  const flip = page.getByRole("button", {
    name: "Ask in your own words. Explore example questions",
    exact: true,
  });
  await flip.hover();
  await expect(flip.locator("[aria-live]")).toHaveText(
    /Find local food resources|Ideas for meals|Help understanding food programs/,
  );
  const first = await flip.locator("[aria-live]").textContent();
  await page.mouse.move(0, 0);
  await flip.hover();
  await expect(flip.locator("[aria-live]")).not.toHaveText(first!);
  await expect(
    page.getByRole("button", { name: /text animation/ }),
  ).toHaveCount(0);
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("button")).toHaveCount(0);
  await nav.getByRole("link", { name: "See an example" }).click();
  await expect(page).toHaveURL(/examples\/food/);
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
  await page.screenshot({ path: "test-results/motion-normal.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Pause text animation" }),
  ).toBeHidden();
  await flip.hover();
  await page.screenshot({ path: "test-results/motion-reduced.png" });
});
