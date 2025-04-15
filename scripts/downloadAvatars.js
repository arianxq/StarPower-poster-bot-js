const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

// S3 设置（可放在 .env 中或提前配置）
const BUCKET = process.env.BUCKET_NAME || "starpower-media";
const AVATAR_PREFIX = "creator-avatar/";
const AVATAR_DIR = "/tmp/avatars"; // 使用 /tmp

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "ap-southeast-2",
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 下载所有头像到本地 /tmp/avatars 路径（适用于 Lambda 或本地调试）
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

// 下载所有头像
async function downloadAllAvatars() {
  // 确保本地目录存在
  fs.mkdirSync(AVATAR_DIR, { recursive: true });

  const result = await s3
    .listObjectsV2({
      Bucket: BUCKET,
      Prefix: AVATAR_PREFIX,
    })
    .promise();

  // 打印调试信息
  console.log("🧾 Avatar files found in S3:", result.Contents.length);
  result.Contents.forEach((obj) => {
    console.log(" -", obj.Key);
  });

  // 下载每一个头像
  const downloads = result.Contents.map((obj) => {
    const key = obj.Key;
    const filename = path.basename(key); // like 12345678.png
    const localPath = path.join(AVATAR_DIR, filename);
    return downloadS3File(key, localPath);
  });

  await Promise.all(downloads);

  console.log("✅ All avatars downloaded to", AVATAR_DIR);
}

module.exports = { downloadAllAvatars };
