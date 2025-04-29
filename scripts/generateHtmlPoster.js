const fs = require("fs");
const path = require("path");
const { language_mapping } = require("./language_mapping"); // 导入语言包

/**
 * Replace the ${key} variables in the template to generate the final HTML
 * @param {Object} data - An object containing all variables needed for the poster, such as username, diamonds, avatarUrl, etc.
 * @returns {string} The output path of the generated HTML
 */
async function generateHtmlPoster(data) {
  const templatePath = path.resolve("render/poster-template.html");
  const outputPath = path.resolve(__dirname, "../render/generated.html");
  //const outputPath = path.resolve("render/generated.html");

  // Ensure the /tmp/render directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Get the language texts (default to English)
  const langKey = (data.language || "english").toLowerCase();
  const langTexts = language_mapping[langKey] || language_mapping["english"];

  // Dynamically select comparisonLabel based on whether reportType is weekly or monthly
  const reportType = (data.reportType || "").toLowerCase();
  const comparisonLabel = reportType === "weekly" ? langTexts.comparisonWeek : langTexts.comparisonMonth;

  // Merge all data needed for replacement
  const mergedData = {
    ...data, // Keep original username, diamonds, etc.
    reportTitleText: langTexts.reportTitle,
    diamondsLabel: langTexts.diamonds,
    diamondsFromMatchLabel: langTexts.diamondsFromMatch,
    liveDurationLabel: langTexts.liveDuration,
    newFollowersLabel: langTexts.newFollowers,
    comparedToLastText: langTexts.comparedToLast,
    liveTagText: "LIVE", 
    comparisonLabel, // Used to dynamically fill week/month after comparedToLastText
  };

  // Read the HTML template
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace all ${key} placeholders in the template
  for (const [key, value] of Object.entries(mergedData)) {
    const safeValue = value ?? "";
    const regex = new RegExp(`\\$\\{${key}\\}`, "g");
    template = template.replace(regex, safeValue);
  }

  // Write the final HTML
  fs.writeFileSync(outputPath, template, "utf-8");
  console.log("📝 Generated HTML at:", outputPath);

  return outputPath;
}

module.exports = { generateHtmlPoster };
