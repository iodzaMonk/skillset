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
const ACCESS_KEY =
  process.env.AWS_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID_ID;
const SECRET_KEY =
  process.env.AWS_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY_ID;
const BUCKET = process.env.AWS_BUCKET_NAME;

const hasS3Config = Boolean(REGION && ACCESS_KEY && SECRET_KEY && BUCKET);

const s3 = hasS3Config
  ? new S3Client({
      region: REGION!,
      credentials: {
        accessKeyId: ACCESS_KEY!,
        secretAccessKey: SECRET_KEY!,
      },
    })
  : null;

type InMemoryObject = {
  body: Buffer | Uint8Array | string;
  contentType?: string;
};

const inMemoryBucket = new Map<string, InMemoryObject>();

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

  if (!s3) {
    return { url: `memory://${key}`, key };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { url: signedURL, key };
}

export type UploadObjectParams = {
  buffer: Buffer | Uint8Array | string;
  originalName?: string;
  contentType?: string;
};

export async function uploadObject({
  buffer,
  originalName,
  contentType,
}: UploadObjectParams) {
  const safeName = sanitizeFileName(originalName ?? "upload.bin");
  const key = `images/${randomUUID()}-${safeName}`;

  if (!s3 || !BUCKET) {
    inMemoryBucket.set(key, { body: buffer, contentType });
    return { key };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(putObjectCommand);

  return { key };
}

export async function createSignedDownloadUrl(key: string) {
  if (!s3 || !BUCKET) {
    if (!inMemoryBucket.has(key)) {
      throw new Error(`Object ${key} not found in in-memory bucket`);
    }
    return `memory://${key}`;
  }

  const getObjectCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, getObjectCommand, {
    expiresIn: 60,
  });
}

export async function deleteObject(key: string) {
  if (!s3 || !BUCKET) {
    inMemoryBucket.delete(key);
    return;
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3.send(deleteCommand);
}
