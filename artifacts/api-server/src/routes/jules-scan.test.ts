import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";

const JULES_BASE = "https://jules.googleapis.com/v1alpha";

const mockDb = {
  insert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([
        {
          id: "analysis-id-1",
          userId: "user-1",
          repoUrl: "https://github.com/acme/my-repo",
          repoOwner: "acme",
          repoName: "my-repo",
          status: "pending",
        },
      ]),
    }),
  }),
  update: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
  }),
};

vi.mock("@workspace/db", () => ({
  db: mockDb,
  julesAnalysesTable: {},
}));

describe("POST /jules-scan — Jules API session payload", () => {
  let app: express.Express;
  let capturedFetchCalls: Array<{ url: string; body: unknown }> = [];

  beforeEach(async () => {
    process.env.JULES_API_KEY = "test-api-key";
    capturedFetchCalls = [];

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const body = init?.body ? JSON.parse(init.body as string) : undefined;
        capturedFetchCalls.push({ url, body });
        return new Response(JSON.stringify({ id: "session-abc-123" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    const { default: router } = await import("./jules-scan.js");

    app = express();
    app.use(express.json());

    app.use((req, _res, next) => {
      (req as express.Request & { isAuthenticated: () => boolean }).isAuthenticated = () => true;
      (req as express.Request & { user?: { id: string } }).user = { id: "user-1" };
      next();
    });

    app.use("/", router);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    vi.resetModules();
    delete process.env.JULES_API_KEY;
  });

  it("sends sourceContext with correct source and githubRepoContext to Jules API", async () => {
    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/my-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        const sessionCall = capturedFetchCalls.find((c) =>
          c.url === `${JULES_BASE}/sessions`
        );
        expect(sessionCall).toBeDefined();
        return sessionCall;
      },
      { timeout: 2000 }
    );

    const sessionCall = capturedFetchCalls.find((c) => c.url === `${JULES_BASE}/sessions`);
    const body = sessionCall!.body as Record<string, unknown>;
    expect(body.sourceContext).toEqual({
      source: "sources/github-acme-my-repo",
      githubRepoContext: {
        startingBranch: "main",
      },
    });
  });

  it("does NOT send top-level source or branch fields to Jules API", async () => {
    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/my-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        const sessionCall = capturedFetchCalls.find((c) =>
          c.url === `${JULES_BASE}/sessions`
        );
        expect(sessionCall).toBeDefined();
        return sessionCall;
      },
      { timeout: 2000 }
    );

    const sessionCall = capturedFetchCalls.find((c) => c.url === `${JULES_BASE}/sessions`);
    expect(sessionCall!.body).not.toHaveProperty("source");
    expect(sessionCall!.body).not.toHaveProperty("branch");
  });
});
