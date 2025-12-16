import { uploadObject, type UploadObjectParams } from "./s3.ts";

type UploadHandler = (
  params: UploadObjectParams,
) => Promise<{ key: string }>;

let handler: UploadHandler = uploadObject;

export function setUploadHandler(customHandler: UploadHandler) {
  handler = customHandler;
}

export function resetUploadHandler() {
  handler = uploadObject;
}

export async function performUpload(params: UploadObjectParams) {
  return handler(params);
}

export type { UploadObjectParams };
