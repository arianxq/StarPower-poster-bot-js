// scripts/renderPoster.js
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

(async () => {
  try {
    const outputName = process.argv[2] || "poster-output.png";

    const htmlPath = path.resolve("/tmp/render/generated.html");
    const outputDir = path.resolve("/tmp/output");
    const outputPath = path.join(outputDir, outputName);

    if (!fs.existsSync(htmlPath)) {
      console.error("❌ HTML file not found:", htmlPath);
      process.exit(1);
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto("file://" + htmlPath);
    await page.setViewport({ width: 654, height: 1116 });

    await page.screenshot({ path: outputPath });
    await browser.close();

    console.log("✅ Poster generated:", outputPath);
  } catch (err) {
    console.error("❌ Failed to render poster:", err);
    process.exit(1);
  }
})();
