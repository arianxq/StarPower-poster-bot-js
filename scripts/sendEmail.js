const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * 发送海报邮件给某个 Creator
 * @param {string} to - 收件人邮箱
 * @param {string} username - Creator 的用户名（用于称呼）
 * @param {string} imagePath - 要附加的 PNG 文件路径
 * @param {string} reportType - "Weekly" or "Monthly"
 */
async function sendPosterEmail(to, username, imagePath, reportType = "Monthly") {
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

  const periodWord = reportType.toLowerCase() === "weekly" ? "week" : "month";
  const mailOptions = {
    from: `"StarPower Media" <${senderEmail}>`,
    to: to,
    subject: `Your ${reportType} TikTok Report 🌟`,
    text: `Hi ${username},
  
  Please see your last ${periodWord}'s performance and progress in the attachment.
  
  Keep up the great work. We’re always very proud of you and what you have achieved.
  
  If you ever need support or clarification, don’t hesitate to reach out to your manager anytime.
  
  StarPower Media Creator Support 🥰`,
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
