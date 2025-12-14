/// <reference types="jest" />

const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
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

const mockGetCurrentUser = jest.fn();
jest.mock("@/app/lib/user", () => ({
  getCurrentUser: mockGetCurrentUser,
}));

const mockCreateSignedDownloadUrl = jest.fn();
jest.mock("@/app/lib/storage/s3", () => ({
  createSignedDownloadUrl: mockCreateSignedDownloadUrl,
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
    jest.clearAllMocks();
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe("GET", () => {
    it("returns products without category filter", async () => {
      mockFindMany.mockResolvedValue([
        { id: "prod-1", title: "Product 1", image_location: null },
      ]);

      const response = await GET(
        new Request("http://localhost/api/product", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-referer")).toBe("https://example.com");
      expect(mockFindMany).toHaveBeenCalledWith({
        where: undefined,
      });
    });

    it("returns products with category filter", async () => {
      mockFindMany.mockResolvedValue([
        { id: "prod-1", title: "Product 1", category: "EDITING" },
      ]);

      const response = await GET(
        new Request("http://localhost/api/product?category=EDITING", {
          method: "GET",
        }),
      );

      expect(response.status).toBe(200);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { category: "EDITING" },
      });
    });

    it("returns products with signed image URLs", async () => {
      mockFindMany.mockResolvedValue([
        { id: "prod-1", title: "Product 1", image_location: "images/test.jpg" },
      ]);
      mockCreateSignedDownloadUrl.mockResolvedValue(
        "https://cdn.example.com/signed-url",
      );

      const response = await GET(
        new Request("http://localhost/api/product", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body[0].image_url).toBe("https://cdn.example.com/signed-url");
    });

    it("returns product without image_url when image_location is null", async () => {
      mockFindMany.mockResolvedValue([
        { id: "prod-1", title: "Product 1", image_location: null },
      ]);

      const response = await GET(
        new Request("http://localhost/api/product", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body[0].image_url).toBeUndefined();
      expect(mockCreateSignedDownloadUrl).not.toHaveBeenCalled();
    });

    it("returns product without image_url when signing fails", async () => {
      mockFindMany.mockResolvedValue([
        { id: "prod-1", title: "Product 1", image_location: "images/test.jpg" },
      ]);
      mockCreateSignedDownloadUrl.mockRejectedValue(
        new Error("Signing failed"),
      );

      const response = await GET(
        new Request("http://localhost/api/product", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body[0].image_url).toBeUndefined();
    });

    it("handles null referer header", async () => {
      mockHeaders.mockReturnValue(new Headers({})); // No referer
      mockFindMany.mockResolvedValue([]);

      const response = await GET(
        new Request("http://localhost/api/product", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-referer")).toBe("");
    });

    it("returns 500 when findMany throws", async () => {
      mockFindMany.mockRejectedValue(new Error("Database error"));

      const response = await GET(
        new Request("http://localhost/api/product", { method: "GET" }),
      );

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE", () => {
    it("deletes a product when authenticated", async () => {
      mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
      mockDelete.mockResolvedValue({ id: "prod-1" });

      const response = await DELETE(
        new Request("http://localhost/api/product", {
          method: "DELETE",
          body: JSON.stringify({ id: "prod-1" }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe("Product deleted");
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: "prod-1" },
      });
    });

    it("returns 401 when not authenticated", async () => {
      mockGetCurrentUser.mockResolvedValue(null);

      const response = await DELETE(
        new Request("http://localhost/api/product", {
          method: "DELETE",
          body: JSON.stringify({ id: "prod-1" }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe("Not authenticated");
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it("returns 500 when delete throws", async () => {
      mockGetCurrentUser.mockResolvedValue({ id: "user-1" });
      mockDelete.mockRejectedValue(new Error("Delete failed"));

      const response = await DELETE(
        new Request("http://localhost/api/product", {
          method: "DELETE",
          body: JSON.stringify({ id: "prod-1" }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.message).toBe("Internal server error");
    });
  });
});
