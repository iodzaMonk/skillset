import { Buffer } from "buffer";
import { NextResponse } from "next/server";

import { uploadObject } from "@/app/lib/storage/s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file upload payload" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { key } = await uploadObject({
      buffer,
      originalName: file.name,
      contentType: file.type || undefined,
    });

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload file to S3", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
