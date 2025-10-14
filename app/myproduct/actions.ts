"use server";

import {
  createSignedUploadUrl,
  deleteObject,
} from "@/app/lib/storage/s3";

export async function requestUploadUrl(originalName?: string) {
  return createSignedUploadUrl(originalName);
}

export async function deleteFile(key: string) {
  if (!key) {
    return;
  }

  await deleteObject(key);
}
