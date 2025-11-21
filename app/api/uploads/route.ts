import { Buffer } from "buffer";
import { performUpload } from "../../lib/storage/uploadAdapter.ts";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Missing file upload payload" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { key } = await performUpload({
      buffer,
      originalName: file.name,
      contentType: file.type || undefined,
    });

    return Response.json({ key }, { status: 201 });
  } catch (error) {
    console.error("Failed to upload file to S3", error);
    return Response.json({ error: "File upload failed" }, { status: 500 });
  }
}
