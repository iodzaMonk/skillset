const mockGetCurrentUser = jest.fn();
jest.mock("@/app/lib/user", () => ({
  getCurrentUser: mockGetCurrentUser,
}));

const mockDeleteSession = jest.fn();
jest.mock("@/app/lib/session", () => ({
  deleteSession: mockDeleteSession,
}));

const mockUsersDelete = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    users: {
      delete: mockUsersDelete,
    },
  },
}));

describe("app/api/user/delete/route", () => {
  let DELETE: typeof import("@/app/api/user/delete/route").DELETE;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ DELETE } = await import("@/app/api/user/delete/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteSession.mockResolvedValue(undefined);
    mockUsersDelete.mockResolvedValue(undefined);
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns 401 when user not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValueOnce(null);

    const response = await DELETE();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: "Not authenticated",
    });
    expect(mockUsersDelete).not.toHaveBeenCalled();
  });

  it("deletes account and session", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ id: "user-1" });

    const response = await DELETE();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "Account deleted",
    });
    expect(mockUsersDelete).toHaveBeenCalledWith({
      where: { id: "user-1" },
    });
    expect(mockDeleteSession).toHaveBeenCalled();
  });

  it("returns 500 on unexpected error", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ id: "user-1" });
    mockUsersDelete.mockRejectedValueOnce(new Error("db down"));

    const response = await DELETE();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Internal server error",
    });
  });
});
