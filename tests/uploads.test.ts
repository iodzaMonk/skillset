export {};
const mockUploadObject = jest.fn();
jest.mock("@/app/lib/storage/s3", () => ({
  uploadObject: mockUploadObject,
}));

describe("app/api/uploads/route", () => {
  let POST: typeof import("@/app/api/uploads/route").POST;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ POST } = await import("@/app/api/uploads/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    mockUploadObject.mockResolvedValue({ key: "uploads/file-123.png" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns 400 when file payload is missing", async () => {
    const formData = new FormData();
    formData.append("file", "not-a-file");

    const response = await POST(
      new Request("http://localhost/api/uploads", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing file upload payload",
    });
    expect(mockUploadObject).not.toHaveBeenCalled();
  });

  it("uploads file and returns the S3 key", async () => {
    const file = new File(["hello"], "test.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);

    const response = await POST(
      new Request("http://localhost/api/uploads", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      key: "uploads/file-123.png",
    });

    expect(mockUploadObject).toHaveBeenCalledWith(
      expect.objectContaining({
        originalName: "test.png",
        contentType: "image/png",
        buffer: expect.any(Buffer),
      }),
    );
  });

  it("returns 500 when upload fails", async () => {
    mockUploadObject.mockRejectedValueOnce(new Error("upload failed"));

    const file = new File(["hello"], "test.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);

    const response = await POST(
      new Request("http://localhost/api/uploads", {
        method: "POST",
        body: formData,
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "File upload failed",
    });
  });
});
