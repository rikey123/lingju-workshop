import type { ApiEnvelope, Draft, Workspace } from "@/domain/contracts";
import { sampleWorkspace } from "@/domain/sample-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const serverDraftVersion = sampleWorkspace.draft.version;

export async function getWorkspace(): Promise<ApiEnvelope<Workspace>> {
  await delay(40);
  return {
    data: sampleWorkspace,
    meta: {
      traceId: "mock-trace-workspace",
      contractVersion: "2026-06-07.frontend"
    },
    error: null
  };
}

export async function patchDraft(draft: Draft): Promise<ApiEnvelope<Draft>> {
  await delay(80);

  if (draft.version < serverDraftVersion) {
    return {
      data: null,
      meta: {
        traceId: "mock-trace-draft-conflict",
        version: serverDraftVersion
      },
      error: {
        code: "VERSION_CONFLICT",
        message: "Draft version is stale.",
        details: {
          serverVersion: serverDraftVersion
        }
      }
    };
  }

  return {
    data: {
      ...draft,
      version: draft.version + 1
    },
    meta: {
      traceId: "mock-trace-draft-patch",
      version: draft.version + 1
    },
    error: null
  };
}
