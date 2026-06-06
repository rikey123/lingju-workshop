import { describe, expect, it } from "vitest";

import {
  SCREENPLAY_BLOCK_TYPES,
  convertBlock,
  createUniqueBlockId,
  insertBlockAfter,
  mergeBlockWithNext,
  splitBlockAt
} from "./screenplay";
import { sampleDraft } from "./sample-data";

describe("screenplay contract", () => {
  it("keeps the OpenSpec block type list stable", () => {
    expect(SCREENPLAY_BLOCK_TYPES).toEqual([
      "scene_heading",
      "action",
      "character",
      "dialogue",
      "parenthetical",
      "transition",
      "note",
      "beat",
      "separator"
    ]);
  });

  it("inserts a typed block after a target block without changing existing identities", () => {
    const firstScene = sampleDraft.scenes[0];
    const target = firstScene.blocks[0];
    const updated = insertBlockAfter(firstScene, target.id, {
      type: "action",
      text: "Lin Wan folds the old letter into her coat."
    });

    expect(updated.blocks[0].id).toBe(target.id);
    expect(updated.blocks[1]).toMatchObject({
      type: "action",
      text: "Lin Wan folds the old letter into her coat."
    });
    expect(updated.blocks[1].sourceRefs).toEqual(target.sourceRefs);
  });

  it("splits a block and preserves source trace metadata on both parts", () => {
    const firstScene = sampleDraft.scenes[0];
    const action = firstScene.blocks.find((block) => block.type === "action");

    if (!action) {
      throw new Error("sample data must include an action block");
    }

    const updated = splitBlockAt(firstScene, action.id, 21);
    const splitParts = updated.blocks.filter((block) => block.id.startsWith(action.id));

    expect(splitParts).toHaveLength(2);
    expect(splitParts[0].sourceRefs).toEqual(action.sourceRefs);
    expect(splitParts[1].sourceRefs).toEqual(action.sourceRefs);
  });

  it("converts a block type only when explicitly requested", () => {
    const firstScene = sampleDraft.scenes[0];
    const note = firstScene.blocks.find((block) => block.type === "note");

    if (!note) {
      throw new Error("sample data must include a note block");
    }

    const updated = convertBlock(firstScene, note.id, "beat");
    const converted = updated.blocks.find((block) => block.id === note.id);

    expect(converted).toMatchObject({
      id: note.id,
      type: "beat",
      text: note.text
    });
  });

  it("creates unique local block IDs for repeated inserts", () => {
    const firstScene = sampleDraft.scenes[0];
    const firstId = createUniqueBlockId(sampleDraft.scenes, "block_001", "cmd_action");
    const updated = insertBlockAfter(firstScene, "block_001", {
      id: firstId,
      type: "action",
      text: "新增动作"
    });
    const secondId = createUniqueBlockId(
      [{ ...firstScene, blocks: updated.blocks }, ...sampleDraft.scenes.slice(1)],
      "block_001",
      "cmd_action"
    );

    expect(firstId).toBe("block_001_cmd_action_1");
    expect(secondId).toBe("block_001_cmd_action_2");
  });

  it("merges a block with the next block while preserving source trace metadata", () => {
    const firstScene = sampleDraft.scenes[0];
    const merged = mergeBlockWithNext(firstScene, "block_002");

    expect(merged.blocks.some((block) => block.id === "block_002")).toBe(false);
    expect(merged.blocks.some((block) => block.id === "block_003")).toBe(false);
    expect(merged.blocks.find((block) => block.id === "block_002_merged")).toMatchObject({
      type: "action",
      provenance: "user"
    });
    expect(merged.blocks.find((block) => block.id === "block_002_merged")?.sourceRefs).toHaveLength(2);
  });
});
