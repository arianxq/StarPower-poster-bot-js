const nodemailer = require("nodemailer");
const { language_mapping } = require("./language_mapping");
require("dotenv").config();

/**
 * 发送海报邮件
 * @param {string} to
 * @param {string} username
 * @param {string} imagePath
 * @param {string} reportType
 * @param {string} language
 */
async function sendPosterEmail(to, username, imagePath, reportType = "Monthly", language = "english") {
  const senderEmail = process.env.SENDER_EMAIL;
  const senderPassword = process.env.SENDER_PASSWORD;

  if (!senderEmail || !senderPassword) {
    throw new Error("Missing SENDER_EMAIL or SENDER_PASSWORD in .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  });

  const langKey = (language || "english").toLowerCase();
  const langTexts = language_mapping[langKey] || language_mapping["english"];

  const emailBodyTemplate = reportType.toLowerCase() === "weekly"
    ? langTexts.emailWeekly
    : langTexts.emailMonthly;

  let emailBody = emailBodyTemplate.replace("${username}", username);

  // 邮件 Subject 根据语言来决定
  let emailSubject = "";
  if (langKey === "arabic") {
    emailSubject = reportType.toLowerCase() === "weekly"
      ? "تقرير تيك توك الأسبوعي الخاص بك 🌟" // Your Weekly TikTok Report
      : "تقرير تيك توك الشهري الخاص بك 🌟"; // Your Monthly TikTok Report
  } else {
    emailSubject = `Your ${reportType} TikTok Report 🌟`;
  }

  // 邮件正文还是用纯 text，暂时不加 HTML
  const mailOptions = {
    from: `"StarPower Media" <${senderEmail}>`,
    to: to,
    subject: emailSubject,
    text: emailBody,
    attachments: [
      {
        filename: `${username.replace(/[^\w\-]/g, "_")}.png`,
        path: imagePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to", to);
  } catch (error) {
    console.error("❌ Failed to send email to", to);
    console.error(error);
  }
}

module.exports = { sendPosterEmail };
