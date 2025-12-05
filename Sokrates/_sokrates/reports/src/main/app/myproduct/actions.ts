"use server";

import { deleteObject } from "@/app/lib/storage/s3";

export async function deleteFile(key: string) {
  if (!key) {
    return;
  }

  await deleteObject(key);
}
