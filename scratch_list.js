import "dotenv/config";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { env } from "./config/env.js";

const r2 = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

async function list() {
  try {
    console.log("Listing objects in bucket:", env.R2_BUCKET_NAME);
    const command = new ListObjectsV2Command({
      Bucket: env.R2_BUCKET_NAME,
    });
    const res = await r2.send(command);
    console.log("Objects found:", res.Contents ? res.Contents.length : 0);
    if (res.Contents) {
      res.Contents.forEach((obj) => {
        console.log(` - Key: ${obj.Key}, Size: ${obj.Size} bytes`);
      });
    }
  } catch (err) {
    console.error("Error listing objects:", err.message);
  }
}

list();
