const mockHeaders = jest.fn();

jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockCreateSignedDownloadUrl = jest.fn();
jest.mock("@/app/lib/storage/s3", () => ({
  createSignedDownloadUrl: mockCreateSignedDownloadUrl,
}));

const mockGetCurrentUser = jest.fn();
jest.mock("@/app/lib/user", () => ({
  getCurrentUser: mockGetCurrentUser,
}));

const mockFindMany = jest.fn();
const mockDelete = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    posts: {
      findMany: mockFindMany,
      delete: mockDelete,
    },
  },
}));

describe("app/api/product/route", () => {
  let GET: typeof import("@/app/api/product/route").GET;
  let DELETE: typeof import("@/app/api/product/route").DELETE;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ GET, DELETE } = await import("@/app/api/product/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );

    mockFindMany.mockResolvedValue([
      {
        id: "post-1",
        user_id: "user-1",
        title: "Test product",
        description: "A mocked product",
        rating: null,
        ratingCount: 0,
        price: 10,
        date: new Date(),
        image_location: "path/to/image.jpg",
        category: "Editing",
      },
    ]);

    mockDelete.mockResolvedValue(undefined);
    mockCreateSignedDownloadUrl.mockResolvedValue(
      "https://signed-url.example/path/to/image.jpg",
    );
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe("GET", () => {
    it("returns products with signed image URLs and referer header", async () => {
      const response = await GET(
        new Request("http://localhost/api/product?category=Editing"),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-referer")).toBe("https://example.com");

      const body = await response.json();
      expect(body).toEqual([
        expect.objectContaining({
          id: "post-1",
          image_url: "https://signed-url.example/path/to/image.jpg",
        }),
      ]);

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { category: "Editing" },
      });
      expect(mockCreateSignedDownloadUrl).toHaveBeenCalledWith(
        "path/to/image.jpg",
      );
    });

    it("skips signing when product has no image", async () => {
      mockFindMany.mockResolvedValueOnce([
        {
          id: "post-2",
          user_id: "user-2",
          title: "No image product",
          description: "Without image",
          rating: null,
          ratingCount: 0,
          price: 5,
          date: new Date(),
          image_location: null,
          category: "Design",
        },
      ]);

      const response = await GET(
        new Request("http://localhost/api/product?category=Design"),
      );

      expect(response.status).toBe(200);
      expect(mockCreateSignedDownloadUrl).not.toHaveBeenCalled();
      await expect(response.json()).resolves.toEqual([
        expect.objectContaining({
          id: "post-2",
          image_location: null,
        }),
      ]);
    });

    it("returns 500 when fetching products fails", async () => {
      mockFindMany.mockRejectedValueOnce(new Error("db down"));

      const response = await GET(
        new Request("http://localhost/api/product?category=Editing"),
      );

      expect(response.status).toBe(500);
      expect(response.headers.get("x-referer")).toBe("https://example.com");
      expect(await response.text()).toBe("Error");
    });
  });

  describe("DELETE", () => {
    it("returns 401 when the user is not authenticated", async () => {
      mockGetCurrentUser.mockResolvedValueOnce(null);

      const response = await DELETE(
        new Request("http://localhost/api/product", {
          method: "DELETE",
          body: JSON.stringify({ id: "post-1" }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        message: "Not authenticated",
      });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it("deletes the product and returns a success message", async () => {
      const response = await DELETE(
        new Request("http://localhost/api/product", {
          method: "DELETE",
          body: JSON.stringify({ id: "post-1" }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        message: "Product deleted",
      });
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: "post-1" },
      });
    });
  });
});
