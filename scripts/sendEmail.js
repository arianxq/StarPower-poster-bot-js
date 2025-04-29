const nodemailer = require("nodemailer");
const { language_mapping } = require("./language_mapping");
require("dotenv").config();

/**
 * Send poster email
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

  // email subject based on language
  let emailSubject = "";
  if (langKey === "arabic") {
    emailSubject = reportType.toLowerCase() === "weekly"
      ? "تقرير تيك توك الأسبوعي الخاص بك 🌟" // Your Weekly TikTok Report
      : "تقرير تيك توك الشهري الخاص بك 🌟"; // Your Monthly TikTok Report
  } else {
    emailSubject = `Your ${reportType} TikTok Report 🌟`;
  }

  // Use plain text for the email body (no HTML for now)
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
