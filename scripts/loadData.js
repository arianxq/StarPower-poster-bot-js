const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
require("dotenv").config();

// AWS S3 setup
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "ap-southeast-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// S3 Keys
const BUCKET = process.env.BUCKET_NAME || "starpower-media";
const DATA_KEY = "bot/creator-data/AUNZ-Creatordata-March.csv";
const RECIPIENT_KEY = "bot/creator-data/Test Recipient list.csv";
const AVATAR_PREFIX = "bot/creator-avatar/";

// Local paths
const TMP = "/tmp";
const DATA_PATH = path.join(TMP, "AUNZ-Creatordata-March.csv");
const RECIPIENT_PATH = path.join(TMP, "Test Recipient list.csv");
const AVATAR_DIR = path.join(TMP, "avatars");

// Download single S3 file
function downloadS3File(s3Key, localPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath);
    s3.getObject({ Bucket: BUCKET, Key: s3Key })
      .createReadStream()
      .on("error", reject)
      .pipe(file)
      .on("finish", resolve);
  });
}

// Download all avatars
async function downloadAllAvatars() {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });

  const result = await s3
    .listObjectsV2({ Bucket: BUCKET, Prefix: AVATAR_PREFIX })
    .promise();

  const downloads = result.Contents.map((obj) => {
    const key = obj.Key;
    const filename = path.basename(key);
    const localPath = path.join(AVATAR_DIR, filename);
    return downloadS3File(key, localPath);
  });

  await Promise.all(downloads);
}

// Parse recipient CSV like Java (by column index)
function parseRecipientCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let isFirst = true;

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      if (isFirst) {
        isFirst = false;
        return; // skip header
      }
      const parts = line.split(",", 4);
      const [id, username, email] = parts.map((x) => (x ?? "").trim());
      if (id && email) {
        results.push({ id, username, email });
      }
    });

    rl.on("close", () => resolve(results));
    rl.on("error", reject);
  });
}

// Parse data CSV using csv-parser
function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const csv = require("csv-parser");
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// Core utilities
function clean(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace("\uFEFF", "");
}
function safeGet(row, key) {
  return (row?.[key] ?? "").trim();
}
function formatNum(n) {
  const val = parseFloat(n);
  return isNaN(val) ? n : val >= 1000 ? (val / 1000).toFixed(2) + "K" : n;
}
function extractHours(dur) {
  if (!dur?.includes("h")) return "0";
  return dur.split("h")[0].trim();
}
function buildGrowth(raw) {
  const val = (raw ?? "").trim();
  if (!val || val === "-" || val === "#N/A" || val === "#DIV/0!") {
    return { val: "-", icon: "", color: "#999" };
  }
  const negative = val.startsWith("-");
  return {
    val,
    icon: negative ? "▼" : "▲",
    color: negative ? "red" : "rgb(32, 227, 32)",
  };
}

// Match and generate poster data
function matchAndBuildPosterData(dataRows, recipients) {
  const dataMap = {};
  dataRows.forEach((row) => {
    const id = clean(row["Creator ID"]);
    dataMap[id] = row;
  });

  console.log("🎯 Creator IDs from recipient list:");
  recipients.forEach((r) => {
    console.log("-", r.id);
  });

  return recipients
    .map((r) => {
      const id = clean(r.id);
      const email = clean(r.email);
      const username = clean(r.username);
      const row = dataMap[id];
      if (!row || !email || !username) return null;

      const avatarPath = "file://" + path.join(AVATAR_DIR, id + ".png");

      const dg = buildGrowth(safeGet(row, "Diamonds - Vs. last month"));
      const mg = buildGrowth(safeGet(row, "Diamonds from matches - Vs. last month"));
      const lg = buildGrowth(safeGet(row, "LIVE duration - Vs. last month"));
      const fg = buildGrowth(safeGet(row, "New followers - Vs. last month"));

      return {
        creatorId: id,
        email,
        username,
        avatarUrl: avatarPath,
        dateRange: safeGet(row, "Data period"),
        diamonds: formatNum(safeGet(row, "Diamonds")),
        matchDiamonds: formatNum(safeGet(row, "Diamonds from matches")),
        liveHours: extractHours(safeGet(row, "LIVE duration")) + "hrs",
        newFollowers: safeGet(row, "New followers"),
        diamondsGrowthVal: dg.val,
        diamondsGrowthIcon: dg.icon,
        diamondsGrowthColor: dg.color,
        matchGrowthVal: mg.val,
        matchGrowthIcon: mg.icon,
        matchGrowthColor: mg.color,
        liveGrowthVal: lg.val,
        liveGrowthIcon: lg.icon,
        liveGrowthColor: lg.color,
        followerGrowthVal: fg.val,
        followerGrowthIcon: fg.icon,
        followerGrowthColor: fg.color,
      };
    })
    .filter(Boolean);
}

// Main export
async function loadData() {
  await downloadS3File(DATA_KEY, DATA_PATH);
  await downloadS3File(RECIPIENT_KEY, RECIPIENT_PATH);
  await downloadAllAvatars();

  const dataRows = await parseCsv(DATA_PATH);
  const recipients = await parseRecipientCsv(RECIPIENT_PATH);

  return matchAndBuildPosterData(dataRows, recipients);
}

module.exports = { loadData };
