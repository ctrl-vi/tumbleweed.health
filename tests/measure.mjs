import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch();
const results = [];
for (const slow of [false, true]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  if (slow) {
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  await page.addInitScript(() => {
    window.metrics = { lcp: null, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.metrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.metrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  results.push(
    await page.evaluate(
      (slow) => ({
        profile: slow
          ? "1.6 Mbps / 150ms / 4x CPU"
          : "local desktop CPU / mobile viewport",
        ...window.metrics,
        resources: performance
          .getEntriesByType("resource")
          .map((e) => ({
            name: e.name.split("/").pop(),
            type: e.initiatorType,
            compressed: e.encodedBodySize,
            transfer: e.transferSize,
          })),
        document: performance
          .getEntriesByType("navigation")
          .map((e) => ({
            compressed: e.encodedBodySize,
            transfer: e.transferSize,
          })),
      }),
      slow,
    ),
  );
  await page.close();
}
await fs.writeFile(
  "test-results/performance.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
