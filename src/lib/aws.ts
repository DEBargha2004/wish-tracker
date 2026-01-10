import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

export const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getPresignedUrl(
  key: string,
  contentType: string = "image/jpeg",
  expiresIn = 3600
) {
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command, { expiresIn });
}
