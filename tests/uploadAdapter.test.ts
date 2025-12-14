const mockUploadObject = jest.fn();
jest.mock("@/app/lib/storage/s3", () => ({
  uploadObject: mockUploadObject,
}));

describe("app/lib/storage/uploadAdapter", () => {
  let setUploadHandler: typeof import("@/app/lib/storage/uploadAdapter").setUploadHandler;
  let resetUploadHandler: typeof import("@/app/lib/storage/uploadAdapter").resetUploadHandler;
  let performUpload: typeof import("@/app/lib/storage/uploadAdapter").performUpload;

  beforeAll(async () => {
    ({ setUploadHandler, resetUploadHandler, performUpload } = await import(
      "@/app/lib/storage/uploadAdapter"
    ));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUploadObject.mockResolvedValue({ key: "default-key" });
    resetUploadHandler();
  });

  it("uses default uploadObject handler", async () => {
    const result = await performUpload({
      bucket: "test-bucket",
      key: "test-key",
      body: Buffer.from("test"),
      contentType: "text/plain",
    });

    expect(mockUploadObject).toHaveBeenCalled();
    expect(result).toEqual({ key: "default-key" });
  });

  it("uses custom handler when set", async () => {
    const customHandler = jest.fn().mockResolvedValue({ key: "custom-key" });
    setUploadHandler(customHandler);

    const result = await performUpload({
      bucket: "test-bucket",
      key: "test-key",
      body: Buffer.from("test"),
      contentType: "text/plain",
    });

    expect(customHandler).toHaveBeenCalled();
    expect(mockUploadObject).not.toHaveBeenCalled();
    expect(result).toEqual({ key: "custom-key" });
  });

  it("resets to default handler", async () => {
    const customHandler = jest.fn().mockResolvedValue({ key: "custom-key" });
    setUploadHandler(customHandler);
    resetUploadHandler();

    await performUpload({
      bucket: "test-bucket",
      key: "test-key",
      body: Buffer.from("test"),
      contentType: "text/plain",
    });

    expect(mockUploadObject).toHaveBeenCalled();
    expect(customHandler).not.toHaveBeenCalled();
  });
});
