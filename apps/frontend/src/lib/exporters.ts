import YAML from "yaml";

import type { Workspace } from "@/domain/contracts";

export function toScreenplayYaml(workspace: Workspace) {
  const characterNameById = new Map(
    workspace.characters.map((character) => [character.id, character.name])
  );

  return YAML.stringify({
    script: {
      metadata: {
        title: workspace.project.title,
        version: `${workspace.draft.version}`,
        language: "zh-CN",
        output_format: "screenplay",
        generated_by: "ScriptMind",
        schema_version: "1.0"
      },
      source: {
        type: "novel",
        chapter_count: workspace.project.chapterCount,
        title: workspace.project.sourceTitle
      },
      characters: workspace.characters,
      acts: ["act_01", "act_02"].map((actId) => ({
        act_id: actId,
        scenes: workspace.draft.scenes
          .filter((scene) => scene.actId === actId)
          .map((scene) => ({
            scene_id: scene.id,
            title: scene.title,
            source_chapters: scene.sourceChapterIds,
            location: scene.location,
            time: scene.timeOfDay,
            atmosphere: scene.atmosphere,
            purpose: scene.purpose,
            conflict_level: scene.conflictLevel,
            characters: scene.characterIds,
            emotional_curve: scene.emotionalCurve,
            beats: scene.blocks.map((block) => ({
              beat_id: block.id,
              type: block.type,
              speaker: block.speakerId ? characterNameById.get(block.speakerId) : undefined,
              parenthetical: block.parenthetical,
              content: block.text,
              source_trace: block.sourceRefs[0]
            })),
            camera_suggestion: scene.cameraSuggestions
          }))
      })),
      quality: {
        overall_score: workspace.quality.overallScore,
        dimensions: workspace.quality.dimensions
      }
    }
  });
}
