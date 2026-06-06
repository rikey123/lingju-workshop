## Why

很多小说作者希望把已有作品快速改编成可编辑、可追溯、可导出的剧本初稿，但现有工具要么停留在文本摘要，要么只覆盖单一格式编辑，无法把“小说理解、剧本生成、结构化编辑、校验、导出、版本管理”放在同一条闭环里。现在需要一套面向真实创作流程的平台，让作者从 3 章以上小说直接进入可继续打磨的剧本工作台。

## What Changes

- 建立一套完整的小说转剧本平台，覆盖导入、解析、生成、编辑、校验、导出、版本管理全流程。
- **BREAKING**：主存储从“纯 YAML 文档”改为“structured JSON document + relational metadata”，YAML 仅作为交换/交付格式。
- 引入 Next.js + HeroUI + TipTap 的前端工作台，用于结构化剧本编辑、场景/角色视图、拖拽排序和命令式编辑。
- 引入 FastAPI + LangGraph 的后端编排层，负责长链路 AI 工作流、小说解析、剧情图谱、角色记忆、质量检查和异步任务管理。
- 保留 SQLite 本地/开发模式，同时按 PostgreSQL 方案设计正式 schema。
- 建立明确的前后端契约，包括统一数据模型、API envelope、任务状态、校验错误和导出结果格式。
- 引入 Fountain、PDF、DOCX、FDX 的导入/导出与校验链路，使编辑主格式与交付格式解耦，并确保 FDX 与 PDF/DOCX/YAML 同版交付。
- 引入项目、草稿、场景、ScriptBlock、角色、地点、故事线、修订、生成任务、导出任务等核心实体。
- 形成两人可并行推进的开发边界：一人负责前端工作台与交互，一人负责后端模型、AI 流程、导出与 API。

## Capabilities

### New Capabilities
- `platform-contracts`: 定义前后端共享的数据模型、API 契约、任务状态、错误模型和版本策略。
- `project-workspace`: 定义项目创建、小说导入、草稿管理、修订历史、资产管理和工作区状态。
- `novel-ingestion-story-model`: 定义小说章节解析、人物/地点/事件抽取、Story Graph、Character Memory 和来源追踪。
- `screenplay-editor-workbench`: 定义结构化剧本编辑、场景卡片、大纲视图、角色视图、命令面板、拖拽与编辑行为。
- `ai-orchestration-generation`: 定义基于 LangGraph 的大纲生成、场景扩写、对白润色、一致性检查和质量评估工作流。
- `export-import-validation`: 定义 Fountain/FDX/JSON/YAML 导入导出、PDF/DOCX 渲染、Schema 校验和 round-trip 验证。

### Modified Capabilities
- None

## Impact

- 新增 Next.js 前端应用、TipTap 剧本节点 schema、HeroUI 组件层、Zustand 状态层和客户端校验逻辑。
- 新增 FastAPI 服务、Pydantic v2 DTO、SQLAlchemy 2 ORM、Alembic 迁移、Redis + ARQ 任务队列和 LangGraph 编排。
- 新增数据库表和对象存储路径，用于项目、草稿、角色、场景、修订、任务和导出文件。
- 新增 Fountain / FDX / YAML / PDF / DOCX 的转换、校验和测试流水线。
- 新增前后端契约测试、生成链路测试、导出 round-trip 测试和端到端 Playwright 测试。
- 新增模型 provider 适配层和结构化日志/可观测性基础设施。
- 保留 SQLite 开发模式，减少本地联调和离线开发成本。
