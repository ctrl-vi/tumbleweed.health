import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  webServer: [
    {
      command: "npm run start",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
    },
    {
      command: "node tests/mock-backend.mjs",
      url: "http://127.0.0.1:4010/health",
      reuseExistingServer: true,
    },
    {
      command: "npm run start -- --port 3001",
      url: "http://127.0.0.1:3001",
      env: {
        TUMBLEWEED_API_URL: "http://127.0.0.1:4010",
        PARTNER_INTAKE_URL: "http://127.0.0.1:4010/partners",
      },
      reuseExistingServer: false,
    },
  ],
});
