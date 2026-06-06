export const screenplayBlockTypes = [
  "scene_heading",
  "action",
  "character",
  "dialogue",
  "parenthetical",
  "transition",
  "note",
  "beat",
  "separator"
] as const;

export type ScreenplayBlockType = (typeof screenplayBlockTypes)[number];

export type JobState =
  | "queued"
  | "running"
  | "waiting_review"
  | "succeeded"
  | "failed"
  | "canceled";

export type ExportFormat = "yaml" | "fountain" | "pdf" | "docx" | "fdx";

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiEnvelope<TData, TMeta = Record<string, unknown>> = {
  data: TData | null;
  meta: TMeta;
  error: ApiError | null;
};

export type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
  sort?: string;
};

export type SourceReference = {
  chapterId: string;
  paragraphRange: [number, number];
  adaptationType: "direct" | "compressed" | "merged" | "invented" | "moved" | "rewrite";
};

export type ValidationIssue = {
  id: string;
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  suggestion?: string;
  sceneId?: string;
  blockId?: string;
  field?: string;
};

export type ScriptBlock = {
  id: string;
  version: number;
  type: ScreenplayBlockType;
  text: string;
  speakerId?: string;
  parenthetical?: string;
  sourceRefs: SourceReference[];
  provenance: "ai" | "user" | "import" | "restore";
  validationIssueIds: string[];
};

export type Scene = {
  id: string;
  version: number;
  actId: string;
  title: string;
  heading: string;
  location: string;
  timeOfDay: string;
  atmosphere: string;
  purpose: string;
  conflictLevel: number;
  durationEstimateMinutes: number;
  characterIds: string[];
  sourceChapterIds: string[];
  status: "draft" | "reviewing" | "validated" | "needs_revision";
  emotionalCurve: {
    start: string;
    end: string;
  };
  cameraSuggestions: Array<{
    shotType: string;
    target: string;
    description: string;
  }>;
  blocks: ScriptBlock[];
};

export type Character = {
  id: string;
  name: string;
  role: "protagonist" | "supporting" | "antagonist" | "minor";
  description: string;
  traits: string[];
  goals: string[];
  appearances: string[];
  relationships: Array<{
    characterId: string;
    label: string;
  }>;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  sceneIds: string[];
  sourceRefs: SourceReference[];
};

export type StoryThread = {
  id: string;
  title: string;
  status: "open" | "developing" | "resolved";
  sceneIds: string[];
  sourceRefs: SourceReference[];
};

export type Draft = {
  id: string;
  version: number;
  projectId: string;
  title: string;
  status: "active" | "locked" | "archived";
  scenes: Scene[];
};

export type Project = {
  id: string;
  version: number;
  title: string;
  sourceTitle: string;
  chapterCount: number;
  activeDraftId: string;
  updatedAt: string;
};

export type GenerationJob = {
  id: string;
  state: JobState;
  stage: string;
  progress: number;
  outputRefs: string[];
};

export type ExportJob = {
  id: string;
  draftId: string;
  format: ExportFormat;
  state: JobState;
  progress: number;
  validationStatus: "valid" | "warning" | "error";
  artifactUrl?: string;
  manifestUrl?: string;
};

export type ExportRequest = {
  id: string;
  draftId: string;
  formats: ExportFormat[];
  status: JobState;
  createdAt: string;
};

export type Asset = {
  id: string;
  name: string;
  fileType: string;
  sizeLabel: string;
  source: string;
  draftId?: string;
  jobId?: string;
  url: string;
};

export type Revision = {
  id: string;
  label: string;
  createdAt: string;
  author: string;
  summary: string;
  changedBlockIds: string[];
};

export type QualityDimension = {
  key: string;
  label: string;
  score: number;
  comment: string;
};

export type QualityReport = {
  overallScore: number;
  dimensions: QualityDimension[];
  metrics: {
    pageCount: number;
    sceneCount: number;
    beatCount: number;
    dialogueBlocks: number;
    actionBlocks: number;
    locationCount: number;
  };
  issues: ValidationIssue[];
};

export type NovelChapter = {
  id: string;
  title: string;
  paragraphs: Array<{
    id: string;
    index: number;
    text: string;
  }>;
};

export type Workspace = {
  project: Project;
  draft: Draft;
  chapters: NovelChapter[];
  characters: Character[];
  locations: Location[];
  storyThreads: StoryThread[];
  generationJobs: GenerationJob[];
  exportJobs: ExportJob[];
  assets: Asset[];
  revisions: Revision[];
  quality: QualityReport;
  validationIssues: ValidationIssue[];
};
