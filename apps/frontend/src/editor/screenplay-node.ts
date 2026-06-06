import { Node } from "@tiptap/core";
import type { JSONContent } from "@tiptap/react";

import {
  screenplayBlockTypes,
  type ScreenplayBlockType,
  type ScriptBlock,
  type SourceReference
} from "@/domain/contracts";

export type ScreenplayBlockDocument = JSONContent & {
  type: "doc";
  content: Array<
    JSONContent & {
      type: "screenplayBlock";
      attrs: {
        blockId: string;
        blockType: ScreenplayBlockType;
        sourceRef: SourceReference | null;
        sourceRefs: SourceReference[];
      };
    }
  >;
};

function textContent(text: string): JSONContent[] {
  return text.length > 0 ? [{ type: "text", text }] : [];
}

function readText(content: JSONContent[] | undefined): string {
  return (
    content
      ?.map((node) => node.text ?? readText(node.content))
      .filter(Boolean)
      .join("") ?? ""
  );
}

export function createScreenplayBlockDocument(block: ScriptBlock): ScreenplayBlockDocument {
  return {
    type: "doc",
    content: [
      {
        type: "screenplayBlock",
        attrs: {
          blockId: block.id,
          blockType: block.type,
          sourceRef: block.sourceRefs[0] ?? null,
          sourceRefs: block.sourceRefs
        },
        content: textContent(block.text)
      }
    ]
  };
}

export function readScreenplayBlockFromDocument(
  document: JSONContent,
  fallback: ScriptBlock
): ScriptBlock {
  const node = document.content?.find((item) => item.type === "screenplayBlock");
  const attrs = node?.attrs as
    | {
        blockId?: string;
        blockType?: ScreenplayBlockType;
        sourceRefs?: SourceReference[];
      }
    | undefined;
  const documentText = readText(document.content);
  const nodeText = readText(node?.content);

  return {
    ...fallback,
    id: attrs?.blockId ?? fallback.id,
    type:
      attrs?.blockType && screenplayBlockTypes.includes(attrs.blockType)
        ? attrs.blockType
        : fallback.type,
    text: documentText || nodeText,
    sourceRefs: attrs?.sourceRefs ?? fallback.sourceRefs
  };
}

export const screenplayNode = Node.create({
  name: "screenplayBlock",
  group: "block",
  content: "inline*",
  defining: true,
  addAttributes() {
    return {
      blockId: {
        default: null
      },
      blockType: {
        default: "action",
        validate: (value: unknown) =>
          typeof value === "string" &&
          screenplayBlockTypes.includes(value as ScreenplayBlockType)
      },
      sourceRef: {
        default: null
      },
      sourceRefs: {
        default: []
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "section[data-screenplay-block]"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "section",
      {
        ...HTMLAttributes,
        "data-screenplay-block": "true",
        "data-block-type": HTMLAttributes.blockType
      },
      0
    ];
  }
});
