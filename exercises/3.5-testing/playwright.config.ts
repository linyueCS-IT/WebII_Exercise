import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const hostname = process.env.HOST || "localhost";
const port = process.env.REACT_PORT || 5173;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	outputDir: "./tests/results",
	timeout: 10000,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		["html", { outputFolder: "./tests/report", open: "never", port: 3001 }],
	],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: `http://${hostname}:${port}`,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "retain-on-failure",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "chromium",
			use: {
				//channel: "chrome", // forces using the real Chrome browser, not just Chromium
				...devices["Desktop Chrome"],
			},
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: "npm --prefix client run dev",
		url: `http://${hostname}:${port}`,
		reuseExistingServer: true,
		timeout: 90 * 1000, // optional: wait up to 90s
	},
});
