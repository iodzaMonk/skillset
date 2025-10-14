import { randomUUID } from "crypto";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION =
  process.env.AWS_BUCKET_REGION ??
  process.env.AWS_REGION ??
  process.env.AWS_DEFAULT_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY ?? process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY =
  process.env.AWS_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY_ID;
const BUCKET = process.env.AWS_BUCKET_NAME;

if (!REGION) {
  throw new Error(
    "AWS region missing. Set AWS_BUCKET_REGION (or AWS_REGION / AWS_DEFAULT_REGION).",
  );
}

if (!ACCESS_KEY || !SECRET_KEY) {
  throw new Error(
    "AWS credentials missing. Set AWS_ACCESS_KEY and AWS_SECRET_ACCESS_KEY.",
  );
}

if (!BUCKET) {
  throw new Error("AWS bucket name missing. Set AWS_BUCKET_NAME.");
}

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function createSignedUploadUrl(originalName?: string) {
  const safeName = sanitizeFileName(originalName ?? "upload.bin");
  const key = `images/${randomUUID()}-${safeName}`;

  const putObjectCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { url: signedURL, key };
}

export async function createSignedDownloadUrl(key: string) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, getObjectCommand, {
    expiresIn: 60,
  });
}

export async function deleteObject(key: string) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3.send(deleteCommand);
}
