// scripts/posterService.js
const path = require("path");
const { execSync } = require("child_process");
const { loadData } = require("./loadData");
const { generateHtmlPoster } = require("./generateHtmlPoster");
const { sendPosterEmail } = require("./sendEmail");

async function runPosterBot() {
  console.log("🚀 Starting StarPower poster automation...");

  const creators = await loadData();

  console.log(`🎯 Loaded ${creators.length} creators.`);

  for (const creator of creators) {
    const safeUsername = creator.username.replace(/[^\w\-]/g, "_");
    const outputFilename = `${safeUsername}.png`;
    const outputPath = path.join("/tmp/output", outputFilename);

    try {
      console.log(`🛠️ Generating poster for: ${creator.username}`);

      // Step 1: Generate HTML
      await generateHtmlPoster(creator);

      // Step 2: Render PNG using Puppeteer script
      execSync(`node scripts/renderPoster.js ${outputFilename}`, {
        stdio: "inherit",
      });

      // Step 3: Send email with attachment
      await sendPosterEmail(creator.email, creator.username, outputPath, creator.reportType);
    } catch (err) {
      console.error(`❌ Error processing ${creator.username}:`, err.message);
    }
  }

  console.log("✅ All posters processed.");
}

module.exports = { runPosterBot };
