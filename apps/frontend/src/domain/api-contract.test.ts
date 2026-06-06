import { describe, expect, it } from "vitest";

import type { ApiEnvelope, GenerationJob } from "./contracts";
import { sampleWorkspace } from "./sample-data";
import { getWorkspace, patchDraft } from "@/lib/api-client";

describe("API contract fixtures", () => {
  it("models success responses with data, meta, and null error", () => {
    const envelope: ApiEnvelope<typeof sampleWorkspace.project> = {
      data: sampleWorkspace.project,
      meta: {
        traceId: "trace-project"
      },
      error: null
    };

    expect(envelope.data?.id).toBe("project_qingshan");
    expect(envelope.meta).toHaveProperty("traceId");
    expect(envelope.error).toBeNull();
  });

  it("models conflict errors with server version details", () => {
    const envelope: ApiEnvelope<null> = {
      data: null,
      meta: {
        traceId: "trace-conflict"
      },
      error: {
        code: "VERSION_CONFLICT",
        message: "Draft version is stale.",
        details: {
          serverVersion: 8
        }
      }
    };

    expect(envelope.error?.code).toBe("VERSION_CONFLICT");
    expect(envelope.error?.details?.serverVersion).toBe(8);
  });

  it("keeps generation jobs on the shared job state model", () => {
    const job: GenerationJob = sampleWorkspace.generationJobs[0];

    expect(["queued", "running", "waiting_review", "succeeded", "failed", "canceled"]).toContain(
      job.state
    );
    expect(job.progress).toBeGreaterThan(0);
    expect(job.outputRefs).toContain("draft_qingshan_v1");
  });

  it("loads the workspace through the published fixture-backed API envelope", async () => {
    const response = await getWorkspace();

    expect(response).toMatchObject({
      data: {
        project: {
          id: "project_qingshan"
        },
        draft: {
          id: "draft_qingshan_v1"
        }
      },
      meta: {
        traceId: "mock-trace-workspace",
        contractVersion: "2026-06-07.frontend"
      },
      error: null
    });
  });

  it("advances draft versions on successful fixture patch responses", async () => {
    const response = await patchDraft(sampleWorkspace.draft);

    expect(response.error).toBeNull();
    expect(response.data?.version).toBe(sampleWorkspace.draft.version + 1);
    expect(response.meta).toMatchObject({
      traceId: "mock-trace-draft-patch",
      version: sampleWorkspace.draft.version + 1
    });
  });

  it("returns VERSION_CONFLICT when a fixture patch uses a stale version token", async () => {
    const response = await patchDraft({
      ...sampleWorkspace.draft,
      version: sampleWorkspace.draft.version - 1
    });

    expect(response.data).toBeNull();
    expect(response.error).toMatchObject({
      code: "VERSION_CONFLICT",
      details: {
        serverVersion: sampleWorkspace.draft.version
      }
    });
    expect(response.meta).toMatchObject({
      traceId: "mock-trace-draft-conflict",
      version: sampleWorkspace.draft.version
    });
  });
});
