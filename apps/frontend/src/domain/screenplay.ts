import {
  type Scene,
  type ScreenplayBlockType,
  type ScriptBlock,
  screenplayBlockTypes
} from "./contracts";

export const SCREENPLAY_BLOCK_TYPES = [...screenplayBlockTypes];

type NewBlockInput = {
  type: ScreenplayBlockType;
  text: string;
  speakerId?: string;
  parenthetical?: string;
};

export function insertBlockAfter(scene: Scene, targetBlockId: string, input: NewBlockInput): Scene {
  const targetIndex = scene.blocks.findIndex((block) => block.id === targetBlockId);

  if (targetIndex < 0) {
    return scene;
  }

  const target = scene.blocks[targetIndex];
  const inserted: ScriptBlock = {
    id: `${targetBlockId}_after_${input.type}`,
    version: 1,
    type: input.type,
    text: input.text,
    speakerId: input.speakerId,
    parenthetical: input.parenthetical,
    sourceRefs: [...target.sourceRefs],
    provenance: "user",
    validationIssueIds: []
  };

  return {
    ...scene,
    blocks: [
      ...scene.blocks.slice(0, targetIndex + 1),
      inserted,
      ...scene.blocks.slice(targetIndex + 1)
    ]
  };
}

export function splitBlockAt(scene: Scene, blockId: string, offset: number): Scene {
  return {
    ...scene,
    blocks: scene.blocks.flatMap((block) => {
      if (block.id !== blockId) {
        return [block];
      }

      const boundedOffset = Math.max(0, Math.min(offset, block.text.length));
      const firstText = block.text.slice(0, boundedOffset).trimEnd();
      const secondText = block.text.slice(boundedOffset).trimStart();

      return [
        {
          ...block,
          id: `${block.id}_part_1`,
          text: firstText
        },
        {
          ...block,
          id: `${block.id}_part_2`,
          version: 1,
          text: secondText,
          provenance: "user"
        }
      ];
    })
  };
}

export function convertBlock(scene: Scene, blockId: string, type: ScreenplayBlockType): Scene {
  return {
    ...scene,
    blocks: scene.blocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            type
          }
        : block
    )
  };
}

export function updateBlockText(scene: Scene, blockId: string, text: string): Scene {
  return {
    ...scene,
    blocks: scene.blocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            text,
            version: block.version + 1,
            provenance: "user"
          }
        : block
    )
  };
}

export function reorderScenes<T extends { id: string }>(
  scenes: T[],
  activeId: string,
  overId: string
): T[] {
  const from = scenes.findIndex((scene) => scene.id === activeId);
  const to = scenes.findIndex((scene) => scene.id === overId);

  if (from < 0 || to < 0 || from === to) {
    return scenes;
  }

  const next = [...scenes];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
