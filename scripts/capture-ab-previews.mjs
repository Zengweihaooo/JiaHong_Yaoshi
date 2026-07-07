import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "public", "images", "ab-test");
const baseUrl = process.env.AB_PREVIEW_BASE_URL || "http://localhost:5174";

const previews = [
  { key: "quick-consult", variant: "a" },
  { key: "quick-consult-form", variant: "a" },
  { key: "quick-consult-consent", variant: "a", scene: "consent" },
  { key: "quick-consult-name-dot", variant: "a" },
  { key: "records-date-picker", variant: "a" }
];

async function waitForDevServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Dev server not ready at ${baseUrl}`);
}

async function main() {
  await waitForDevServer();
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await page.addStyleTag({
    content: `
      [class*="-nav"][aria-label="AB 测试页面切换"],
      .ab-back {
        display: none !important;
      }
    `
  });

  for (const preview of previews) {
    const params = new URLSearchParams({
      preview: preview.key,
      variant: preview.variant,
      screenshot: "1"
    });
    if (preview.scene) params.set("scene", preview.scene);

    const url = `${baseUrl}/ab-test/?${params.toString()}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(preview.scene === "consent" ? 1200 : 800);

    const outputPath = path.join(outputDir, `${preview.key}.png`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`saved ${outputPath}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
