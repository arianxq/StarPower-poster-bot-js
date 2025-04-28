const fs = require("fs");
const path = require("path");
const { language_mapping } = require("./language_mapping"); // 导入语言包

/**
 * 替换模板中的 ${key} 变量，生成最终的 HTML
 * @param {Object} data - 一个对象，包含 username、diamonds、avatarUrl 等所有海报需要的变量
 * @returns {string} HTML 输出路径
 */
async function generateHtmlPoster(data) {
  const templatePath = path.resolve("render/poster-template.html");
  const outputPath = path.resolve(__dirname, "../render/generated.html");
  //const outputPath = path.resolve("render/generated.html");

  // 确保 /tmp/render 目录存在（Lambda环境下需要）
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // 获取语言包内容（默认为 english）
  const langKey = (data.language || "english").toLowerCase();
  const langTexts = language_mapping[langKey] || language_mapping["english"];

  // 根据 reportType 是 weekly 还是 monthly，动态选择 comparisonLabel
  const reportType = (data.reportType || "").toLowerCase();
  const comparisonLabel = reportType === "weekly" ? langTexts.comparisonWeek : langTexts.comparisonMonth;

  // 整合所有需要替换的数据
  const mergedData = {
    ...data, // 保留原来的 username, diamonds 等
    reportTitleText: langTexts.reportTitle,
    diamondsLabel: langTexts.diamonds,
    diamondsFromMatchLabel: langTexts.diamondsFromMatch,
    liveDurationLabel: langTexts.liveDuration,
    newFollowersLabel: langTexts.newFollowers,
    comparedToLastText: langTexts.comparedToLast,
    liveTagText: "LIVE", 
    comparisonLabel, // 用来动态填 comparedToLastText 后面的 week/month
  };

  // 读取 HTML 模板
  let template = fs.readFileSync(templatePath, "utf-8");

  // 替换模板中所有 ${key} 占位符
  for (const [key, value] of Object.entries(mergedData)) {
    const safeValue = value ?? "";
    const regex = new RegExp(`\\$\\{${key}\\}`, "g");
    template = template.replace(regex, safeValue);
  }

  // 写入最终 HTML
  fs.writeFileSync(outputPath, template, "utf-8");
  console.log("📝 Generated HTML at:", outputPath);

  return outputPath;
}

module.exports = { generateHtmlPoster };
