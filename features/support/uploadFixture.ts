import {
  setUploadHandler,
  resetUploadHandler,
  type UploadObjectParams,
} from "../../app/lib/storage/uploadAdapter.ts";
import { POST } from "../../app/api/uploads/route.ts";

type UploadResponse = {
  status: number;
  body: Record<string, unknown>;
};

export class UploadFixture {
  response: UploadResponse | null = null;
  private capturedPayload: UploadObjectParams | null = null;

  async uploadFile(row: Record<string, string>) {
    const name = row.name ?? "upload.bin";
    const type = row.type ?? "application/octet-stream";
    const content = row.content ?? "sample";
    const formData = new FormData();
    const file = new File([content], name, { type });
    formData.append("file", file);
    await this.invoke(formData);
  }

  async uploadWithoutFile() {
    const formData = new FormData();
    await this.invoke(formData);
  }

  failUploadsWith(message: string) {
    setUploadHandler(async () => {
      throw new Error(message);
    });
  }

  captureUploads() {
    this.capturedPayload = null;
    setUploadHandler(async (params) => {
      this.capturedPayload = params;
      return { key: `captured:${params.originalName ?? "file"}` };
    });
  }

  getCapturedPayload() {
    return this.capturedPayload;
  }

  resetUploads() {
    resetUploadHandler();
    this.capturedPayload = null;
  }

  private async invoke(formData: FormData) {
    const request = new Request("http://localhost/api/uploads", {
      method: "POST",
      body: formData,
    });
    const response = await POST(request);
    const body = await response.json();
    this.response = { status: response.status, body };
  }
}
