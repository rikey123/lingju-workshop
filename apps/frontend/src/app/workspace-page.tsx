"use client";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Download,
  GitBranch,
  History,
  ListTree,
  PanelRight,
  PenLine,
  Search,
  Sparkles,
  Users
} from "lucide-react";
import { Command } from "cmdk";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Tabs } from "@heroui/react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { getWorkspace, patchDraft } from "@/lib/api-client";
import { toScreenplayYaml } from "@/lib/exporters";
import {
  type Draft,
  type ExportFormat,
  type Scene,
  type ScriptBlock,
  type Workspace
} from "@/domain/contracts";
import { sampleWorkspace } from "@/domain/sample-data";
import { countBlocksByType, filterScenes } from "@/domain/workspace";
import { insertBlockAfter, reorderScenes, splitBlockAt } from "@/domain/screenplay";
import { useWorkspaceStore, type WorkspaceView } from "@/state/workspace-store";
import {
  createScreenplayBlockDocument,
  readScreenplayBlockFromDocument,
  screenplayNode
} from "@/editor/screenplay-node";

const importSchema = z.object({
  title: z.string().min(1),
  source: z.string().min(40)
});

const views: Array<{
  id: WorkspaceView;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: "editor", label: "剧本", icon: PenLine },
  { id: "outline", label: "大纲", icon: ListTree },
  { id: "characters", label: "人物", icon: Users },
  { id: "graph", label: "图谱", icon: GitBranch },
  { id: "quality", label: "质量", icon: CheckCircle2 },
  { id: "export", label: "导出", icon: Download },
  { id: "history", label: "历史", icon: History }
];

const exportFormats: ExportFormat[] = ["yaml", "fountain", "pdf", "docx", "fdx"];

