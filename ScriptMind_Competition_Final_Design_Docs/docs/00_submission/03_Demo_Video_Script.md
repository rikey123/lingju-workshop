# Demo 视频脚本

## 视频时长建议

3-5 分钟。

## 视频结构

### 0:00 - 0:30 项目介绍

大家好，我们的作品是 ScriptMind，一个基于多智能体与剧情图谱的小说自动影视化改编平台。它面向小说作者、短剧创作者和编剧，解决小说改编剧本门槛高、周期长、格式不统一的问题。

### 0:30 - 1:10 输入小说

展示 Gradio 演示界面输入区。将 `examples/input/novel_sample.md` 粘贴到输入框，点击"开始转换"。说明系统支持至少 3 个章节的小说文本，会自动识别章节标题、正文段落、人物名称、地点和主要事件。

### 1:10 - 2:00 AI 分析过程

展示解析结果区输出内容：

- 识别到的人物列表
- 地点列表
- 关键事件列表

说明系统在生成剧本前，先构建 Story Graph（人物/事件/地点图结构）和 Character Memory（角色记忆），保证长篇剧情一致性，不是简单摘要。

### 2:00 - 3:00 YAML 剧本输出

展示生成的 YAML 剧本，包括：

- metadata
- characters
- acts
- scenes
- beats
- dialogue
- action
- narration
- camera_suggestion
- source_trace

强调输出是结构化、可编辑、可追溯的剧本初稿。

### 3:00 - 3:50 质量评估

展示 Reviewer Agent 生成的评分：

- 剧情连贯性
- 人物一致性
- 对白自然度
- 场景转场合理性

并展示修改建议。

### 3:50 - 4:30 技术架构

展示架构图：

Novel Parser Agent → Story Graph Builder → Character Memory Engine → Script Planner Agent → Dialogue Agent → Reviewer Agent → YAML Exporter

### 4:30 - 5:00 总结

总结项目亮点：

1. 多智能体协同创作；
2. 剧情图谱保证长篇一致性；
3. YAML Schema 标准化输出；
4. 支持后续分镜、短剧和漫画扩展；
5. 可用于小说作者快速获得剧本初稿。
