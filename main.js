// main.js
const { runPosterBot } = require("./scripts/posterService");

(async () => {
  try {
    await runPosterBot();
    console.log("✅ Local test completed successfully!");
  } catch (err) {
    console.error("❌ Local test failed:", err.message);
  }
})();
