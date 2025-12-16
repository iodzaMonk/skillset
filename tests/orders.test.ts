export {};
const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockCreateCommand = jest.fn();
const mockFindManyCommands = jest.fn();
const mockFindUser = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    commands: {
      create: mockCreateCommand,
      findMany: mockFindManyCommands,
    },
    users: {
      findUnique: mockFindUser,
    },
  },
}));

const sendEmailMock = jest.fn();
const ResendMock = jest.fn().mockImplementation(() => ({
  emails: {
    send: sendEmailMock,
  },
}));
jest.mock("resend", () => ({
  Resend: ResendMock,
}));

describe("app/api/orders/route", () => {
  let POST: typeof import("@/app/api/orders/route").POST;
  let GET: typeof import("@/app/api/orders/route").GET;
  let consoleErrorSpy: jest.SpyInstance;
  const originalEmailApi = process.env.EMAIL_API;

  beforeAll(async () => {
    process.env.EMAIL_API = "test-email-api-key";
    ({ POST, GET } = await import("@/app/api/orders/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com/orders" }),
    );
    mockCreateCommand.mockResolvedValue({ id: "order-123" });
    mockFindManyCommands.mockResolvedValue([
      { id: "order-123", description: "Existing order" },
    ]);
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    process.env.EMAIL_API = originalEmailApi;
  });

  describe("POST", () => {
    it("creates an order, sends an email, and returns 201", async () => {
      mockFindUser
        .mockResolvedValueOnce({ email: "pro@example.com" })
        .mockResolvedValueOnce({ name: "Client Example" });

      const response = await POST(
        new Request("http://localhost/api/orders", {
          method: "POST",
          body: JSON.stringify({
            description: "Need a logo",
            prof_id: "prof-1",
            productId: "prod-1",
            userId: "user-1",
          }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(ResendMock).toHaveBeenCalledWith("test-email-api-key");
      expect(response.status).toBe(201);
      expect(response.headers.get("x-referer")).toBe(
        "https://example.com/orders",
      );
      await expect(response.json()).resolves.toEqual({
        id: "order-123",
        message: "Order processed successfully",
      });

      expect(mockCreateCommand).toHaveBeenCalledWith({
        data: expect.objectContaining({
          client_id: "user-1",
          prof_id: "prof-1",
          product_id: "prod-1",
          description: "Need a logo",
        }),
      });
      expect(sendEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "pro@example.com",
          subject: "New Order Received",
        }),
      );
    });

    it("falls back to default email when professional email missing", async () => {
      mockFindUser
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ name: "Client Example" });

      await POST(
        new Request("http://localhost/api/orders", {
          method: "POST",
          body: JSON.stringify({
            description: "Need a logo",
            prof_id: "prof-1",
            productId: "prod-1",
            userId: "user-1",
          }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(sendEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "bramomoh06@gmail.com",
        }),
      );
    });

    it("returns 500 when order creation fails", async () => {
      mockFindUser
        .mockResolvedValueOnce({ email: "pro@example.com" })
        .mockResolvedValueOnce({ name: "Client Example" });
      mockCreateCommand.mockRejectedValueOnce(new Error("create failed"));

      const response = await POST(
        new Request("http://localhost/api/orders", {
          method: "POST",
          body: JSON.stringify({
            description: "Need a logo",
            prof_id: "prof-1",
            productId: "prod-1",
            userId: "user-1",
          }),
          headers: { "content-type": "application/json" },
        }),
      );

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        message: "Failed to process order",
      });
      expect(sendEmailMock).not.toHaveBeenCalled();
    });
  });

  describe("GET", () => {
    it("returns orders with referer header", async () => {
      const response = await GET(
        new Request("http://localhost/api/orders", { method: "GET" }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("x-referer")).toBe(
        "https://example.com/orders",
      );
      await expect(response.json()).resolves.toEqual({
        data: [{ id: "order-123", description: "Existing order" }],
      });
      expect(mockFindManyCommands).toHaveBeenCalledTimes(1);
    });

    it("returns 500 when fetching orders fails", async () => {
      mockFindManyCommands.mockRejectedValueOnce(new Error("fetch failed"));

      const response = await GET(
        new Request("http://localhost/api/orders", { method: "GET" }),
      );

      expect(response.status).toBe(500);
      await expect(response.json()).resolves.toEqual({
        message: "Failed to fetch orders",
      });
    });
  });
});