export function WorkspacePage() {
  const { data } = useQuery({
    queryKey: ["workspace", sampleWorkspace.project.id],
    queryFn: getWorkspace,
    initialData: {
      data: sampleWorkspace,
      meta: {},
      error: null
    }
  });
  const workspace = data.data ?? sampleWorkspace;
  const store = useWorkspaceStore();
  const scenes = store.scenes;
  const currentWorkspace = useMemo(
    () => ({
      ...workspace,
      draft: {
        ...workspace.draft,
        version: store.draftVersion,
        scenes
      }
    }),
    [scenes, store.draftVersion, workspace]
  );
  const activeScene = scenes.find((scene) => scene.id === store.activeSceneId) ?? scenes[0];
  const activeBlock = activeScene.blocks.find((block) => block.id === store.activeBlockId);
  const blockCounts = useMemo(() => countBlocksByType(scenes), [scenes]);
  const saveMutation = useMutation({
    mutationFn: (draft: Draft) => patchDraft(draft),
    onSuccess: (response) => {
      if (response.error?.code === "VERSION_CONFLICT") {
        const serverVersion = Number(response.error.details?.serverVersion ?? response.meta.version);
        store.markConflict(serverVersion);
        return;
      }

      if (response.data) {
        store.markSaved(response.data.version);
      }
    },
    onError: () => {
      store.markConflict(store.draftVersion);
    }
  });

  useEffect(() => {
    if (store.autosaveState !== "dirty") {
      return;
    }

    const timer = window.setTimeout(() => {
      store.markSaving();
      saveMutation.mutate(currentWorkspace.draft);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [currentWorkspace.draft, saveMutation, store]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="m-0 text-sm text-[color:var(--muted)]">ScriptMind Workshop</p>
          <h1 className="m-0 text-3xl leading-tight">{workspace.project.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <StatusPill label="YAML Valid" tone="ok" />
          <StatusPill label={`Score ${currentWorkspace.quality.overallScore}`} tone="ok" />
          <StatusPill label={`${currentWorkspace.project.chapterCount} chapters`} tone="neutral" />
          <StatusPill label={store.autosaveState} tone={store.autosaveState === "conflict" ? "bad" : "neutral"} />
        </div>
      </header>

      <Tabs
        selectedKey={store.activeView}
        onSelectionChange={(key) => store.setActiveView(key as WorkspaceView)}
        className="mb-3"
        aria-label="workspace views"
      >
        <Tabs.List aria-label="workspace views">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <Tabs.Tab key={view.id} id={view.id}>
                <span className="inline-flex items-center gap-2">
                  <Icon size={16} />
                  {view.label}
                </span>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs>

      {store.activeView === "editor" ? (
        <section className="workspace-frame">
          <SourcePanel workspace={currentWorkspace} activeBlock={activeBlock} />
          <EditorPanel workspace={currentWorkspace} scenes={scenes} activeScene={activeScene} />
          <AssistantPanel workspace={currentWorkspace} activeScene={activeScene} blockCounts={blockCounts} />
        </section>
      ) : (
        <section className="panel">
          <div className="panel-header">
            <h2 className="m-0 text-xl">{views.find((view) => view.id === store.activeView)?.label}</h2>
          </div>
          <div className="panel-body">
            {store.activeView === "outline" && <OutlineView scenes={scenes} />}
            {store.activeView === "characters" && <CharactersView workspace={currentWorkspace} />}
            {store.activeView === "graph" && <GraphView workspace={currentWorkspace} />}
            {store.activeView === "quality" && <QualityView workspace={currentWorkspace} />}
            {store.activeView === "export" && <ExportView workspace={currentWorkspace} />}
            {store.activeView === "history" && <HistoryView workspace={currentWorkspace} />}
          </div>
        </section>
      )}

      <CommandPalette workspace={currentWorkspace} />
    </main>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "ok" | "neutral" | "bad" }) {
  const color =
    tone === "ok"
      ? "color-mix(in oklch, var(--accent) 18%, white)"
      : tone === "bad"
        ? "color-mix(in oklch, var(--danger) 15%, white)"
        : "white";
  return (
    <span className="border px-2 py-1" style={{ background: color, borderColor: "var(--line)" }}>
      {label}
    </span>
  );
}

function SourcePanel({
  workspace,
  activeBlock
}: {
  workspace: Workspace;
  activeBlock?: ScriptBlock;
}) {
  const activeRef = activeBlock?.sourceRefs[0];
  return (
    <aside className="panel">
      <div className="panel-header flex items-center justify-between">
        <h2 className="m-0 flex items-center gap-2 text-lg">
          <BookOpen size={18} />
          原文
        </h2>
        <span className="text-sm text-[color:var(--muted)]">{workspace.project.chapterCount} 章</span>
      </div>
      <div className="panel-body">
        <ImportBox />
        {workspace.chapters.map((chapter) => (
          <section key={chapter.id} className="mb-5">
            <h3 className="mb-2 text-base">{chapter.title}</h3>
            {chapter.paragraphs.map((paragraph) => {
              const highlighted =
                activeRef?.chapterId === chapter.id &&
                paragraph.index >= activeRef.paragraphRange[0] &&
                paragraph.index <= activeRef.paragraphRange[1];
              return (
                <p
                  key={paragraph.id}
                  className="source-paragraph"
                  data-highlighted={highlighted}
                >
                  {paragraph.index}. {paragraph.text}
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </aside>
  );
}

function ImportBox() {
  const form = useForm({
    resolver: zodResolver(importSchema),
    defaultValues: {
      title: "青山旧梦",
      source: sampleWorkspace.chapters
        .map(
          (chapter) =>
            `${chapter.title}\n${chapter.paragraphs.map((paragraph) => paragraph.text).join("\n")}`
        )
        .join("\n\n")
    }
  });
  const chapterCount = (form.watch("source").match(/第.+章/g) ?? []).length;

  return (
    <form className="mb-5 border border-[color:var(--line)] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <strong>导入草稿</strong>
        <StatusPill label={chapterCount >= 3 ? "3+ chapters" : "blocked"} tone={chapterCount >= 3 ? "ok" : "bad"} />
      </div>
      <input className="mb-2 w-full border border-[color:var(--line)] px-2 py-1" {...form.register("title")} />
      <textarea
        className="h-20 w-full resize-none border border-[color:var(--line)] px-2 py-1 text-sm"
        {...form.register("source")}
      />
    </form>
  );
}

function EditorPanel({
  workspace,
  scenes,
  activeScene
}: {
  workspace: Workspace;
  scenes: Scene[];
  activeScene: Scene;
}) {
  const store = useWorkspaceStore();

  return (
    <section className="script-page">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm text-[color:var(--muted)]">{workspace.draft.title}</p>
          <h2 className="m-0 text-2xl">中文分场剧本</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Split</Button>
          <Button variant="secondary">Merge</Button>
          <Button
            variant="primary"
            className="border border-[color:var(--accent)] bg-white px-3 py-2"
            onPress={() => store.markSaved(store.draftVersion)}
          >
            Autosave
          </Button>
        </div>
      </div>
      {store.autosaveState === "conflict" ? (
        <div className="mb-5 border border-[color:var(--danger)] bg-white p-3 text-sm">
          <strong>版本冲突</strong>
          <p className="my-2 text-[color:var(--muted)]">
            服务端已有 v{store.conflictVersion}，本地草稿仍保留，可以重新加载或保留为合并草稿。
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onPress={() => store.reset()}>
              Reload server v{store.conflictVersion}
            </Button>
            <Button variant="primary" onPress={() => store.markSaved(store.conflictVersion)}>
              Keep local merge draft
            </Button>
          </div>
        </div>
      ) : null}
      {scenes.map((scene) => (
        <article key={scene.id} className="mb-8">
          <button
            className="mb-3 border-0 bg-transparent p-0 text-left text-sm text-[color:var(--muted)]"
            onClick={() => store.setActiveScene(scene.id)}
          >
            {scene.title} · {scene.location} · conflict {scene.conflictLevel}
          </button>
          {scene.blocks.map((block) => {
            const issue = workspace.validationIssues.find((item) => item.blockId === block.id);
            return (
              <div
                key={block.id}
                className={`script-block block-${block.type}`}
                data-active={block.id === store.activeBlockId}
                data-issue={Boolean(issue)}
                onClick={() => {
                  store.setActiveScene(scene.id);
                  store.setActiveBlock(block.id);
                }}
              >
                <EditableBlock block={block} scene={scene} />
                {issue ? (
                  <div className="mt-2 flex items-start gap-2 text-sm text-[color:var(--danger)]">
                    <AlertCircle size={15} />
                    <span>{issue.message}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </article>
      ))}
      <p className="text-sm text-[color:var(--muted)]">
        Active scene: {activeScene.title}. Block identity and source trace stay attached during local edits.
      </p>
    </section>
  );
}

function EditableBlock({ block, scene }: { block: ScriptBlock; scene: Scene }) {
  const store = useWorkspaceStore();
  const editor = useEditor({
    extensions: [
      StarterKit,
      screenplayNode,
      Placeholder.configure({
        placeholder: "输入剧本块内容"
      })
    ],
    content: createScreenplayBlockDocument(block),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": `${block.type} ${block.id}`,
        class: "min-h-8 outline-none"
      }
    },
    onUpdate: ({ editor: activeEditor }) => {
      const nextBlock = readScreenplayBlockFromDocument(activeEditor.getJSON(), block);
      const nextScene = {
        ...scene,
        blocks: scene.blocks.map((item) =>
          item.id === block.id
            ? {
                ...nextBlock,
                version: item.version + 1,
                provenance: "user" as const
              }
            : item
        )
      };
      store.replaceScenes(store.scenes.map((item) => (item.id === scene.id ? nextScene : item)));
      store.markDirty();
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const editorBlock = readScreenplayBlockFromDocument(editor.getJSON(), block);
    if (editorBlock.text !== block.text) {
      editor.commands.setContent(createScreenplayBlockDocument(block), {
        emitUpdate: false
      });
    }
  }, [block, editor]);

  return <EditorContent editor={editor} />;
}

function AssistantPanel({
  workspace,
  activeScene,
  blockCounts
}: {
  workspace: Workspace;
  activeScene: Scene;
  blockCounts: Record<string, number>;
}) {
  const characters = workspace.characters.filter((character) =>
    activeScene.characterIds.includes(character.id)
  );
  return (
    <aside className="panel">
      <div className="panel-header">
        <h2 className="m-0 flex items-center gap-2 text-lg">
          <PanelRight size={18} />
          AI 辅助
        </h2>
      </div>
      <div className="panel-body">
        <section className="mb-5">
          <h3 className="mb-2">场景目的</h3>
          <p className="text-[color:var(--muted)]">{activeScene.purpose}</p>
          <div className="metric-bar">
            <span style={{ width: `${activeScene.conflictLevel * 10}%` }} />
          </div>
          <p className="text-sm">
            {activeScene.emotionalCurve.start} → {activeScene.emotionalCurve.end}
          </p>
        </section>

        <section className="mb-5">
          <h3 className="mb-2">人物</h3>
          {characters.map((character) => (
            <div key={character.id} className="scene-card">
              <strong>{character.name}</strong>
              <p className="m-0 text-sm text-[color:var(--muted)]">{character.description}</p>
            </div>
          ))}
        </section>

        <section className="mb-5">
          <h3 className="mb-2">镜头建议</h3>
          {activeScene.cameraSuggestions.map((shot) => (
            <div key={`${shot.shotType}-${shot.target}`} className="scene-card">
              <strong>{shot.shotType}</strong>
              <p className="m-0 text-sm">{shot.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className="mb-2">结构统计</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(blockCounts).map(([type, count]) => (
              <span key={type} className="border border-[color:var(--line)] bg-white p-2">
                {type}: {count}
              </span>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function OutlineView({ scenes }: { scenes: Scene[] }) {
  const store = useWorkspaceStore();
  const [query, setQuery] = useState("");
  const [act, setAct] = useState("");
  const visibleScenes = filterScenes(scenes, { query, act: act || undefined });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    store.replaceScenes(reorderScenes(store.scenes, String(active.id), String(over.id)));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="flex items-center gap-2 border border-[color:var(--line)] bg-white px-2">
          <Search size={16} />
          <input
            className="border-0 py-2 outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select
          className="border border-[color:var(--line)] bg-white px-2"
          value={act}
          onChange={(event) => setAct(event.target.value)}
        >
          <option value="">全部幕</option>
          <option value="act_01">Act 01</option>
          <option value="act_02">Act 02</option>
        </select>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleScenes.map((scene) => scene.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3 md:grid-cols-3">
            {visibleScenes.map((scene) => (
              <SortableSceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        className="mt-4"
        variant="primary"
        onPress={() => {
          const reordered = reorderScenes(store.scenes, "scene_003", "scene_002");
          store.replaceScenes(reordered);
          store.markDirty();
        }}
      >
        dnd-kit reorder preview
      </Button>
    </div>
  );
}

function SortableSceneCard({ scene }: { scene: Scene }) {
  const store = useWorkspaceStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: scene.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="scene-card"
      data-active={scene.id === store.activeSceneId}
      {...attributes}
    >
      <Card.Header>
        <Card.Title>{scene.title}</Card.Title>
        <Card.Description>{scene.location}</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm text-[color:var(--muted)]">
          {scene.sourceChapterIds.join(", ")} · {scene.status}
        </p>
        <div className="metric-bar">
          <span style={{ width: `${scene.conflictLevel * 10}%` }} />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button
          variant="secondary"
          {...listeners}
          onPress={() => {
            store.setActiveScene(scene.id);
            store.setActiveView("editor");
          }}
        >
          打开
        </Button>
      </Card.Footer>
    </Card>
  );
}

function CharactersView({ workspace }: { workspace: Workspace }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {workspace.characters.map((character) => (
        <article key={character.id} className="scene-card">
          <h3>{character.name}</h3>
          <p>{character.description}</p>
          <p className="text-sm text-[color:var(--muted)]">{character.traits.join(" / ")}</p>
          <strong>出场</strong>
          <p>{character.appearances.join(", ")}</p>
        </article>
      ))}
      {workspace.locations.map((location) => (
        <article key={location.id} className="scene-card">
          <h3>{location.name}</h3>
          <p>{location.description}</p>
          <p>{location.sceneIds.join(", ")}</p>
        </article>
      ))}
    </div>
  );
}

function GraphView({ workspace }: { workspace: Workspace }) {
  const nodes = [
    { label: "第一章 归来", x: 4, y: 26 },
    { label: "林晚", x: 27, y: 8 },
    { label: "父亲旧案", x: 51, y: 24 },
    { label: "医院重逢", x: 34, y: 52 },
    { label: "沈亦川", x: 68, y: 48 },
    { label: "老宅脚步声", x: 76, y: 16 }
  ];

  return (
    <div className="graph-board">
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <line x1="14%" y1="34%" x2="34%" y2="18%" stroke="var(--accent)" strokeWidth="2" />
        <line x1="34%" y1="18%" x2="58%" y2="32%" stroke="var(--accent)" strokeWidth="2" />
        <line x1="58%" y1="32%" x2="85%" y2="24%" stroke="var(--accent)" strokeWidth="2" />
        <line x1="43%" y1="60%" x2="76%" y2="56%" stroke="var(--accent-2)" strokeWidth="2" />
      </svg>
      {nodes.map((node) => (
        <div
          key={node.label}
          className="graph-node"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.label}
        </div>
      ))}
      <div className="absolute bottom-4 left-4 border border-[color:var(--line)] bg-white p-3">
        Novel Parser → Story Graph → Character Memory → Script Planner → Dialogue Agent → Reviewer
      </div>
      <p className="absolute bottom-4 right-4 bg-white p-2 text-sm">
        {workspace.storyThreads.length} threads · read-only v1
      </p>
    </div>
  );
}

function QualityView({ workspace }: { workspace: Workspace }) {
  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <section className="scene-card text-center">
        <div className="text-6xl font-black">{workspace.quality.overallScore}</div>
        <p>Overall Score</p>
      </section>
      <section>
        {workspace.quality.dimensions.map((dimension) => (
          <div key={dimension.key} className="mb-4">
            <div className="mb-1 flex justify-between">
              <strong>{dimension.label}</strong>
              <span>{dimension.score}</span>
            </div>
            <div className="metric-bar">
              <span style={{ width: `${dimension.score}%` }} />
            </div>
            <p className="text-sm text-[color:var(--muted)]">{dimension.comment}</p>
          </div>
        ))}
      </section>
      <section className="md:col-span-2">
        {workspace.quality.issues.map((issue) => (
          <article key={issue.id} className="scene-card">
            <strong>{issue.code}</strong>
            <p>{issue.message}</p>
            <p className="text-sm text-[color:var(--muted)]">{issue.suggestion}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function ExportView({ workspace }: { workspace: Workspace }) {
  const yaml = toScreenplayYaml(workspace);

  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      <section>
        {exportFormats.map((format) => (
          <div key={format} className="export-format">
            <strong>{format.toUpperCase()}</strong>
            <span>{format === "yaml" ? "ready" : "tracked job"}</span>
          </div>
        ))}
        <div className="scene-card">
          <strong>source-trace sidecar</strong>
          <p className="text-sm text-[color:var(--muted)]">
            Formats that cannot carry source trace metadata receive a companion manifest.
          </p>
        </div>
      </section>
      <pre className="m-0 max-h-[520px] overflow-auto border border-[color:var(--line)] bg-white p-4 text-sm">
        {yaml}
      </pre>
    </div>
  );
}

function HistoryView({ workspace }: { workspace: Workspace }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {workspace.revisions.map((revision) => (
        <article key={revision.id} className="scene-card">
          <h3>{revision.label}</h3>
          <p>{revision.summary}</p>
          <p className="text-sm text-[color:var(--muted)]">
            {revision.author} · {revision.changedBlockIds.join(", ")}
          </p>
        </article>
      ))}
    </div>
  );
}

function CommandPalette({ workspace }: { workspace: Workspace }) {
  const [open, setOpen] = useState(false);
  const store = useWorkspaceStore();
  const applyToActiveScene = (updater: (scene: Scene) => Scene) => {
    store.replaceScenes(
      store.scenes.map((scene) =>
        scene.id === store.activeSceneId ? updater(scene) : scene
      )
    );
    store.markDirty();
  };
  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        className="inline-flex items-center gap-2 border border-[color:var(--line)] bg-white px-4 py-3"
        onClick={() => setOpen((value) => !value)}
      >
        <Sparkles size={16} />
        cmdk
      </button>
      {open ? (
        <Command className="mt-2 w-[340px] border border-[color:var(--line)] bg-white p-2 shadow-xl">
          <Command.Input
            aria-label="command search"
            className="mb-2 w-full border border-[color:var(--line)] px-2 py-2"
          />
          <Command.List>
            <Command.Item
              onSelect={() =>
                runCommand(() => {
                  applyToActiveScene((scene) =>
                    insertBlockAfter(scene, store.activeBlockId, {
                      id: `${store.activeBlockId}_cmd_action`,
                      type: "action",
                      text: "新增动作：承接当前场景节奏。"
                    })
                  );
                  store.setActiveView("editor");
                })
              }
            >
              Insert action block
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() => {
                  const activeBlock = store.scenes
                    .find((scene) => scene.id === store.activeSceneId)
                    ?.blocks.find((block) => block.id === store.activeBlockId);
                  applyToActiveScene((scene) =>
                    splitBlockAt(scene, store.activeBlockId, Math.ceil((activeBlock?.text.length ?? 0) / 2))
                  );
                  store.setActiveView("editor");
                })
              }
            >
              Split selected block
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => store.setActiveView("quality"))}>
              Open validation marker
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => store.setActiveView("export"))}>
              Export YAML/PDF/DOCX/FDX
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => store.setActiveView("graph"))}>
              Show story graph for {workspace.project.title}
            </Command.Item>
          </Command.List>
        </Command>
      ) : null}
    </div>
  );
}
