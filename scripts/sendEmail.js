// scripts/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * 发送海报邮件给某个 Creator
 * @param {string} to - 收件人邮箱
 * @param {string} username - Creator 的用户名（用于称呼）
 * @param {string} imagePath - 要附加的 PNG 文件路径
 */
async function sendPosterEmail(to, username, imagePath) {
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

  const mailOptions = {
    from: `"StarPower Media" <${senderEmail}>`,
    to: to,
    subject: "Your Monthly TikTok Report 🌟",
    text: `Hi ${username},\n\nHere's your monthly performance poster. Keep it up!\n\n— StarPower Team`,
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
