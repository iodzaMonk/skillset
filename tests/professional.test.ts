import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const mockFindUnique = jest.fn();
const mockAggregate = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    users: {
      findUnique: mockFindUnique,
    },
    posts: {
      aggregate: mockAggregate,
    },
  },
}));

const mockCreateSignedDownloadUrl = jest.fn();
jest.mock("@/app/lib/storage/s3", () => ({
  createSignedDownloadUrl: mockCreateSignedDownloadUrl,
}));

describe("app/api/professional/[id]/route", () => {
  let GET: typeof import("@/app/api/professional/[id]/route").GET;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ GET } = await import("@/app/api/professional/[id]/route"));
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAggregate.mockResolvedValue({
      _avg: { rating: 4.5 },
      _sum: { ratingCount: 12 },
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const buildContext = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  it("returns professional profile with signed image URLs and stats", async () => {
    mockFindUnique.mockResolvedValue({
      id: "prof-1",
      name: "Jane Doe",
      email: "jane@example.com",
      country: "US",
      posts: [
        {
          id: "post-1",
          title: "Editing gig",
          description: "Video editing service",
          price: 100,
          rating: 5,
          ratingCount: 10,
          date: new Date("2024-01-01"),
          image_location: "images/post-1.png",
        },
      ],
    });
    mockCreateSignedDownloadUrl.mockResolvedValue(
      "https://cdn.example.com/post-1.png",
    );

    const response = await GET(
      new Request("http://localhost/api/professional/prof-1"),
      buildContext("prof-1"),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      id: "prof-1",
      name: "Jane Doe",
      email: "jane@example.com",
      country: "US",
      stats: {
        totalProducts: 1,
        averageRating: 4.5,
        totalRatings: 12,
      },
      posts: [
        expect.objectContaining({
          id: "post-1",
          image_url: "https://cdn.example.com/post-1.png",
        }),
      ],
    });

    expect(mockCreateSignedDownloadUrl).toHaveBeenCalledWith(
      "images/post-1.png",
    );
    expect(mockAggregate).toHaveBeenCalledWith({
      where: { user_id: "prof-1", rating: { not: null } },
      _avg: { rating: true },
      _sum: { ratingCount: true },
    });
  });

  it("returns placeholder image when image is missing or signing fails", async () => {
    mockFindUnique.mockResolvedValue({
      id: "prof-1",
      name: "Jane Doe",
      email: "jane@example.com",
      country: "US",
      posts: [
        {
          id: "post-1",
          title: "No image post",
          description: "Service without image",
          price: 50,
          rating: null,
          ratingCount: 0,
          date: new Date(),
          image_location: null,
        },
        {
          id: "post-2",
          title: "Image signing fails",
          description: "Service with failing image",
          price: 60,
          rating: null,
          ratingCount: 0,
          date: new Date(),
          image_location: "images/post-2.png",
        },
      ],
    });

    mockCreateSignedDownloadUrl.mockRejectedValueOnce(
      new Error("signing failure"),
    );

    const response = await GET(
      new Request("http://localhost/api/professional/prof-1"),
      buildContext("prof-1"),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.posts).toEqual([
      expect.objectContaining({
        id: "post-1",
        image_url: "/no-image.svg",
      }),
      expect.objectContaining({
        id: "post-2",
        image_url: "/no-image.svg",
      }),
    ]);
  });

  it("returns 404 when professional is not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/professional/prof-404"),
      buildContext("prof-404"),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: "Professional not found",
    });
  });

  it("returns 400 when Prisma known request error occurs", async () => {
    const prismaError = new Error("invalid id");
    Object.setPrototypeOf(prismaError, PrismaClientKnownRequestError.prototype);
    mockFindUnique.mockRejectedValue(prismaError);

    const response = await GET(
      new Request("http://localhost/api/professional/prof-error"),
      buildContext("prof-error"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid professional ID",
    });
  });

  it("returns 500 for unexpected errors", async () => {
    mockFindUnique.mockRejectedValue(new Error("database offline"));

    const response = await GET(
      new Request("http://localhost/api/professional/prof-error"),
      buildContext("prof-error"),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Internal Server Error",
    });
  });
});
