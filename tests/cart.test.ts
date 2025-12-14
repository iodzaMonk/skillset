const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockCreateCommand = jest.fn();
const mockFindManyCommands = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    commands: {
      create: mockCreateCommand,
      findMany: mockFindManyCommands,
    },
  },
}));

describe("app/api/cart/route", () => {
  let POST: typeof import("@/app/api/cart/route").POST;
  let GET: typeof import("@/app/api/cart/route").GET;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ POST, GET } = await import("@/app/api/cart/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );
    mockCreateCommand.mockResolvedValue({ id: "command-123" });
    mockFindManyCommands.mockResolvedValue([
      { id: "command-123", description: "Order description" },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("POST", () => {
    it("handles null referer header", async () => {
      mockHeaders.mockReturnValue(new Headers({})); // No referer

      const response = await POST(
        new Request("http://localhost/api/cart", {
          method: "POST",
          body: JSON.stringify({
            description: "Need a video edit",
            prof_id: "prof-1",
            productId: "prod-1",
            userId: "user-1",
          }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(201);
      expect(response.headers.get("x-referer")).toBe("");
    });
    it("creates an order and returns 201 with referer header", async () => {
      const response = await POST(
        new Request("http://localhost/api/cart", {
          method: "POST",
          body: JSON.stringify({
            description: "Need a video edit",
            prof_id: "prof-1",
            productId: "prod-1",
            userId: "user-1",
          }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(201);
      expect(response.headers.get("x-referer")).toBe("https://example.com");

      await expect(response.json()).resolves.toEqual({
        id: "command-123",
        message: "Order processed successfully",
      });

      expect(mockCreateCommand).toHaveBeenCalledWith({
        data: expect.objectContaining({
          client_id: "user-1",
          prof_id: "prof-1",
          product_id: "prod-1",
          description: "Need a video edit",
        }),
      });
    });

    it("returns 500 when prisma throws", async () => {
      mockCreateCommand.mockRejectedValueOnce(new Error("create failed"));

      const response = await POST(
        new Request("http://localhost/api/cart", {
          method: "POST",
          body: JSON.stringify({
            description: "Need a video edit",
            prof_id: "prof-1",
            productId: "prod-1",
            userId: "user-1",
          }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(500);
      expect(response.headers.get("x-referer")).toBe("https://example.com");

      await expect(response.json()).resolves.toEqual({
        message: "Failed to process order",
      });
    });
  });

  describe("GET", () => {
    it("handles null referer header", async () => {
      mockHeaders.mockReturnValue(new Headers({})); // No referer

      const response = await GET(
        new Request("http://localhost/api/cart", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-referer")).toBe("");
    });

    it("returns orders with referer header", async () => {
      const response = await GET(
        new Request("http://localhost/api/cart", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-referer")).toBe("https://example.com");

      await expect(response.json()).resolves.toEqual({
        data: [{ id: "command-123", description: "Order description" }],
      });
      expect(mockFindManyCommands).toHaveBeenCalledTimes(1);
    });

    it("returns 500 when fetching orders fails", async () => {
      mockFindManyCommands.mockRejectedValueOnce(new Error("fetch failed"));

      const response = await GET(
        new Request("http://localhost/api/cart", { method: "GET" }),
      );

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        message: "Failed to fetch orders",
      });
    });
  });
});
