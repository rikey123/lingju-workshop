import { beforeEach, describe, expect, it } from "vitest";

import { useWorkspaceStore } from "./workspace-store";

describe("workspace store", () => {
  beforeEach(() => {
    useWorkspaceStore.getState().reset();
  });

  it("marks the draft dirty when the real DnD scene move path reorders scenes", () => {
    useWorkspaceStore.getState().moveScene("scene_003", "scene_002");

    const state = useWorkspaceStore.getState();

    expect(state.autosaveState).toBe("dirty");
    expect(state.scenes.map((scene) => scene.id)).toEqual([
      "scene_001",
      "scene_003",
      "scene_002"
    ]);
  });
});
