const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: mockHeaders,
}));

const mockHash = jest.fn();
jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: { hash: mockHash },
  hash: mockHash,
}));

const mockUpdate = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    users: {
      update: mockUpdate,
    },
  },
}));

const mockGetCurrentUser = jest.fn();
jest.mock("@/app/lib/user", () => ({
  getCurrentUser: mockGetCurrentUser,
}));

describe("app/api/user/update/route", () => {
  let PATCH: typeof import("@/app/api/user/update/route").PATCH;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ PATCH } = await import("@/app/api/user/update/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.mockReturnValue(
      new Headers({ referer: "https://example.com" }),
    );
    mockHash.mockResolvedValue("hashed-password");
    mockUpdate.mockResolvedValue({ id: "user-1", email: "new@test.com" });
    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const buildRequest = (body: unknown) =>
    new Request("http://localhost/api/user/update", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

  it("returns 400 when user is not authorized", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ id: "other-user" });

    const response = await PATCH(
      buildRequest({ id: "user-1", email: "new@test.com" }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Unauthorized: You can only update your own record.",
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("updates user and returns data", async () => {
    const response = await PATCH(
      buildRequest({
        id: "user-1",
        email: "new@test.com",
        password: "secret",
        country: "CA",
        name: "User",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-referer")).toBe("https://example.com");
    await expect(response.json()).resolves.toEqual({
      data: { id: "user-1", email: "new@test.com" },
    });
    expect(mockHash).toHaveBeenCalledWith("secret", 10);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: expect.objectContaining({
        email: "new@test.com",
        password: "hashed-password",
        country: "CA",
        name: "User",
      }),
    });
  });

  it("returns 404 when user not found", async () => {
    const prismaModule = await import("@prisma/client");
    const error = new prismaModule.Prisma.PrismaClientKnownRequestError(
      "not found",
      { code: "P2025", clientVersion: "1" },
    );
    mockUpdate.mockRejectedValueOnce(error);

    const response = await PATCH(buildRequest({ id: "user-1" }));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: "User not found",
    });
  });

  it("returns 409 when email already in use", async () => {
    const prismaModule = await import("@prisma/client");
    const error = new prismaModule.Prisma.PrismaClientKnownRequestError(
      "conflict",
      { code: "P2002", clientVersion: "1" },
    );
    mockUpdate.mockRejectedValueOnce(error);

    const response = await PATCH(buildRequest({ id: "user-1" }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: "Email already in use",
    });
  });

  it("returns 500 on unexpected error", async () => {
    mockUpdate.mockRejectedValueOnce(new Error("db down"));

    const response = await PATCH(buildRequest({ id: "user-1" }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Internal server error",
    });
  });
});
