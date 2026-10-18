import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/examples/food",
  "/examples/meals",
  "/examples/programs",
  "/examples/no-match",
  "/start",
  "/help",
  "/privacy",
  "/language",
  "/partners",
  "/demo",
];
test("all public pages are accessible and have no mobile overflow", async ({
  page,
}) => {
  for (const path of routes) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `${path} accessibility`).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${path} overflow`,
    ).toBe(true);
    await page.setViewportSize({ width: 1200, height: 900 });
  }
});
test("matches design tokens and captures responsive references", async ({
  page,
}) => {
  for (const [name, width, height] of [
    ["desktop", 1200, 900],
    ["mobile", 390, 844],
    ["tablet", 768, 1024],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(252, 250, 245)",
    );
    await page.screenshot({
      path: `test-results/home-${name}.png`,
      fullPage: true,
    });
  }
  await page.goto("/partners");
  await page.screenshot({ path: "test-results/partners.png", fullPage: true });
  await page.goto("/examples/food");
  await page.screenshot({ path: "test-results/example.png", fullPage: true });
});
test("homepage and examples work with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000");
  await expect(
    page.getByRole("link", { name: "Text Tumbleweed", exact: true }),
  ).toHaveAttribute("href", "sms:+15092069073?body=Hi");
  await page
    .getByRole("link", { name: "See an example", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "Meal ideas", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Start with what you have.",
  );
  await context.close();
});
test("keyboard skip link and navigation work", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await page.goto("/examples/food");
  await page.getByRole("link", { name: "Meal ideas", exact: true }).click();
  await page.goBack();
  await expect(
    page.getByRole("link", { name: "Food nearby", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});
async function fillPartner(page: import("@playwright/test").Page) {
  await page.getByLabel("Organization name").fill("Example Pantry");
  await page.getByLabel("Contact email").fill("team@example.org");
  await page.getByLabel("Town or ZIP code").fill("Omak");
  await page
    .getByLabel("Resource details")
    .fill("Open Tuesday. Step-free entrance. Please call ahead.");
  await page.getByRole("button", { name: "Review details" }).click();
}
test("partner validation, actual review values, edit persistence and unavailable state", async ({
  page,
}) => {
  await page.goto("/partners");
  await page.getByRole("button", { name: "Review details" }).click();
  await expect(page.getByLabel("Organization name")).toBeFocused();
  await fillPartner(page);
  await expect(page.getByText("Example Pantry", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit for review" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Back to edit" }).click();
  await expect(page.getByLabel("Town or ZIP code")).toHaveValue("Omak");
});
test("connected partner success only after acknowledgement and recovery on failure", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3001/partners");
  await fillPartner(page);
  await page.route("**/api/partners", (route) =>
    route.fulfill({ status: 502, body: "{}" }),
  );
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  await expect(page.getByText("Example Pantry", { exact: true })).toBeVisible();
  await page.unroute("**/api/partners");
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(
    page.getByRole("heading", { name: "Thank you for sharing." }),
  ).toBeVisible();
});
test("chat matches FastAPI contract, retains failed input, and handles reset while pending", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3001/demo");
  await page.getByLabel("Your question").fill("food near Omak");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(
    page.getByText("Test reply: what town or ZIP code should I look near?", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByLabel("Your question").fill("fail");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Your question")).toHaveValue("fail");
  await page.getByRole("button", { name: "New conversation" }).click();
  await page.getByLabel("Your question").fill("slow");
  await page.getByRole("button", { name: "Send question" }).click();
  await page.getByRole("button", { name: "New conversation" }).click();
  await expect(page.getByLabel("Your question")).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "Send question" }),
  ).toBeEnabled();
  await page.waitForTimeout(1700);
  await expect(
    page.getByText("Test reply: what town or ZIP code should I look near?", {
      exact: true,
    }),
  ).toHaveCount(0);
});
test("server validates inputs and unavailable connections", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/chat", {
        data: { text: "hello", handle: "web:test" },
      })
    ).status(),
  ).toBe(503);
  expect(
    (
      await request.post("http://127.0.0.1:3001/api/chat", {
        data: { text: "hello", handle: "someone-elses-phone" },
      })
    ).status(),
  ).toBe(422);
  expect(
    (
      await request.post("http://127.0.0.1:3001/api/chat", {
        data: { text: "hello", handle: "web:test" },
        headers: { Origin: "https://other.example" },
      })
    ).status(),
  ).toBe(403);
  expect((await request.post("/api/partners", { data: {} })).status()).toBe(
    503,
  );
});
test("public pages reflow at enlarged text and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.addStyleTag({ content: "html{font-size:200%}" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("link", { name: "Text Tumbleweed", exact: true }),
  ).toBeVisible();
});
