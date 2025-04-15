// scripts/generateHtmlPoster.js
const fs = require("fs");
const path = require("path");

/**
 * 替换模板中的 ${key} 变量，生成最终的 HTML
 * @param {Object} data - 一个对象，包含 username、diamonds、avatarUrl 等所有海报需要的变量
 * @returns {string} HTML 输出路径
 */
async function generateHtmlPoster(data) {
  const templatePath = path.resolve("render/poster-template.html");
  const outputPath = path.resolve("/tmp/render/generated.html");

  // 确保 /tmp/render 目录存在（用于 Lambda）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // 读取 HTML 模板
  let template = fs.readFileSync(templatePath, "utf-8");

  // 替换模板中所有的 ${key}
  for (const [key, value] of Object.entries(data)) {
    const safeValue = value ?? "";
    const regex = new RegExp(`\\$\\{${key}\\}`, "g");
    template = template.replace(regex, safeValue);
  }

  // 写入 HTML 文件供 Puppeteer 使用
  fs.writeFileSync(outputPath, template, "utf-8");
  console.log("📝 Generated HTML at:", outputPath);

  return outputPath;
}

module.exports = { generateHtmlPoster };
