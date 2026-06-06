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
    expect(screen.getByLabelText("action block_001_cmd_action")).toBeInTheDocument();
    expect(screen.getByText("dirty")).toBeInTheDocument();
  });
});
