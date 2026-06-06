import { describe, expect, it } from "vitest";

import { sampleDraft } from "@/domain/sample-data";

import {
  createScreenplayBlockDocument,
  readScreenplayBlockFromDocument,
  screenplayNode
} from "./screenplay-node";

describe("screenplayNode", () => {
  it("allows every OpenSpec screenplay block type as node attributes", () => {
    const attrs = screenplayNode.config.addAttributes?.();

    expect(attrs?.blockType.default).toBe("action");
    expect(attrs?.blockType.validate).toBeTypeOf("function");
    expect(attrs?.blockType.validate("scene_heading")).toBe(true);
    expect(attrs?.blockType.validate("dialogue")).toBe(true);
    expect(attrs?.blockType.validate("unknown")).toBe(false);
  });

  it("serializes screenplay block identity, type, and source trace into TipTap JSON", () => {
    const block = sampleDraft.scenes[1].blocks[3];
    const document = createScreenplayBlockDocument(block);

    expect(document).toMatchObject({
      type: "doc",
      content: [
        {
          type: "screenplayBlock",
          attrs: {
            blockId: block.id,
            blockType: block.type,
            sourceRef: block.sourceRefs[0],
            sourceRefs: block.sourceRefs
          }
        }
      ]
    });
  });

  it("reads edited text from TipTap JSON without dropping block metadata", () => {
    const block = sampleDraft.scenes[1].blocks[3];
    const document = createScreenplayBlockDocument(block);
    const editedDocument = {
      ...document,
      content: [
        {
          ...document.content?.[0],
          content: [{ type: "text", text: "林晚，你真的回来了？" }]
        }
      ]
    };

    const updated = readScreenplayBlockFromDocument(editedDocument, block);

    expect(updated).toMatchObject({
      id: block.id,
      type: block.type,
      speakerId: block.speakerId,
      sourceRefs: block.sourceRefs,
      text: "林晚，你真的回来了？"
    });
  });
});
