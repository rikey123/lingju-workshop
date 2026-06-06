import { describe, expect, it } from "vitest";

import {
  createExportRequest,
  filterScenes,
  getValidationSummary
} from "./workspace";
import { sampleWorkspace } from "./sample-data";

describe("workspace behavior", () => {
  it("filters outline cards by act and character while preserving order", () => {
    const scenes = filterScenes(sampleWorkspace.draft.scenes, {
      act: "act_01",
      characterId: "char_002"
    });

    expect(scenes.map((scene) => scene.id)).toEqual(["scene_002"]);
  });

  it("creates tracked export requests for every v1 format", () => {
    const request = createExportRequest(sampleWorkspace.draft.id, [
      "yaml",
      "fountain",
      "pdf",
      "docx",
      "fdx"
    ]);

    expect(request.formats).toEqual(["yaml", "fountain", "pdf", "docx", "fdx"]);
    expect(request.status).toBe("queued");
    expect(request.draftId).toBe(sampleWorkspace.draft.id);
  });

  it("summarizes validation warnings for editor and export views", () => {
    const summary = getValidationSummary(sampleWorkspace.validationIssues);

    expect(summary.errorCount).toBe(1);
    expect(summary.warningCount).toBe(2);
    expect(summary.blockIds).toContain("block_009");
  });
});
