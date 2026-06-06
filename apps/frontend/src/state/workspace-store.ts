import { create } from "zustand";

import type { Scene } from "@/domain/contracts";
import { sampleWorkspace } from "@/domain/sample-data";
import { createUniqueBlockId, reorderScenes } from "@/domain/screenplay";

export type WorkspaceView =
  | "editor"
  | "outline"
  | "characters"
  | "graph"
  | "quality"
  | "export"
  | "history";

type AutosaveState = "idle" | "dirty" | "saving" | "saved" | "conflict";

type WorkspaceStore = {
  activeView: WorkspaceView;
  activeSceneId: string;
  activeBlockId: string;
  autosaveState: AutosaveState;
  draftVersion: number;
  conflictVersion?: number;
  setActiveView: (view: WorkspaceView) => void;
  setActiveScene: (sceneId: string) => void;
  setActiveBlock: (blockId: string) => void;
  markDirty: () => void;
  markSaving: () => void;
  markSaved: (version?: number) => void;
  markConflict: (serverVersion: number) => void;
  setDraftVersion: (version: number) => void;
  replaceScenes: (scenes: Scene[]) => void;
  moveScene: (activeId: string, overId: string) => void;
  nextBlockId: (baseBlockId: string, suffix: string) => string;
  reset: () => void;
  scenes: Scene[];
};

const cloneScenes = (scenes: Scene[]) =>
  scenes.map((scene) => ({
    ...scene,
    emotionalCurve: { ...scene.emotionalCurve },
    cameraSuggestions: scene.cameraSuggestions.map((suggestion) => ({ ...suggestion })),
    blocks: scene.blocks.map((block) => ({
      ...block,
      sourceRefs: block.sourceRefs.map((sourceRef) => ({
        ...sourceRef,
        paragraphRange: [...sourceRef.paragraphRange] as [number, number]
      })),
      validationIssueIds: [...block.validationIssueIds]
    })),
    characterIds: [...scene.characterIds],
    sourceChapterIds: [...scene.sourceChapterIds]
  }));

const initialState = {
  activeView: "editor" as const,
  activeSceneId: sampleWorkspace.draft.scenes[0].id,
  activeBlockId: sampleWorkspace.draft.scenes[0].blocks[0].id,
  autosaveState: "saved" as const,
  draftVersion: sampleWorkspace.draft.version,
  conflictVersion: undefined,
  scenes: cloneScenes(sampleWorkspace.draft.scenes)
};

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  ...initialState,
  setActiveView: (view) => set({ activeView: view }),
  setActiveScene: (sceneId) => set({ activeSceneId: sceneId }),
  setActiveBlock: (blockId) => set({ activeBlockId: blockId }),
  markDirty: () => set({ autosaveState: "dirty" }),
  markSaving: () => set({ autosaveState: "saving" }),
  markSaved: (version) =>
    set((state) => ({
      autosaveState: "saved",
      conflictVersion: undefined,
      draftVersion: version ?? state.draftVersion
    })),
  markConflict: (serverVersion) =>
    set({ autosaveState: "conflict", conflictVersion: serverVersion }),
  setDraftVersion: (version) => set({ draftVersion: version }),
  replaceScenes: (scenes) => set({ scenes }),
  moveScene: (activeId, overId) =>
    set((state) => ({
      scenes: reorderScenes(state.scenes, activeId, overId),
      autosaveState: activeId === overId ? state.autosaveState : "dirty"
    })),
  nextBlockId: (baseBlockId, suffix) =>
    createUniqueBlockId(get().scenes, baseBlockId, suffix),
  reset: () =>
    set({
      ...initialState,
      scenes: cloneScenes(sampleWorkspace.draft.scenes)
    })
}));
