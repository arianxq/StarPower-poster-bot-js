const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

// S3 configuration (can be placed in .env or pre-configured)
const BUCKET = process.env.BUCKET_NAME || "starpower-media";
const AVATAR_PREFIX = "creator-avatar/";
const AVATAR_DIR = "/tmp/avatars"; // use /tmp

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "ap-southeast-2",
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// // Download all avatars to the local /tmp/avatars path (suitable for Lambda or local debugging)
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

// download all avatars
async function downloadAllAvatars() {
  // Ensure the local directory exists
  fs.mkdirSync(AVATAR_DIR, { recursive: true });

  const result = await s3
    .listObjectsV2({
      Bucket: BUCKET,
      Prefix: AVATAR_PREFIX,
    })
    .promise();

  // Log debug information
  console.log("🧾 Avatar files found in S3:", result.Contents.length);
  result.Contents.forEach((obj) => {
    console.log(" -", obj.Key);
  });

  // Download each avatar
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
