import type {
  ExportFormat,
  ExportRequest,
  Scene,
  ValidationIssue
} from "./contracts";

export type SceneFilter = {
  act?: string;
  characterId?: string;
  query?: string;
};

export function filterScenes(scenes: Scene[], filter: SceneFilter): Scene[] {
  const query = filter.query?.trim().toLocaleLowerCase();

  return scenes.filter((scene) => {
    const matchesAct = filter.act ? scene.actId === filter.act : true;
    const matchesCharacter = filter.characterId
      ? scene.characterIds.includes(filter.characterId)
      : true;
    const matchesQuery = query
      ? [scene.title, scene.location, scene.purpose, scene.atmosphere]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)
      : true;

    return matchesAct && matchesCharacter && matchesQuery;
  });
}

export function createExportRequest(
  draftId: string,
  formats: ExportFormat[]
): ExportRequest {
  return {
    id: `export_request_${draftId}_${formats.join("_")}`,
    draftId,
    formats,
    status: "queued",
    createdAt: new Date("2026-06-07T02:00:00.000Z").toISOString()
  };
}

export function getValidationSummary(issues: ValidationIssue[]) {
  return {
    errorCount: issues.filter((issue) => issue.severity === "error").length,
    warningCount: issues.filter((issue) => issue.severity === "warning").length,
    infoCount: issues.filter((issue) => issue.severity === "info").length,
    blockIds: issues.flatMap((issue) => (issue.blockId ? [issue.blockId] : [])),
    sceneIds: issues.flatMap((issue) => (issue.sceneId ? [issue.sceneId] : []))
  };
}

export function countBlocksByType(scenes: Scene[]) {
  return scenes
    .flatMap((scene) => scene.blocks)
    .reduce<Record<string, number>>((acc, block) => {
      acc[block.type] = (acc[block.type] ?? 0) + 1;
      return acc;
    }, {});
}
