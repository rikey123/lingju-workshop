import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { useWorkspaceStore } from "@/state/workspace-store";

import { WorkspacePage } from "./workspace-page";

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("WorkspacePage", () => {
  beforeEach(() => {
    useWorkspaceStore.getState().reset();
  });

  it("renders the project workspace with editor, source, quality, and export signals", () => {
    renderWithProviders(<WorkspacePage />);

    expect(screen.getByRole("heading", { name: "青山旧梦" })).toBeInTheDocument();
    expect(screen.getByText("外景 青山县车站外 夜晚")).toBeInTheDocument();
    expect(screen.getByText("第一章 归来")).toBeInTheDocument();
    expect(screen.getByText("Score 88")).toBeInTheDocument();
    expect(screen.getByText("YAML Valid")).toBeInTheDocument();
  });

  it("switches workspace views without losing draft context", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    await user.click(screen.getByRole("tab", { name: "图谱" }));

    expect(screen.getByText("父亲旧案")).toBeInTheDocument();
    expect(screen.getByText("林晚")).toBeInTheDocument();
    expect(screen.getByText("老宅脚步声")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "导出" }));

    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("DOCX")).toBeInTheDocument();
    expect(screen.getByText("source-trace sidecar")).toBeInTheDocument();
  });

  it("opens quality view and exposes validation issues tied to scenes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    await user.click(screen.getByRole("tab", { name: "质量" }));

    expect(screen.getByText("SCENE_DENSITY_HIGH")).toBeInTheDocument();
    expect(screen.getByText("第三场线索、动作和惊吓集中在同一段。")).toBeInTheDocument();
  });

  it("autosaves a screenplay edit and exports YAML from the current local draft", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    const block = await screen.findByLabelText("action block_002");
    await user.click(block);
    await user.type(block, "她把伞压低，避开路灯。");

    expect(screen.getByText("dirty")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        useWorkspaceStore
          .getState()
          .scenes.flatMap((scene) => scene.blocks)
          .find((item) => item.id === "block_002")?.text
      ).toContain("她把伞压低，避开路灯。")
    );

    expect(await screen.findByText("saved")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "导出" }));

    expect(screen.getByText(/她把伞压低，避开路灯。/)).toBeInTheDocument();
  }, 10000);

  it("shows reload and merge actions when autosave receives a version conflict", async () => {
    const user = userEvent.setup();
    useWorkspaceStore.getState().setDraftVersion(6);
    renderWithProviders(<WorkspacePage />);

    const block = await screen.findByLabelText("dialogue block_008");
    await user.click(block);
    await user.type(block, "但信里提到了你。");

    expect(await screen.findByText("conflict")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload server v7" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep local merge draft" })).toBeInTheDocument();
  }, 10000);

  it("command palette performs typed actions and closes after selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    await user.click(screen.getByRole("button", { name: "cmdk" }));
    await user.click(screen.getByText("Insert action block"));

    await waitFor(() =>
      expect(screen.queryByRole("textbox", { name: /command/i })).not.toBeInTheDocument()
    );
    expect(screen.getByLabelText("action block_001_cmd_action_1")).toBeInTheDocument();
    expect(screen.getByText("dirty")).toBeInTheDocument();
  });

  it("command palette creates unique block IDs on repeated insertions", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    await user.click(screen.getByRole("button", { name: "cmdk" }));
    await user.click(screen.getByText("Insert action block"));
    await user.click(screen.getByRole("button", { name: "cmdk" }));
    await user.click(screen.getByText("Insert action block"));

    const blockIds = useWorkspaceStore
      .getState()
      .scenes.flatMap((scene) => scene.blocks)
      .map((block) => block.id);

    expect(new Set(blockIds).size).toBe(blockIds.length);
    expect(blockIds).toEqual(expect.arrayContaining(["block_001_cmd_action_1", "block_001_cmd_action_2"]));
  });

  it("toolbar split and merge actions mutate the active block and mark the draft dirty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    await user.click(screen.getByLabelText("action block_002"));
    await user.click(screen.getByRole("button", { name: "Split" }));

    expect(useWorkspaceStore.getState().autosaveState).toBe("dirty");
    expect(screen.getByLabelText("action block_002_part_1")).toBeInTheDocument();
    expect(screen.getByLabelText("action block_002_part_2")).toBeInTheDocument();

    await user.click(screen.getByLabelText("action block_002_part_1"));
    await user.click(screen.getByRole("button", { name: "Merge" }));

    const sceneBlocks = useWorkspaceStore.getState().scenes[0].blocks;
    expect(sceneBlocks.some((block) => block.id === "block_002_part_1_merged")).toBe(true);
    expect(sceneBlocks.some((block) => block.id === "block_002_part_2")).toBe(false);
  });

  it("filters entities and navigates from character/location cards back to source context", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WorkspacePage />);

    await user.click(screen.getByRole("tab", { name: "人物" }));
    await user.type(screen.getByRole("searchbox", { name: "Search entities" }), "医院");

    expect(screen.getByText("县医院走廊")).toBeInTheDocument();
    expect(screen.queryByText("青山县车站外")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open location 县医院走廊" }));

    expect(useWorkspaceStore.getState()).toMatchObject({
      activeView: "editor",
      activeSceneId: "scene_002",
      activeBlockId: "block_004"
    });
    expect(screen.getByText("内景 县医院走廊 夜晚")).toBeInTheDocument();
  });
});
