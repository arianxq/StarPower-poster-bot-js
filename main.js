// main.js
const { runPosterBot } = require("./scripts/posterService");

(async () => {
  try {
    await runPosterBot();
    console.log("✅ 本地测试成功完成！");
  } catch (err) {
    console.error("❌ 本地测试失败：", err.message);
  }
})();
