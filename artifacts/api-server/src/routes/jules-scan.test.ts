import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";

const GITHUB_API_BASE = "https://api.github.com";

const mockUpdateSet = vi.fn().mockReturnValue({
  where: vi.fn().mockResolvedValue([]),
});

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
    set: mockUpdateSet,
  }),
  select: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  }),
};

const mockAi = {
  models: {
    generateContent: vi.fn().mockResolvedValue({
      text: `Analysis.\`\`\`json\n{"riskLevel":"low","totalFindings":0,"criticalCount":0,"highCount":0,"mediumCount":0,"lowCount":0,"findings":[]}\n\`\`\``,
    }),
  },
};

vi.mock("@workspace/db", () => ({
  db: mockDb,
  julesAnalysesTable: {},
}));

vi.mock("@workspace/integrations-gemini-ai", () => ({
  ai: mockAi,
}));

async function makeApp(repoOwner = "acme", repoName = "my-repo", analysisId = "analysis-id-1") {
  mockDb.insert = vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([
        {
          id: analysisId,
          userId: "user-1",
          repoUrl: `https://github.com/${repoOwner}/${repoName}`,
          repoOwner,
          repoName,
          status: "pending",
        },
      ]),
    }),
  });

  const { default: router } = await import("./jules-scan.js");
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as express.Request).isAuthenticated = function () { return true; } as express.Request["isAuthenticated"];
    (req as express.Request).user = { id: "user-1", email: null, firstName: null, lastName: null, profileImageUrl: null };
    next();
  });
  app.use("/", router);
  return app;
}

function makeFetchStub(capturedUrls: string[], overrideHandler?: (url: string) => Response | null) {
  return vi.fn(async (url: string) => {
    capturedUrls.push(url);

    if (overrideHandler) {
      const result = overrideHandler(url);
      if (result) return result;
    }

    if (/\/repos\/[^/]+\/[^/]+$/.test(url)) {
      const repoSegment = url.split("/repos/")[1];
      const repoName = repoSegment?.split("/")[1] ?? "";
      const branch = repoName === "master-repo" ? "master" : "main";
      return new Response(
        JSON.stringify({ default_branch: branch }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.includes("/git/trees/")) {
      return new Response(
        JSON.stringify({ tree: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({}), { status: 200 });
  });
}

describe("POST /jules-scan — GitHub API + Gemini pipeline", () => {
  let capturedFetchUrls: string[] = [];

  beforeEach(() => {
    capturedFetchUrls = [];
    mockUpdateSet.mockReturnValue({ where: vi.fn().mockResolvedValue([]) });
    mockDb.update = vi.fn().mockReturnValue({ set: mockUpdateSet });
    mockAi.models.generateContent = vi.fn().mockResolvedValue({
      text: `Analysis.\`\`\`json\n{"riskLevel":"low","totalFindings":0,"criticalCount":0,"highCount":0,"mediumCount":0,"lowCount":0,"findings":[]}\n\`\`\``,
    });
    vi.stubGlobal("fetch", makeFetchStub(capturedFetchUrls));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("calls GitHub API for repo metadata BEFORE fetching the file tree (ordering assertion)", async () => {
    const app = await makeApp();

    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/my-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        const repoIdx = capturedFetchUrls.indexOf(`${GITHUB_API_BASE}/repos/acme/my-repo`);
        const treeIdx = capturedFetchUrls.findIndex((u) =>
          u.includes("/repos/acme/my-repo/git/trees/")
        );
        expect(repoIdx).toBeGreaterThanOrEqual(0);
        expect(treeIdx).toBeGreaterThan(repoIdx);
        return true;
      },
      { timeout: 3000 }
    );
  });

  it("uses the detected branch name 'master' when fetching the file tree", async () => {
    const app = await makeApp("acme", "master-repo", "analysis-master");

    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/master-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        const treeCall = capturedFetchUrls.find((u) =>
          u.includes("/repos/acme/master-repo/git/trees/master")
        );
        expect(treeCall).toBeDefined();
        return true;
      },
      { timeout: 3000 }
    );
  });

  it("returns 400 with a clear error message for a non-GitHub URL", async () => {
    const app = await makeApp();

    const res = await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://gitlab.com/acme/my-repo" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("returns 400 for hosts that only contain 'github.com' as a substring (e.g. evilgithub.com)", async () => {
    const app = await makeApp();

    const res = await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://evilgithub.com/acme/my-repo" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when repoUrl is missing", async () => {
    const app = await makeApp();
    const res = await request(app).post("/jules-scan").send({});
    expect(res.status).toBe(400);
  });

  it("sets status to 'failed' with a message containing the 404 when GitHub API returns not found", async () => {
    vi.stubGlobal(
      "fetch",
      makeFetchStub(capturedFetchUrls, (url) => {
        if (/\/repos\//.test(url)) {
          return new Response(JSON.stringify({ message: "Not Found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return null;
      })
    );

    const localUpdateSet = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    });
    mockDb.update = vi.fn().mockReturnValue({ set: localUpdateSet });

    const app = await makeApp("acme", "nonexistent-repo", "analysis-404");

    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/nonexistent-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        const failedCall = localUpdateSet.mock.calls.find(
          (args) =>
            args[0] &&
            typeof args[0] === "object" &&
            (args[0] as Record<string, unknown>).status === "failed"
        );
        expect(failedCall).toBeDefined();
        return failedCall;
      },
      { timeout: 3000 }
    );

    const failedCall = localUpdateSet.mock.calls.find(
      (args) =>
        args[0] &&
        typeof args[0] === "object" &&
        (args[0] as Record<string, unknown>).status === "failed"
    );
    const setArg = failedCall![0] as Record<string, unknown>;
    expect(typeof setArg.errorMessage).toBe("string");
    expect((setArg.errorMessage as string).length).toBeGreaterThan(0);
    expect(setArg.errorMessage).toMatch(/404/);
  });

  it("sets status to 'failed' with Gemini error message when AI call fails", async () => {
    mockAi.models.generateContent = vi.fn().mockRejectedValue(
      new Error("Gemini quota exceeded")
    );

    const localUpdateSet = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    });
    mockDb.update = vi.fn().mockReturnValue({ set: localUpdateSet });

    const app = await makeApp();

    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/my-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        const failedCall = localUpdateSet.mock.calls.find(
          (args) =>
            args[0] &&
            typeof args[0] === "object" &&
            (args[0] as Record<string, unknown>).status === "failed"
        );
        expect(failedCall).toBeDefined();
        return failedCall;
      },
      { timeout: 3000 }
    );

    const failedCall = localUpdateSet.mock.calls.find(
      (args) =>
        args[0] &&
        typeof args[0] === "object" &&
        (args[0] as Record<string, unknown>).status === "failed"
    );
    const setArg = failedCall![0] as Record<string, unknown>;
    expect(setArg.errorMessage).toContain("Gemini quota exceeded");
  });

  it("does NOT call jules.googleapis.com at any point", async () => {
    const app = await makeApp();

    await request(app)
      .post("/jules-scan")
      .send({ repoUrl: "https://github.com/acme/my-repo" })
      .expect(201);

    await vi.waitFor(
      () => {
        expect(capturedFetchUrls.length).toBeGreaterThan(0);
        return true;
      },
      { timeout: 3000 }
    );

    const julesCall = capturedFetchUrls.find((u) => u.includes("jules.googleapis.com"));
    expect(julesCall).toBeUndefined();
  });
});
