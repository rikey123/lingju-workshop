# AI 小说转剧本工具

> 我要开发一个AI 小说转剧本工具
> 很多小说作者希望将自己的作品改编成剧本，请开发一款 AI 辅助剧本创作工具，降低改编门槛，提升效率。
>
> 要求：能将 3 个章节以上的小说文本自动转换为结构化剧本（YAML 格式），让作者可以快速获得可编辑、可进一步打磨的剧本初稿。请额外写一篇文档，定义剧本的 YAML Schema。文档中需说明该 Schema 的设计原因。现在的问题时我不知道标准的剧本都是长什么样子的，还有就是一般的剧本作者希望怎么编辑这个剧本，他们希望这个工具有什么功能

我会先把“标准剧本长什么样、作者怎么改、工具该做什么”拆成产品设计，再给你一份可直接放进 PRD/技术文档的 YAML Schema 文档草稿。

我先确认到一个关键点：影视剧本不是“把小说改成对白”，核心是把叙述拆成场景、动作、人物、对白、转场和可拍摄信息。你们的 YAML 不应该只存文本，还要保留“从小说哪一段改来”的溯源，方便作者回改。

你这个工具的定位建议是：**“小说改编成可编辑剧本初稿的结构化工作台”**，而不是“一键生成最终剧本”。剧本作者最在意的不是 AI 写得多漂亮，而是：**能不能改、能不能追溯原文、能不能控制人物和节奏、能不能导出到常见剧本格式**。

通用影视剧本通常由这些元素组成：**场景标题 / Scene Heading、动作描写 / Action、角色名 / Character、对白 / Dialogue、括号提示 / Parenthetical、转场 / Transition**。Fountain 剧本标记规范也把这些作为基础规则：场景标题通常以 INT./EXT. 开头，角色名大写，对白紧跟角色名，括号提示放在括号中，转场常以 TO: 结尾。 Final Draft 这类专业软件还强调 Beat Board、Outline、Revision Mode、页面锁定、修订颜色等功能，说明专业作者不是线性写完就结束，而是会长期做结构调整、版本管理和协作修订。 WriterDuet 也把实时协作、自动标准格式、修订追踪作为核心能力。

一个标准剧本片段大概长这样：

```text
INT. 老宅客厅 - 夜

雨声拍打窗户。昏黄的吊灯轻轻晃动。

林晚站在门口，手里攥着那封旧信。

                    林晚
          （压低声音）
        你早就知道，对不对？

沈砚没有回答。他把目光移向桌上的照片。

                    沈砚
        我只是比你更早接受了真相。

CUT TO:
```

你们的 YAML 不要只保存“渲染后的文本”，而要保存**结构、来源、人物、场景目的、改编说明、可编辑状态**。这样作者才能继续打磨。

---

## 作者会希望怎么编辑？

他们通常会想做这些事：

1. **按章节改**：先看第 1–3 章生成了哪些场，哪些场被合并、删减、改写。
2. **按场景改**：拖动场景顺序、合并场景、拆分场景、改场景地点和时间。
3. **按人物改**：查看某个角色所有对白，统一口吻、删掉 OOC 的台词。
4. **按原文追溯**：点击剧本某句，知道它来自小说哪一章哪一段。
5. **控制改编尺度**：忠实改编、商业剧节奏、短剧节奏、电影节奏、网剧节奏。
6. **AI 局部重写**：只重写对白、只增强冲突、只把内心独白改成可拍动作。
7. **版本管理**：保留 AI 初稿、作者修改稿、导演修改稿、制片反馈稿。
8. **导出**：YAML、Fountain、Word、PDF，后续可扩展 Final Draft / FDX。

---

## 建议的核心功能

**MVP 必做：**

- 上传 3 个章节以上小说文本。
- 自动识别章节、主要人物、地点、时间线。
- 将小说拆成“可拍摄场景”。
- 每个场景生成：场景标题、人物、动作、对白、转场、改编说明。
- 输出合法 YAML。
- 每个剧本元素保留 `source_refs`，追溯原文。
- 提供 YAML 校验与错误提示。

**V1 增强：**

- 场景卡片视图：拖拽排序、合并、拆分。
- 角色对白视图：按人物筛选所有台词。
- 节奏视图：每场时长、冲突强度、情绪曲线。
- 改编模式：忠实 / 商业剧 / 短剧 / 电影 / 动画。
- AI 指令：重写对白、增强戏剧冲突、减少旁白、增加视觉动作。
- 导出 Fountain，因为 Fountain 本身是纯文本剧本标记格式，适合作为中间导出格式。

---

下面是一份可以直接放进产品/技术文档的 YAML Schema 说明草稿。

:::writing{variant="document" id="48291"}
# AI 小说转剧本工具 YAML Schema 设计文档

## 1. 文档目的

本 Schema 用于描述由小说文本自动改编生成的结构化剧本初稿。它的目标不是直接替代专业编剧，而是帮助小说作者快速获得一个可编辑、可追溯、可继续打磨的剧本基础版本。

该 Schema 需要支持以下核心需求：

1. 输入至少 3 个章节以上的小说文本。
2. 自动生成结构化剧本。
3. 保留小说原文与剧本内容之间的映射关系。
4. 支持作者后续按章节、场景、人物、对白、版本进行编辑。
5. 支持导出为 Fountain、Word、PDF 或其他专业剧本格式。
6. 支持 AI 后续基于结构进行局部重写、补全、检查和优化。

---

## 2. 设计原则

### 2.1 剧本是“场景驱动”的，不是“章节驱动”的

小说通常以章节组织，章节内部可能包含大量心理描写、叙述、回忆和背景说明。剧本则更强调场景、动作、对白和可拍摄内容。

因此 Schema 中保留 `source.chapters`，但剧本主体使用 `scenes` 组织。

### 2.2 每个剧本元素都要能追溯原文

小说作者非常关心 AI 是否“乱改”。因此每个场景、动作、对白、人物设定都应尽量保留 `source_refs`，标记它来自哪一章、哪一段、哪几句原文。

这样作者可以快速判断：

- AI 是否忠实原文；
- 哪些内容是 AI 补写；
- 哪些内容被压缩、合并或改编；
- 后续修改时是否偏离原小说。

### 2.3 剧本内容必须可编辑，而不是一整段纯文本

如果只输出一整段剧本文本，作者很难做结构化修改。因此剧本正文使用 `elements` 数组，每个元素都有明确类型：

- `action`：动作描写
- `dialogue`：对白
- `parenthetical`：括号提示
- `transition`：转场
- `shot`：镜头建议
- `sound`：音效
- `music`：音乐
- `text_on_screen`：屏幕文字
- `note`：作者或 AI 备注

这种设计方便前端做成块级编辑器，也方便 AI 只重写某一类内容。

### 2.4 人物使用 ID，而不是只使用名字

小说中人物可能有本名、昵称、称呼、代号。剧本中如果只用名字，容易混乱。

因此 Schema 使用 `character_id` 作为稳定标识，同时保留 `name` 和 `aliases`。

### 2.5 支持“改编说明”和“AI 信心值”

小说改剧本必然涉及删减、合并、改写和补写。Schema 中加入：

- `adaptation_notes`
- `ai_confidence`
- `status`

用来说明 AI 做了什么，以及作者是否已经确认。

### 2.6 支持多种导出格式

YAML 是中间结构，不一定是最终交付格式。Schema 应支持导出为：

- Fountain
- Word
- PDF
- Final Draft / FDX
- Markdown
- JSON

因此 Schema 不直接绑定某一种排版格式，而是保存更通用的结构化剧本信息。

---

## 3. 顶层结构

```yaml
schema_version: "1.0.0"

project:
  project_id: "string"
  title: "string"
  original_title: "string"
  author: "string"
  adapter: "AI / human / team"
  language: "zh-CN"
  target_format: "film | tv_episode | web_series | short_drama | audio_drama | stage_play"
  genre:
    - "string"
  logline: "string"
  synopsis: "string"
  themes:
    - "string"
  adaptation_mode: "faithful | commercial | short_drama | cinematic | free_adaptation"
  created_at: "YYYY-MM-DDTHH:mm:ssZ"
  updated_at: "YYYY-MM-DDTHH:mm:ssZ"

source:
  source_type: "novel"
  min_chapter_count_required: 3
  chapters:
    - chapter_id: "ch_001"
      index: 1
      title: "string"
      summary: "string"
      word_count: 0
      source_hash: "string"
      paragraphs:
        - paragraph_id: "ch_001_p001"
          index: 1
          text: "string"

characters:
  - character_id: "char_001"
    name: "string"
    aliases:
      - "string"
    role: "protagonist | antagonist | supporting | minor"
    age: "string"
    gender: "string"
    description: "string"
    personality:
      - "string"
    goals:
      - "string"
    conflicts:
      - "string"
    arc: "string"
    voice_profile: "string"
    first_appearance:
      chapter_id: "ch_001"
      paragraph_id: "ch_001_p003"
    relationships:
      - target_character_id: "char_002"
        relationship_type: "string"
        description: "string"

locations:
  - location_id: "loc_001"
    name: "string"
    type: "interior | exterior | mixed | unknown"
    description: "string"
    source_refs:
      - chapter_id: "ch_001"
        paragraph_ids:
          - "ch_001_p010"

structure:
  acts:
    - act_id: "act_001"
      title: "string"
      purpose: "setup | confrontation | climax | resolution"
      summary: "string"
      scene_ids:
        - "sc_001"

  beats:
    - beat_id: "beat_001"
      title: "string"
      description: "string"
      function: "inciting_incident | turning_point | midpoint | climax | resolution | custom"
      related_scene_ids:
        - "sc_001"
      related_character_ids:
        - "char_001"

scenes:
  - scene_id: "sc_001"
    index: 1
    title: "string"
    act_id: "act_001"

    source_refs:
      - chapter_id: "ch_001"
        paragraph_ids:
          - "ch_001_p001"
          - "ch_001_p002"
        adaptation_type: "direct | compressed | merged | invented | moved"

    heading:
      int_ext: "INT | EXT | INT/EXT | UNKNOWN"
      location_id: "loc_001"
      location_name: "string"
      time_of_day: "DAY | NIGHT | MORNING | EVENING | CONTINUOUS | UNKNOWN"
      slugline: "INT. 老宅客厅 - 夜"

    summary: "string"
    dramatic_purpose: "string"
    conflict: "string"
    emotional_turn: "string"
    estimated_duration_seconds: 0

    characters_present:
      - character_id: "char_001"
        name: "string"
      - character_id: "char_002"
        name: "string"

    continuity:
      timeline_position: "string"
      props:
        - "string"
      costumes:
        - "string"
      unresolved_questions:
        - "string"

    elements:
      - element_id: "el_001"
        type: "action"
        text: "string"
        source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p001"
        ai_confidence: 0.92
        status: "ai_generated | human_edited | approved | needs_review"

      - element_id: "el_002"
        type: "dialogue"
        character_id: "char_001"
        character_name: "string"
        parenthetical: "压低声音"
        text: "string"
        emotion: "fear | anger | sadness | joy | neutral | mixed | custom"
        subtext: "string"
        source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p002"
        ai_confidence: 0.86
        status: "ai_generated"

      - element_id: "el_003"
        type: "transition"
        text: "CUT TO:"
        ai_confidence: 0.8
        status: "ai_generated"

    adaptation_notes:
      - note_id: "note_001"
        type: "compression | invention | deletion | dialogue_conversion | visual_conversion | warning"
        text: "string"
        related_source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p005"

    user_notes:
      - note_id: "user_note_001"
        author: "string"
        text: "string"
        created_at: "YYYY-MM-DDTHH:mm:ssZ"

    revision:
      version: 1
      last_modified_by: "AI"
      last_modified_at: "YYYY-MM-DDTHH:mm:ssZ"

continuity_report:
  timeline:
    - event_id: "evt_001"
      description: "string"
      related_scene_ids:
        - "sc_001"
      source_refs:
        - chapter_id: "ch_001"
          paragraph_ids:
            - "ch_001_p001"

  character_consistency:
    - character_id: "char_001"
      warnings:
        - "string"

  plot_holes:
    - issue_id: "issue_001"
      severity: "low | medium | high"
      description: "string"
      related_scene_ids:
        - "sc_001"

exports:
  fountain:
    enabled: true
    last_exported_at: "YYYY-MM-DDTHH:mm:ssZ"
  pdf:
    enabled: true
    last_exported_at: "YYYY-MM-DDTHH:mm:ssZ"
  docx:
    enabled: true
    last_exported_at: "YYYY-MM-DDTHH:mm:ssZ"

validation:
  is_valid: true
  errors:
    - path: "scenes[0].heading.slugline"
      message: "string"
  warnings:
    - path: "scenes[0].elements[1]"
      message: "string"
```

---

## 4. 字段说明

### 4.1 `project`

保存项目基本信息，包括标题、作者、目标格式、类型、主题、改编模式等。

设计原因：

- 同一部小说可以被改编成电影、网剧、短剧、有声剧等不同格式。
- 不同格式对节奏、场景长度、对白密度要求不同。
- `adaptation_mode` 可以指导 AI 生成不同风格的初稿。

---

### 4.2 `source`

保存原小说章节和段落。

设计原因：

- 工具要求至少输入 3 个章节以上，因此需要明确记录章节数量。
- 段落级 ID 可以帮助剧本内容追溯原文。
- `source_hash` 可以判断原文是否被修改，避免旧剧本和新小说版本不一致。

---

### 4.3 `characters`

保存人物表，也可以称为 Story Bible 的一部分。

设计原因：

- 小说人物可能有多个称呼。
- 改编剧本时，需要统一角色名、对白风格、人物目标和人物弧光。
- 后续可以支持“只重写某个角色对白”或“检查人物是否 OOC”。

---

### 4.4 `locations`

保存地点表。

设计原因：

- 剧本是按场景组织的，而场景通常依赖地点。
- 地点表可以帮助合并相似场景，减少拍摄复杂度。
- 后续也可以支持制片预算、场景统计、通告单等扩展功能。

---

### 4.5 `structure`

保存幕、节拍和整体叙事结构。

设计原因：

- 小说章节不一定等于剧本结构。
- 剧本作者常常需要从“故事节拍”角度检查节奏。
- `acts` 和 `beats` 可以支持大纲视图、节奏图和卡片式编辑。

---

### 4.6 `scenes`

剧本主体。每个 scene 是一个可编辑的剧本场景。

设计原因：

- 场景是剧本编辑的基本单位。
- 作者最常见的修改操作包括：重排场景、合并场景、拆分场景、删除场景。
- 每个场景保存 `dramatic_purpose`、`conflict`、`emotional_turn`，方便 AI 和作者判断这一场是否有戏剧功能。

---

### 4.7 `heading`

保存场景标题信息。

示例：

```yaml
heading:
  int_ext: "INT"
  location_name: "老宅客厅"
  time_of_day: "NIGHT"
  slugline: "INT. 老宅客厅 - 夜"
```

设计原因：

- 剧本需要清楚标记场景发生在室内还是室外、什么地点、什么时间。
- `slugline` 用于直接导出剧本。
- `int_ext`、`location_id`、`time_of_day` 用于结构化检索、统计和格式转换。

---

### 4.8 `elements`

保存场景中的具体剧本元素。

常见类型：

```yaml
type: "action"
type: "dialogue"
type: "parenthetical"
type: "transition"
type: "shot"
type: "sound"
type: "music"
type: "text_on_screen"
type: "note"
```

设计原因：

- 剧本不是普通文章，而是由不同功能的文本块组成。
- 分块后，前端可以做成类似专业剧本软件的块编辑器。
- AI 可以只重写动作、只重写对白、只检查转场。
- 导出到 Fountain、PDF、Word 时，也能根据类型应用不同格式。

---

### 4.9 `source_refs`

标记剧本内容来自哪一部分小说。

示例：

```yaml
source_refs:
  - chapter_id: "ch_001"
    paragraph_ids:
      - "ch_001_p003"
      - "ch_001_p004"
    adaptation_type: "compressed"
```

`adaptation_type` 可选值：

- `direct`：基本直接改写
- `compressed`：压缩多个段落
- `merged`：合并多个情节
- `invented`：AI 或作者新增
- `moved`：从其他位置移动
- `deleted`：原文内容被删除，仅在备注中保留

设计原因：

- 小说改剧本不可避免会压缩和重组。
- 作者需要知道每个剧本片段和原文的关系。
- 可以降低 AI 改编的不透明感。

---

### 4.10 `adaptation_notes`

记录 AI 或作者的改编说明。

示例：

```yaml
adaptation_notes:
  - note_id: "note_001"
    type: "dialogue_conversion"
    text: "将原文中的内心独白改写为林晚和沈砚的对话。"
```

设计原因：

- 很多小说内容不能直接拍出来，例如心理描写、背景叙述、作者旁白。
- AI 需要说明自己如何把这些内容变成动作或对白。
- 作者可以据此判断是否接受该改编。

---

### 4.11 `ai_confidence`

表示 AI 对某个元素的生成信心。

示例：

```yaml
ai_confidence: 0.72
```

设计原因：

- 低信心内容可以在界面中标记为“需要人工检查”。
- 对白、人物动机、时间线等容易出错的地方尤其需要信心值。
- 后续可用于自动生成审校任务。

---

### 4.12 `status`

表示内容状态。

可选值：

- `ai_generated`
- `human_edited`
- `approved`
- `needs_review`
- `rejected`

设计原因：

- 剧本初稿通常需要多轮修改。
- 作者需要知道哪些内容已经确认，哪些仍是 AI 草稿。
- 支持团队协作和版本管理。

---

### 4.13 `continuity_report`

保存连续性检查结果。

设计原因：

- 小说长文本改编容易出现人物前后矛盾、时间线冲突、道具消失、关系跳跃等问题。
- 连续性报告可以帮助作者快速定位问题。
- 后续也可扩展成“剧情漏洞检查器”。

---

### 4.14 `exports`

保存导出状态。

设计原因：

- YAML 是中间结构，不一定是最终交付格式。
- 作者可能需要导出给导演、制片、平台、联合编剧。
- 记录导出时间可以避免版本混乱。

---

## 5. 最小可用 YAML 示例

```yaml
schema_version: "1.0.0"

project:
  project_id: "proj_001"
  title: "雨夜旧信"
  original_title: "雨夜旧信"
  author: "原小说作者"
  adapter: "AI"
  language: "zh-CN"
  target_format: "web_series"
  genre:
    - "悬疑"
    - "爱情"
  logline: "一封迟到十年的旧信，让女主发现爱人与家族秘密有关。"
  synopsis: "女主林晚回到老宅整理遗物，意外发现一封旧信，并逐步揭开当年真相。"
  themes:
    - "真相"
    - "背叛"
    - "和解"
  adaptation_mode: "faithful"
  created_at: "2026-06-06T12:00:00Z"
  updated_at: "2026-06-06T12:00:00Z"

source:
  source_type: "novel"
  min_chapter_count_required: 3
  chapters:
    - chapter_id: "ch_001"
      index: 1
      title: "旧宅"
      summary: "林晚回到老宅，发现一封旧信。"
      word_count: 3200
      source_hash: "abc123"
      paragraphs:
        - paragraph_id: "ch_001_p001"
          index: 1
          text: "雨下了一整夜，林晚推开老宅大门。"

characters:
  - character_id: "char_001"
    name: "林晚"
    aliases:
      - "晚晚"
    role: "protagonist"
    age: "28"
    gender: "女"
    description: "冷静但压抑情绪的女主。"
    personality:
      - "克制"
      - "敏感"
    goals:
      - "查清旧信真相"
    conflicts:
      - "既想知道真相，又害怕失去沈砚"
    arc: "从逃避过去到直面真相。"
    voice_profile: "说话简短，情绪越激烈越克制。"
    first_appearance:
      chapter_id: "ch_001"
      paragraph_id: "ch_001_p001"
    relationships:
      - target_character_id: "char_002"
        relationship_type: "恋人"
        description: "彼此相爱，但隐藏秘密。"

  - character_id: "char_002"
    name: "沈砚"
    aliases: []
    role: "supporting"
    age: "30"
    gender: "男"
    description: "温和、隐忍，知道部分真相。"
    personality:
      - "沉稳"
      - "隐忍"
    goals:
      - "保护林晚"
    conflicts:
      - "保护她与告诉她真相之间的矛盾"
    arc: "从隐瞒到坦白。"
    voice_profile: "语气平静，但常常回避正面回答。"
    first_appearance:
      chapter_id: "ch_001"
      paragraph_id: "ch_001_p003"
    relationships:
      - target_character_id: "char_001"
        relationship_type: "恋人"
        description: "深爱林晚，但隐瞒关键事实。"

locations:
  - location_id: "loc_001"
    name: "老宅客厅"
    type: "interior"
    description: "昏暗、潮湿，墙上挂着旧照片。"
    source_refs:
      - chapter_id: "ch_001"
        paragraph_ids:
          - "ch_001_p001"

structure:
  acts:
    - act_id: "act_001"
      title: "发现秘密"
      purpose: "setup"
      summary: "林晚回到老宅，发现旧信。"
      scene_ids:
        - "sc_001"

  beats:
    - beat_id: "beat_001"
      title: "旧信出现"
      description: "女主发现引发故事的关键物件。"
      function: "inciting_incident"
      related_scene_ids:
        - "sc_001"
      related_character_ids:
        - "char_001"

scenes:
  - scene_id: "sc_001"
    index: 1
    title: "雨夜回到老宅"
    act_id: "act_001"

    source_refs:
      - chapter_id: "ch_001"
        paragraph_ids:
          - "ch_001_p001"
          - "ch_001_p002"
        adaptation_type: "compressed"

    heading:
      int_ext: "INT"
      location_id: "loc_001"
      location_name: "老宅客厅"
      time_of_day: "NIGHT"
      slugline: "INT. 老宅客厅 - 夜"

    summary: "林晚回到老宅，在客厅发现一封旧信。"
    dramatic_purpose: "建立悬疑气氛，并引出核心秘密。"
    conflict: "林晚想逃避过去，但旧信迫使她面对真相。"
    emotional_turn: "从疲惫冷静转为震惊不安。"
    estimated_duration_seconds: 120

    characters_present:
      - character_id: "char_001"
        name: "林晚"
      - character_id: "char_002"
        name: "沈砚"

    continuity:
      timeline_position: "故事第一晚"
      props:
        - "旧信"
        - "旧照片"
      costumes:
        - "林晚穿黑色风衣"
      unresolved_questions:
        - "旧信是谁写的？"
        - "沈砚为什么知道旧信存在？"

    elements:
      - element_id: "el_001"
        type: "action"
        text: "雨声拍打窗户。林晚推开老宅大门，昏黄的吊灯在风里轻轻晃动。"
        source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p001"
        ai_confidence: 0.94
        status: "ai_generated"

      - element_id: "el_002"
        type: "action"
        text: "她在积灰的茶几下发现一封泛黄的信，信封上写着她母亲的名字。"
        source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p002"
        ai_confidence: 0.91
        status: "ai_generated"

      - element_id: "el_003"
        type: "dialogue"
        character_id: "char_001"
        character_name: "林晚"
        parenthetical: "压低声音"
        text: "你早就知道，对不对？"
        emotion: "anger"
        subtext: "她已经意识到沈砚隐瞒了真相。"
        source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p002"
        ai_confidence: 0.82
        status: "ai_generated"

      - element_id: "el_004"
        type: "dialogue"
        character_id: "char_002"
        character_name: "沈砚"
        parenthetical: "沉默片刻"
        text: "我只是比你更早接受了真相。"
        emotion: "sadness"
        subtext: "他不愿直接承认自己的隐瞒。"
        source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p003"
        ai_confidence: 0.76
        status: "needs_review"

      - element_id: "el_005"
        type: "transition"
        text: "CUT TO:"
        ai_confidence: 0.8
        status: "ai_generated"

    adaptation_notes:
      - note_id: "note_001"
        type: "dialogue_conversion"
        text: "将原文中的林晚内心质问改写为她对沈砚的直接对白，以增强戏剧冲突。"
        related_source_refs:
          - chapter_id: "ch_001"
            paragraph_ids:
              - "ch_001_p002"

    user_notes: []

    revision:
      version: 1
      last_modified_by: "AI"
      last_modified_at: "2026-06-06T12:00:00Z"

continuity_report:
  timeline:
    - event_id: "evt_001"
      description: "林晚回到老宅并发现旧信。"
      related_scene_ids:
        - "sc_001"
      source_refs:
        - chapter_id: "ch_001"
          paragraph_ids:
            - "ch_001_p001"
            - "ch_001_p002"

  character_consistency:
    - character_id: "char_001"
      warnings: []

  plot_holes:
    - issue_id: "issue_001"
      severity: "medium"
      description: "沈砚为何出现在老宅尚未解释。"
      related_scene_ids:
        - "sc_001"

exports:
  fountain:
    enabled: true
    last_exported_at: null
  pdf:
    enabled: true
    last_exported_at: null
  docx:
    enabled: true
    last_exported_at: null

validation:
  is_valid: true
  errors: []
  warnings:
    - path: "scenes[0].elements[3]"
      message: "该对白为 AI 推断生成，建议作者确认是否符合人物关系。"
```

---

## 6. 推荐校验规则

系统生成 YAML 后，应执行以下校验：

1. `source.chapters` 数量必须大于或等于 3。
2. 每个 `scene` 必须有 `scene_id`、`index`、`heading`、`elements`。
3. 每个 `dialogue` 类型元素必须有 `character_id` 和 `text`。
4. 每个 `character_id` 必须能在 `characters` 中找到。
5. 每个 `location_id` 必须能在 `locations` 中找到。
6. 每个 `source_refs.chapter_id` 必须能在 `source.chapters` 中找到。
7. `ai_confidence` 必须是 0 到 1 之间的小数。
8. `status` 必须来自允许枚举值。
9. 如果元素为 AI 新增内容，`source_refs.adaptation_type` 应标记为 `invented`。
10. 如果某场没有冲突或戏剧目的，应生成 warning。

---

## 7. 推荐 AI 生成流程

### Step 1：章节解析

输入小说后，系统先识别章节标题、章节顺序、段落结构和字数。

输出：

- `source.chapters`
- `source.chapters.paragraphs`

### Step 2：故事信息抽取

抽取人物、地点、关键道具、时间线、人物关系。

输出：

- `characters`
- `locations`
- `continuity_report.timeline`

### Step 3：章节摘要与情节点识别

为每章生成摘要，并识别关键事件、转折点、冲突点。

输出：

- `source.chapters.summary`
- `structure.beats`

### Step 4：小说段落转场景

将小说段落拆分或合并为剧本场景。

输出：

- `scenes`
- `scenes.source_refs`
- `scenes.heading`
- `scenes.summary`

### Step 5：场景内剧本化

将叙述内容改写为动作、对白、转场和备注。

输出：

- `scenes.elements`

### Step 6：连续性检查

检查人物、时间线、道具、关系、动机是否前后矛盾。

输出：

- `continuity_report`
- `validation.warnings`

### Step 7：YAML 校验与导出

系统校验 YAML 是否符合 Schema，并导出为作者需要的格式。

输出：

- YAML
- Fountain
- Word
- PDF

---

## 8. 前端编辑器建议

建议提供以下编辑视图：

1. **剧本视图**：像普通剧本一样阅读和编辑。
2. **YAML 视图**：给高级用户和开发者直接编辑结构。
3. **场景卡片视图**：拖拽调整场景顺序。
4. **章节映射视图**：查看小说章节和剧本场景的对应关系。
5. **人物对白视图**：查看某个角色的所有对白。
6. **改编备注视图**：集中查看 AI 做过的删减、合并、补写。
7. **连续性检查视图**：查看时间线、人物动机和剧情漏洞。
8. **版本对比视图**：比较 AI 初稿和人工修改稿。

---

## 9. 结论

本 Schema 的核心价值在于：它不是把小说简单转换成一段剧本文本，而是把小说改编过程拆解成可编辑、可追溯、可校验、可导出的结构化数据。

对于小说作者来说，它降低了改编门槛；对于编剧来说，它保留了继续创作的空间；对于产品来说，它为后续的 AI 重写、协作编辑、导出、审校和版本管理打下基础。
:::

---

我建议你们的第一版产品目标写成：

> 输入 3 个以上小说章节，AI 自动生成结构化 YAML 剧本初稿。作者可以按场景、人物、对白和原文来源进行编辑，并可导出为常见剧本格式。

这样比“AI 自动写剧本”更准确，也更容易做出用户愿意继续编辑的产品。

-----

> 我要开发一个AI 小说转剧本工具
> 很多小说作者希望将自己的作品改编成剧本，请开发一款 AI 辅助剧本创作工具，降低改编门槛，提升效率。
>
> 要求：能将 3 个章节以上的小说文本自动转换为结构化剧本（YAML 格式），让作者可以快速获得可编辑、可进一步打磨的剧本初稿。请额外写一篇文档，定义剧本的 YAML Schema。文档中需说明该 Schema 的设计原因。现在的问题时我不知道标准的剧本都是长什么样子的，还有就是一般的剧本作者希望怎么编辑这个剧本，他们希望这个工具有什么功能 请你不要直接回答，请搜索相关技术标准与文档以及开源项目，看看有没有什么能够参考的

我会先把可参考的“剧本格式/文件格式标准”“专业编剧软件的编辑模型”“开源项目/库”分开查证，再把它们转化成对你这个 AI 小说转剧本工具的需求启发。

我先不写最终产品方案和 YAML Schema，下面是“可参考资料调研备忘录”。重点是：**剧本到底长什么样、行业格式/文件格式有哪些、编剧希望如何编辑、开源项目能借鉴什么**。

## 1. 标准剧本长什么样：核心不是排版，而是“元素类型”

我查到的专业资料基本都把剧本拆成这些元素：**Scene Heading / Slugline 场景标题、Action 动作/画面描述、Character 角色名、Dialogue 对白、Parenthetical 括注、Transition 转场**。BBC Writers Room 的 screenplay format 示例明确说明：场景标题要包含内/外景、地点、日/夜；动作只写屏幕上能看到的内容，不要写小说式心理活动或背景说明；对白必须由角色名引出。L13-L24 Final Draft 的入门文档也把元素定义为：Scene Heading 是“何时何地”，Action 是“画面上发生什么”，Character 是“谁在说话”，Dialogue 是“说什么”，Parenthetical 是简短说话方式提示。L40-L58

这对你的工具很关键：**AI 不是把小说改成“看起来像剧本的文本”，而是要把小说拆成可编辑的剧本元素序列**。也就是说，YAML 里最好有 `scene.heading`、`scene.elements[]`，每个 element 有 `type: action/dialogue/parenthetical/transition/...`，而不是只给一大段 markdown。

BBC 的格式示例还显示了剧本的页面视觉形态：场景标题大写靠左，动作段落靠左，角色名和对白有专门缩进，括注位于对白区域内。这个可以作为 UI 预览或 PDF 导出参考。

## 2. 小说改剧本最容易踩的坑：小说语言要变成“可拍画面”

BBC 的说明特别强调，动作段落只处理“屏幕上发生的事”，不能写多余的小说式心理、背景、内心独白。L17-L24 Final Draft 也建议动作描述简短、精确，过长的动作段落会拖慢阅读节奏。L251-L258

所以你的 AI 转换流程不能只是“润色为对白”。它至少要做三层判断：

第一，哪些小说文本可以直接转成画面动作。第二，哪些内心活动要改写为可见行为、对白、旁白或删掉。第三，哪些叙述信息需要保留为编剧备注，而不是放进正式剧本文本。

这意味着 YAML Schema 里建议保留 `source_trace` 或 `adaptation_notes`。例如某个动作段来自原文第 2 章第 340-520 字，某段内心独白被改写成角色对白，某些背景信息被放到 notes。否则作者后续打磨时很难追溯“AI 为什么这么改”。

## 3. 现有行业文件格式：Fountain 和 FDX 最值得参考

**Fountain** 是最适合参考的开放文本格式。它是为剧本写作设计的纯文本标记语言，目标是让作者能在任何文本编辑器中写剧本，并保持可读、可移植。Fountain 官方说它是 plain text markup language，适合写作、编辑、分享剧本，并且免费、开源，有开发者库支持。L20-L35 Fountain 的语法把场景标题、角色名、对白、括注、转场等都用简单文本规则识别，比如场景标题以 INT./EXT. 开头，角色名全大写，对白紧跟角色名，括注放在括号里，转场以 `TO:` 结尾。L31-L40

**FDX / Final Draft XML** 是行业互通上最重要的格式之一。Final Draft 相关访谈说明 `.fdx` 是基于 XML 的文本格式，用 XML 描述剧本的格式、内容、属性和元数据；它的优势是可读、可移植，并被很多制作流程和软件集成。L73-L87 这说明你的 YAML 不应成为孤岛，最好设计成中间表示层，然后可以导出 Fountain、FDX、PDF。

一个务实路线是：**YAML 作为 AI 结构化中间格式；Fountain 作为轻量可编辑文本导出；FDX 作为专业软件互通导出；PDF 作为投稿/阅读格式。**

## 4. 编剧希望怎么编辑：元素驱动、快捷输入、版本管理、协作、可视化结构

Final Draft 的入门文档说，它的核心是“Elements”：用户选择元素、输入文本、回车进入下一行，再选择下一个元素；如果用户需要手动对齐，就说明元素使用不对。L23-L29 它还强调 Enter/Tab 的智能切换逻辑：场景标题后自动进入 Action，角色名后自动进入 Dialogue，Action 中按 Tab 可切到 Character，Dialogue 中按 Tab 可切到 Parenthetical。L61-L100

这给你的工具一个很明确的 UI 方向：**作者不应该直接编辑 YAML，而应该在“剧本元素编辑器”中编辑；YAML 是保存与导出的结构层**。作者需要的不是填表，而是像专业编剧软件一样快速改角色名、对白、动作、场景标题，并自动保持格式正确。

现有工具的功能可以拆成几类：

| 需求方向 | 可参考项目/软件 | 对你工具的启发 |
|---|---|---|
| 自动格式化 | Final Draft、Trelby、Beat | 自动识别/切换元素，作者专注内容 |
| 大纲/卡片/时间线 | Beat、Final Draft Beat Board / Outline Editor | 小说转剧本后要能按场景重排、合并、拆分 |
| 版本/修订 | WriterDuet、Final Draft | AI 改写必须可追踪、可回滚、可比较 |
| 协作/评论 | WriterDuet、Arc Studio | 作者、编剧、编辑可以批注与共同修改 |
| 导入导出 | Trelby、Screenplain、scripttool | 支持 Fountain/FDX/PDF，避免格式锁死 |
| 统计报告 | Trelby、afterwriting、Beat | 角色出场、对白占比、场景地点、时长估算 |

Trelby 的功能页列出：正确剧本格式和分页、自动补全、拼写检查、多视图、人物名数据库、场景/地点/角色/对白报告、脚本比较、导入 FDX/Celtx/Fountain/Fade In、导出 PDF/HTML/RTF/FDX/Fountain。L14-L24 Beat 这个开源 Fountain 编辑器则支持极简 UI、智能格式化、折叠列表、索引卡、时间线、场景颜色、过滤、FDX 导入导出、标题页、自动场号、修订管理、角色和场景标题自动补全、统计视图等。L329-L359

## 5. 开源项目清单：建议优先研究这些

**Fountain 官方规范**：最重要的语法参考。它定义了剧本元素如何用纯文本表达，包括 scene heading、action、character、dialogue、parenthetical、dual dialogue、transition、title page、notes、sections、synopses 等。L12-L30

**Screenplain**：Python 项目，可把 Fountain 转为 PDF、HTML、Final Draft FDX；项目 README 强调 plain text 的优势是简单、可用各种软件编辑、适合手机和平板，并能输出行业标准格式。L257-L265

**afterwriting-labs**：JavaScript 项目，可把 Fountain 转 PDF，提取页数、动作/对白时间、地点等基础信息，并做地点分布、页面平衡、对白统计、角色统计等。L336-L346

**scripttool**：Go 项目，支持 FDX、Fountain、Open Screenplay Format、FadeIn 等格式互转，并能把 Fountain 渲染成 JSON。L435-L483

**Trelby**：开源剧本写作软件，适合研究完整桌面编辑器的功能边界：格式化、分页、导入导出、报告、比较、PDF 水印等。L14-L24

**Beat**：开源 macOS/iOS Fountain 编辑器，适合研究现代编剧 UI：大纲、卡片、时间线、场景颜色、统计、修订管理、FDX 互通。L342-L359

**screenplay-tools**：多语言库，提供格式无关的 screenplay 表示，并支持 Fountain 与 Final Draft FDX 的读写；这对设计你自己的 YAML 中间层很有参考价值。L259-L282

## 6. AI 剧本生成/辅助研究：不要端到端一次生成，应该分层生成

DeepMind 的 **Dramatron** 非常值得参考。它不是直接一口气生成完整剧本，而是用层级生成：从 logline 开始，交互式生成角色描述、情节点、地点描述和对白，用来给作者编译、编辑、重写。项目说明还提到，参与研究的编剧更倾向把它用于世界观构建、替代剧情探索、创意生成，而不是让它直接写完整剧本。L245-L256 DeepMind 论文页也强调，长篇创作的难点是语言模型缺乏长程语义一致性，因此采用 prompt chaining 和结构上下文。L135-L136

**Kurosawa** 这篇论文也很贴近你的需求：它把剧本生成任务拆为 plot generation 和 script generation，并构造了 1000 个带标注场景的数据集，标注的四个主要元素是 scene headings、action lines、dialogues、character names。L36-L38 这说明你的 MVP 可以先围绕这四类元素做稳定输出，再扩展括注、转场、旁白、镜头、注释、修订等高级能力。

**MovieParse / MovieCoref** 的研究说明，剧本天然是多场景长文档，包含动作、地点、对白，并存在长距离角色和事件依赖；完整理解剧本需要解析、角色识别、共指消解、动作识别、摘要、属性发现等能力。L36-L38 这对“3 个章节以上小说转剧本”尤其重要：必须有跨章节人物一致性、称谓合并、事件顺序和场景连续性检查。

## 7. 对 YAML Schema 的直接启发

调研后，我认为你的 YAML Schema 不应该只模仿最终剧本格式，而应同时满足三件事：**专业剧本结构、AI 可追溯改编、后续编辑协作**。

建议 Schema 至少包含这些层级：

```yaml
screenplay:
  metadata: {}
  source:
    chapters: []
  characters: []
  locations: []
  structure:
    acts: []
    sequences: []
  scenes:
    - id: sc_001
      heading:
        int_ext: INT
        location: ""
        time_of_day: NIGHT
      source_trace: []
      summary: ""
      characters_present: []
      elements:
        - type: action
          text: ""
        - type: dialogue
          character: ""
          parenthetical: ""
          text: ""
      notes: []
      revision: {}
```

设计原因来自上面的资料：剧本元素要能对应 Fountain/FDX；场景、动作、地点、角色、对白是剧本结构核心；AI 改编需要保留原文追溯；作者编辑需要按场景、角色、对白、动作粒度修改；后续还要支持导出、统计、版本管理和协作。YAML 本身适合作为人类可读的结构化数据格式，而正式校验可以用 JSON Schema 思路做，因为 JSON Schema 官方定义了用来描述和验证数据结构、约束和类型的标准方法。

## 8. 初步结论

你这个工具最好定位为：**小说改编为结构化剧本初稿的 AI 工作台**，而不是“小说一键变最终剧本”。MVP 应该先做到：

输入 3 章以上小说 → 章节解析 → 人物/地点/事件抽取 → 场景切分 → 生成剧本元素 YAML → 可视化剧本编辑器 → 导出 Fountain / PDF，后续再做 FDX。

最值得优先研究的参考路线是：**Fountain 规范 + Final Draft 元素模型 + Trelby/Beat 的编辑体验 + Dramatron 的分层生成思路 + Kurosawa 的四元素标注方式**。

-----

> 如果是做中文小说转剧本呢，请查阅更多的中文相关的资料

我会补充中文语境下的资料：大陆影视剧本/网络文学改编流程、中文剧本格式样例、中文编剧软件/平台，以及可借鉴的中文开源或数据项目。

可以，中文小说转剧本要单独处理。中文剧本生态和英文 screenplay 不完全一样，尤其是**场标写法、对白格式、分集大纲、人物小传、微短剧节奏、投稿/审查材料**这些都更有中文行业特色。

## 中文剧本格式不是一个统一国际标准，而是多套行业惯例

我查到的大陆官方征集/申报文件，通常不会像 Fountain 或 Final Draft 那样细定义每个剧本元素的排版，而是要求“完整剧本架构、中文剧本、Word/PDF、剧名页、梗概、人物小传、分集大纲、版权材料”等。比如国家电影局“夏衍杯”要求参评作品是**中文电影剧本**，有完整电影剧本架构，字数 2.5 万至 5 万字，并要求上传 Word 文档，包含剧名页和 300–500 字梗概；还特别说明小说、散文、电视剧等其他体裁不算电影剧本。 国家广电总局电视剧扶持项目则要求人物小传、分集大纲或故事大纲、编剧阐述、完整剧本等材料，完整剧本由 Word 生成 PDF，内文要有目录、页码、标题加粗，正文字体统一等。

也就是说，**大陆语境下“标准剧本”更多是交付材料标准 + 行业格式习惯**，不是一个像 Fountain 那样公开、统一、机器可解析的剧本文法标准。

不过，我找到了一个非常有参考价值的中文官方格式样例：台湾文化部门的《剧本内文写作参考格式》。它明确给出正文格式：场景标题为“场号 + 内景/外景 + 地点 + 日/夜/晨/昏”，动作描写前用“△”，对白用“角色：对白”。例如“1. 内景 阿强家客厅 夜”，然后用“△”写场景/动态描写，再写“阿强：妳这什么态度？”这类对白。 这个样例很适合拿来作为中文 YAML Schema 的“中文显示层”参考。

## 中文剧本更常见的正文结构

中文影视剧本常见结构可以抽象成：

```text
第1集 第1场  或  1. 内景 阿强家客厅 夜

△客厅里灯光昏暗。阿强坐在沙发上，手里攥着手机。

阿强：你到底想让我怎么办？
阿娇：我不是让你怎么办，我是想知道你有没有在乎过。
```

和英文剧本相比，中文剧本里常见差异是：

中文经常使用**场号**，电视剧/短剧还可能使用**集号-场号**。场标经常写成“场号 / 场景 / 时间 / 内外”，而不一定写成英文式 `INT. LOCATION - NIGHT`。一些中文教程也总结为一场戏首行包含场号、场景、时间、内外。

对白通常是 `角色名：对白`，而不是英文剧本那种角色名单独居中、对白另起缩进。中文官方样例里也是“阿强：……”这种形式。

动作描写可以直接段落写，也可以用“△”标记。台湾格式样例明确使用“△”表示场景/动态描写，并说明对白和动态描写左对齐。

所以你的 YAML 不应该只照搬英文 screenplay 的 `scene_heading/action/character/dialogue`，还要支持中文输出风格，例如 `scene_number`、`episode_number`、`interior_exterior: 内景/外景`、`time_of_day: 日/夜/晨/昏/清晨/傍晚`、`dialogue_style: colon`、`action_marker: △`。

## 中文小说改剧本的核心难点：不是格式，而是“影视化重构”

中文网络文学改影视剧的资料里反复提到一个问题：网络小说篇幅长、支线多、内心独白多，改成剧本必须重塑结构、压缩节奏、视觉化表达。新华社报道中引用北京电影学院文学系副教授何亮的观点：网络文学向影视剧改编往往需要对故事结构进行重塑，把长篇连载文本转化为有视觉冲击力的剧集，并通过分镜和场景切换把内心独白、多线叙事视觉化。

中国日报的行业报道也提到，网络文学改影视最困难的是剧本改编，因为小说可读性强、文字优美，不代表适合影视；影视更强调情节密度和戏剧冲突。 光明网的文章则提醒，不少网文影视改编停留在粗浅视觉转化，把需要阅读体悟的内容直接借人物对白说出来，反而损害影视叙事。

这对你的 AI 工具很重要：**中文小说转剧本不能只做“叙述转对白”**。系统必须区分：

小说原文里的心理活动，是改成动作、眼神、沉默、旁白，还是删去。

大段世界观设定，是放进对白、动作、字幕、旁白，还是放入“编剧备注”。

支线人物和支线剧情，是保留、合并、前置、后置，还是删减。

爽点、反转、冲突，是按长剧节奏处理，还是按短剧/微短剧节奏重排。

## 微短剧是中文市场必须单独支持的剧本类型

如果你的目标用户是中文小说作者，**微短剧/短剧改编**不能忽略。中国作家网一篇微短剧创作经验文章提到，长剧 45 分钟一集通常约 15000 字，10–15 分钟短剧约 3500 字，微短剧 1–2 分钟约 500 字；微短剧要求短小精悍、人物集中、主线清晰、矛盾冲突强，并且大约 60–90 秒就需要一个爆点或亮点。

同一篇文章还提到，竖屏还是横屏会影响剧本创作时对画面呈现的思考，例如群像戏在竖屏画面里容易拥挤，多角色轮流特写会占用时长。

所以中文小说转剧本工具应该支持至少三种目标制式：

| 目标类型 | 对 AI 改编的影响 |
|---|---|
| 电影剧本 | 更重完整三幕/多幕结构、场景调度、人物弧光 |
| 电视剧/网剧 | 更重分集大纲、人物小传、长线悬念、集尾钩子 |
| 微短剧 | 更重高频爆点、强冲突、少人物、少场景、竖屏/横屏标记 |

北京广电局项目申报指南也说明，电视剧、网络剧、网络微短剧等未开拍项目通常需要提交故事大纲、分集梗概、人物小传、完整剧本等材料。 这意味着你的工具不能只输出正文 YAML，还应该输出**人物小传、分集梗概、故事大纲、改编说明**。

## 中文编剧软件/工具功能值得参考

我查到一些中文写作/编剧工具，能反推出中文作者希望怎么编辑剧本。

“写剧本”App 的说明里提到，它支持电影、电视剧、短视频、微短剧等剧本创作，自动匹配中文剧本格式，支持剧本大纲、分集大纲、人物关系，支持 Word 导入导出；还强调能自动识别并标记场号、场景、动作、对话，提示时间、空间、出场人物，并提供角色出场次数、场景快速定位、分场大纲提醒、人物关系图等功能。

“编剧宝”App 说明里提到，它是智能中文剧本创作软件，以 `.juben` 格式为标准，支持模板引擎、一键生成电影/微电影/电视等产品雏形，支持思维导图式大纲设计和角色设计，基于 `.juben` 标记语言写作，并可在 `.juben`、HTML、PDF 间切换。

“壹写作”虽然更偏中长文写作，但它面向小说、剧本、电子书，强调思维导图式大纲设计、角色设计、灵感收集、跨平台同步、离线写作，以及导出 Word/TXT/PDF/HTML。

这些资料说明中文作者实际需要的不是“编辑 YAML”，而是：

能够像写小说一样管理章节、大纲、灵感。

能够像写剧本一样管理场号、场景、动作、对白。

能够一键生成人物小传、分集大纲、人物关系图。

能够导出 Word/PDF，因为中文投稿和申报经常要求 Word/PDF，而不是 Fountain/FDX。turn104643view2

## 中文开源项目可以重点看这些

第一个是 **fountain-zh**。它是一个“用 Fountain 写作中文电影剧本”的尝试，仓库已归档，但 README 明确说它关注如何用 Fountain 和相关软件进行中文电影剧本写作，并提供《小城之春》的 Fountain 源文件和 PDF 示例。

第二个是 **in剧本 / injuben**。它是开源软件，目标是帮助用户用纯文本写 screenplay，并提供在线版本；它的 GitHub topics 包含 Chinese、Fountain、screenplay 等。 这个项目很适合参考“中文剧本纯文本语法”怎么设计。它的 issue 里有人明确讨论 Fountain 与 injuben 的差异：Fountain 是成熟业界标准，但中文使用 Fountain 时，角色名往往要用 `@角色` 这种方式，并不方便，因此有人探索更符合中文习惯的新语法。

第三个是 **Toonflow**。它是一个开源 AI 短剧创作工具，项目说明称可将小说、剧本快速转化为动画短剧，集成 AI 编剧、智能分镜、角色与视频生成，并且是 Electron/Node/TypeScript 方向的跨平台桌面应用。turn736346view0 它更偏“小说/剧本到动画短剧生产”，可以参考项目模块拆分：小说管理、剧本生成、剧本 Agent、制作管理、项目管理等。

第四类是 GitHub 上的 AI 编剧技能/Agent 项目。GitHub screenwriting topic 下有“山音超级编剧大师”，说明覆盖从概念短片到 90 分钟长片、多集剧集，并覆盖人物设计、结构大纲、场景拆解、完整剧本写作流程。 它不一定适合直接作为底层格式参考，但适合参考 AI 工作流：人物 → 大纲 → 场景 → 剧本。

## 对你的 YAML Schema 的新增启发

中文版本的 Schema 应该比英文版多这些字段：

```yaml
format_profile:
  language: zh-CN
  target_type: web_drama        # film | tv_series | web_drama | micro_drama
  script_style: chinese_colon   # chinese_colon | fountain | final_draft_like
  output_medium: horizontal     # horizontal | vertical | audio_drama | stage
  export_targets:
    - yaml
    - word
    - pdf
    - fountain

episode:
  number: 1
  title: ""
  synopsis: ""
  hook: ""              # 集尾钩子，短剧/网剧重要
  estimated_duration: ""

scene:
  episode_number: 1
  scene_number: 3
  heading:
    raw: "1-3 内景 阿强家客厅 夜"
    interior_exterior: 内景
    location: 阿强家客厅
    time_of_day: 夜
  characters_present: []
  source_trace: []
  elements:
    - type: action
      marker: "△"
      text: ""
    - type: dialogue
      character: 阿强
      text: ""
```

我建议中文 Schema 不要只用英文 `INT/EXT`，而是同时保存：

`interior_exterior: 内景/外景`

`int_ext: INT/EXT`

`heading.raw: "1-3 内景 客厅 夜"`

这样可以兼容中文显示、Fountain 导出、FDX/英文格式导出。

## 中文产品定位建议

中文小说转剧本工具更适合定位为：

**“中文小说影视化改编工作台”**，而不是单纯“小说转剧本格式器”。

MVP 应该优先做：

1. 小说章节导入，至少 3 章以上。
2. 自动抽取人物、地点、事件、冲突、爽点。
3. 自动生成故事大纲、人物小传、分集梗概。
4. 按目标类型生成电影/网剧/微短剧剧本 YAML。
5. 支持中文场标、场号、集号、动作、对白、旁白、备注。
6. 提供可视化剧本编辑器，而不是让作者手改 YAML。
7. 支持 Word/PDF 导出，因为中文投稿和项目申报场景非常依赖 Word/PDF。turn104643view2

我的初步判断是：**中文 Schema 不能直接照搬 Fountain 或 Final Draft，而应该以“中文场号分场剧本”为主格式，以 Fountain/FDX/Word/PDF 为导出格式。**

-----

> 有没有最权威最通用最广泛使用的格式，或者现在中国国内的编剧作家最常使用的软件的格式是什么样的，请再仔细搜索，结合多套方案的有点给我一个详细的软件设计稿

我重新查了一轮后，结论比较明确：

**没有一个“中文剧本唯一权威通用格式”**。如果按“权威交付”看，国内最稳的是 **Word / WPS / PDF 文档**；如果按“专业可编辑交换格式”看，国际影视工业最强的是 **Final Draft 的 FDX**；如果按“开放、适合 AI/版本管理/工程化处理”看，最适合参考的是 **Fountain / 纯文本标记**；如果按“中文剧本正文习惯”看，应采用 **场号 + 内/外景 + 地点 + 时间 + 动作 + 角色：对白** 的分场格式。

我没有找到可靠公开数据能证明“国内编剧作家最常用某一款软件”的市场份额，所以不能负责任地说某个软件是中国第一。但从官方征集要求和中文编剧工具公开资料看，**国内交付端仍高度依赖 Word/PDF**；专业工具端则出现了“写剧本”“编剧宝”“有戏”“花生剧本”等中文工具，它们普遍强调 Word 导入导出、中文剧本格式识别、场号/场景/动作/对白结构化、人物关系和分集大纲。夏衍杯要求上传中文电影剧本 Word 文档，并包含剧名页和 300–500 字梗概；广电总局电视剧扶持材料要求人物小传、分集大纲/故事大纲、完整剧本等由 Word 生成 PDF。

台湾文化部门/优良电影剧本征选资料给出了非常清晰的中文剧本正文参考格式：场景标题为“1. 内景/外景 地点 日/夜/晨/昏”，正文包含场景/动态描写和“角色：对白”；新版参考范例也采用“长版剧情大纲、人物介绍、剧本内文”的组织方式。这个不能直接等同于大陆标准，但非常适合作为中文剧本输出样式参考。turn419228view0

国际可交换格式方面，Final Draft 官方称自己是行业标准编剧软件，FDX 是 XML 文本格式，用于描述剧本内容、格式、属性和元数据；WriterDuet 支持导入 Final Draft、PDF、Celtx、Fountain、Word、RTF、JSON 等格式，并建议 WriterDuet 和 Final Draft 在导入导出时最能保持格式。turn480993view1turn480993view2 Fountain 则是开放纯文本剧本标记语言，官方语法覆盖场景标题、动作、角色、对白、括注、双人对白、歌词、转场、标题页、注释等；对非罗马语言角色名，它支持用 `@` 强制识别角色名。

国内中文工具方面，“写剧本”App 公开说明支持电影、电视剧、短视频、微短剧，能自动匹配中文剧本格式，支持大纲、分集大纲、人物关系，Word 导入导出，并自动识别场号、场景、动作、对话。 “编剧宝”公开说明以 `.juben` 格式为标准，支持模板、思维导图式大纲和角色设计，并可在 `.juben`、HTML、PDF 间切换。 “有戏”支持卷、季、集、幕、场的剧本组织结构，支持 Final Draft、Fountain、Fade In、Word 等导入导出，并有传统剧本模式、好莱坞模式、微信聊天模式。 “花生剧本”强调云端协作、专业中文剧本格式、人性化快捷键，以及将剧本格式化、数据化、标签化。

下面是基于这些资料整合出的详细软件设计稿。

:::writing{variant="document" id="83742"}
# AI 中文小说转剧本工具软件设计稿

## 1. 产品定位

产品名称暂定为 **「剧本工坊 AI」**。

本产品是一款面向中文小说作者、编剧、短剧团队和影视开发人员的 AI 辅助剧本创作工具。它的核心目标不是“一键生成最终成片剧本”，而是把 3 个章节以上的中文小说文本自动改编为结构化、可追溯、可编辑、可导出的剧本初稿。

产品默认输出 **中文分场剧本**，并以 **YAML 作为内部结构化数据格式**。作者在界面中编辑的是剧本文本、大纲、人物、场景和对白，而不是直接编辑 YAML。YAML 主要用于 AI 流程、版本管理、结构校验、导入导出和二次开发。

## 2. 核心判断

中文小说转剧本不应直接照搬英文 screenplay 格式。原因是国内交付端更常见 Word/PDF，中文剧本正文更常见“场号、内外景、地点、时间、动作、角色：对白”的分场写法，而国际互通端又需要兼容 FDX 和 Fountain。

因此产品采用四层格式策略：

第一层是 **内部标准格式：YAML / JSON Schema**。用于保存完整结构、AI 追溯、人物地点关系、分集大纲、版本变更和导出所需元数据。

第二层是 **中文编辑格式：中文分场剧本**。这是作者日常看到和编辑的主界面，格式接近：

```text
第1集 第3场 内景 林家客厅 夜

△客厅里只开着一盏落地灯。林晚站在门口，手里攥着湿透的信封。

林晚：你早就知道了，对不对？
顾沉：我知道的时候，已经来不及了。
```

第三层是 **国内交付格式：Word / PDF**。用于投稿、评审、项目申报、制片沟通和打印阅读。

第四层是 **专业互通格式：FDX / Fountain / TXT**。FDX 用于进入国际专业编剧软件和制作流程；Fountain 用于纯文本、版本管理、开发者生态和低成本导入导出。

## 3. 目标用户

### 3.1 小说作者

这类用户已有长篇小说或连载章节，但不了解剧本格式。核心需求是把小说变成可读、可改、能投稿或给制片人看的剧本初稿。

重点功能：

- 小说章节导入。
- 自动识别人物、地点、事件、冲突。
- 自动生成故事梗概、人物小传、分集大纲。
- 自动生成中文分场剧本。
- 保留原文追溯，方便作者核对 AI 改编是否偏离原作。

### 3.2 编剧

这类用户懂剧本，希望 AI 做辅助拆解、初稿、重写和结构检查。

重点功能：

- 场景拆分、合并、重排。
- 对白润色。
- 动作描写影视化。
- 人物弧光检查。
- 场景节奏、冲突强度、集尾钩子分析。
- 版本对比和修订记录。

### 3.3 短剧团队 / 制片开发

这类用户更关心效率、节奏、成本和可拍性。

重点功能：

- 微短剧分集拆解。
- 每集爆点、钩子、反转标记。
- 人物数量和场景数量控制。
- 拍摄地点统计。
- 角色出场统计。
- 分场表、人物表、地点表导出。

## 4. 产品形态

建议先做 Web 版，后续再做桌面版或插件。

MVP 形态：

- Web 应用。
- 支持粘贴文本、上传 TXT/DOCX。
- 输出 YAML、中文剧本文本、Word、PDF。
- 后续支持 FDX、Fountain。

编辑器采用三栏布局：

左侧：原小说章节与 AI 抽取结果。

中间：剧本编辑器。

右侧：人物、场景、备注、改编建议、质量检查。

## 5. 主流程设计

### 5.1 新建项目

用户创建项目时选择：

- 原作类型：长篇小说 / 中篇小说 / 短篇小说 / 网文连载。
- 目标剧本类型：电影 / 电视剧 / 网剧 / 微短剧 / 短视频 / 广播剧。
- 目标语言：简体中文 / 繁体中文。
- 输出格式：中文分场剧本 / 好莱坞式剧本 / 微短剧脚本。
- 改编强度：忠实原著 / 适度改编 / 大幅影视化重构。
- 目标集数或时长。
- 是否保留旁白。
- 是否生成分集大纲、人物小传、编剧阐述。

### 5.2 导入小说

支持三种导入方式：

- 粘贴文本。
- 上传 TXT / DOCX。
- 分章粘贴。

系统要求至少 3 个章节以上。导入后，系统自动执行：

- 章节切分。
- 段落编号。
- 人名识别。
- 地点识别。
- 时间线识别。
- 事件抽取。
- 对话抽取。
- 心理描写识别。
- 叙述视角识别。
- 重复人物称谓合并。

### 5.3 原文分析

AI 先生成“改编资料包”，而不是直接写剧本。

改编资料包包括：

- 故事一句话概念。
- 300–500 字故事梗概。
- 主要人物表。
- 人物关系图。
- 地点表。
- 关键物件表。
- 时间线。
- 主要冲突。
- 爽点/反转/悬念点。
- 不适合直接影视化的小说内容。
- 可转化为动作、对白、旁白或字幕的内容。
- 建议删减或合并的支线。

### 5.4 改编方案生成

系统根据目标类型生成不同方案。

电影模式：

- 生成三幕结构。
- 控制主线集中。
- 生成 30–60 个场景。
- 强调人物弧光和最终高潮。

电视剧 / 网剧模式：

- 生成总大纲。
- 生成分集大纲。
- 标记每集开场钩子和结尾钩子。
- 保留更多支线和人物关系。

微短剧模式：

- 生成高密度分集结构。
- 每集 1–3 分钟。
- 每集必须有冲突、反转或钩子。
- 控制角色和地点数量。
- 标记“爆点”“打脸点”“情绪点”“付费卡点”。

### 5.5 场景拆分

系统把小说章节拆成剧本场景。

每个场景包含：

- 场景 ID。
- 集号。
- 场号。
- 内景/外景。
- 地点。
- 时间。
- 出场人物。
- 场景目的。
- 冲突。
- 情绪变化。
- 原文来源。
- 估算时长。
- 剧本正文元素。

### 5.6 剧本生成

剧本生成不一次性完成，而是按“资料包 → 大纲 → 场景卡 → 分场剧本 → 质量检查 → 人工编辑”的流程完成。

每场生成时要遵守以下原则：

- 小说心理描写优先转化为可见动作。
- 背景设定优先转化为冲突、对白、道具或场景信息。
- 大段解释性对白要被压缩。
- 每场必须有明确目的。
- 每场尽量有情绪变化。
- 动作描写使用现在时、可拍摄、简洁。
- 对白要符合人物身份和关系。
- AI 新增内容必须标记为“改编新增”。
- 删除或合并原文内容必须保留说明。

## 6. 核心编辑器设计

### 6.1 剧本元素编辑器

编辑器不让用户直接手工排版，而是用元素类型驱动。

支持元素类型：

- 场景标题。
- 动作。
- 角色。
- 对白。
- 括注。
- 旁白。
- 转场。
- 字幕。
- 歌词。
- 备注。
- 分集标题。
- 幕标题。
- 分页。
- 空行。

中文默认显示为：

```text
第1集 第3场 内景 林家客厅 夜
△林晚站在门口，雨水顺着发梢滴落。
林晚：你骗了我多久？
顾沉：（沉默片刻）从一开始。
```

系统内部保存为结构化元素：

```yaml
elements:
  - type: action
    text: 林晚站在门口，雨水顺着发梢滴落。
  - type: dialogue
    character: 林晚
    text: 你骗了我多久？
  - type: dialogue
    character: 顾沉
    parenthetical: 沉默片刻
    text: 从一开始。
```

### 6.2 快捷键

编辑器应提供类似专业编剧软件的快捷体验：

- Enter：根据上下文进入下一个常用元素。
- Tab：循环切换元素类型。
- `/`：插入 AI 指令。
- `@`：选择角色。
- `#`：选择场景标签。
- `Ctrl / Cmd + Enter`：生成下一段建议。
- `Ctrl / Cmd + Shift + S`：拆分当前场。
- `Ctrl / Cmd + Shift + M`：合并相邻场。
- `Ctrl / Cmd + Shift + R`：重写当前元素。

### 6.3 AI 辅助编辑

每个场景和每个元素都可以调用 AI 操作。

场景级操作：

- 重写本场。
- 增强冲突。
- 缩短本场。
- 增加悬念。
- 改成微短剧节奏。
- 改成电影剧本节奏。
- 让对白更口语。
- 让动作更可拍。
- 检查是否偏离原文。
- 生成导演提示。
- 生成分镜建议。

对白级操作：

- 更符合角色性格。
- 更克制。
- 更有火药味。
- 更生活化。
- 更古风。
- 更短剧爽感。
- 删除解释性台词。
- 把心理活动改成对白。
- 把对白改成动作。

动作级操作：

- 改成可拍画面。
- 去掉小说腔。
- 压缩到两行内。
- 增加环境氛围。
- 增加人物动作。
- 去掉不可见心理描写。

## 7. YAML Schema 总体设计

YAML 是系统的主数据格式。它不直接等于最终剧本文本，而是一个“剧本工程文件”。

顶层结构：

```yaml
schema_version: "1.0"
project:
  id: "proj_001"
  title: "示例剧名"
  language: "zh-CN"
  target_type: "micro_drama"
  created_at: "2026-06-06"

source:
  type: "novel"
  chapters: []

adaptation:
  strategy: "faithful_with_cinematic_rewrite"
  target_episode_count: 24
  target_duration_per_episode: "2min"
  notes: []

bible:
  logline: ""
  synopsis_short: ""
  synopsis_long: ""
  themes: []
  characters: []
  relationships: []
  locations: []
  objects: []
  timeline: []

deliverables:
  character_bios: []
  episode_outlines: []
  writer_statement: ""
  submission_package: {}

screenplay:
  format_profile: {}
  episodes: []

revision:
  version: 1
  history: []
```

## 8. YAML 关键字段设计

### 8.1 source

保存原文追溯信息。

```yaml
source:
  type: novel
  title: "原小说名"
  author: "作者名"
  chapters:
    - id: ch_001
      title: "第一章 雨夜归人"
      order: 1
      text_hash: "sha256..."
      paragraphs:
        - id: p_001
          text: "雨下了一整夜。"
```

设计原因：

小说改编最怕 AI 胡编。每个剧本场景都必须能追溯到原文片段，方便作者检查、撤销和改写。

### 8.2 bible

保存剧本世界观和人物资料。

```yaml
bible:
  logline: "一个被家族抛弃的少女，在雨夜发现未婚夫隐藏多年的秘密。"
  themes:
    - 信任
    - 复仇
    - 身份反转
  characters:
    - id: char_linwan
      name: 林晚
      aliases: ["晚晚", "林小姐"]
      gender: 女
      age: 24
      role: protagonist
      bio: ""
      goal: ""
      wound: ""
      arc: ""
      speech_style: ""
```

设计原因：

长篇小说常有人物别名、称谓、身份变化。AI 必须统一人物 ID，否则后续对白和出场统计会混乱。

### 8.3 screenplay.episodes

电视剧、网剧、微短剧都需要分集结构。

```yaml
episodes:
  - id: ep_001
    number: 1
    title: "雨夜归来"
    synopsis: ""
    hook_opening: ""
    hook_ending: ""
    estimated_duration: "2min"
    scenes: []
```

设计原因：

中文剧集和短剧开发非常依赖分集大纲。小说转剧本时，先分集再分场，比直接生成长剧本更可控。

### 8.4 scenes

```yaml
scenes:
  - id: sc_001_003
    episode_number: 1
    scene_number: 3
    heading:
      raw: "第1集 第3场 内景 林家客厅 夜"
      interior_exterior: "内景"
      location: "林家客厅"
      time_of_day: "夜"
      int_ext: "INT"
    purpose: "林晚逼问顾沉，揭开第一层秘密"
    conflict: "林晚要真相，顾沉选择隐瞒"
    emotional_turn: "怀疑 -> 愤怒"
    characters_present:
      - char_linwan
      - char_guchen
    source_trace:
      - chapter_id: ch_001
        paragraph_ids: [p_014, p_015, p_016]
        adaptation_type: "rewrite"
    estimated_duration: "45s"
    tags:
      - 质问
      - 秘密
      - 短剧爆点
    elements: []
```

设计原因：

中文剧本一定要保存场号、集号、内外景、地点、时间。FDX/Fountain 导出需要英文式 `INT/EXT`，中文 Word/PDF 导出需要中文式 `内景/外景`，所以两套信息都保留。

### 8.5 elements

```yaml
elements:
  - id: el_001
    type: action
    text: "客厅里只开着一盏落地灯。林晚站在门口，手里攥着湿透的信封。"
    source_trace:
      - chapter_id: ch_001
        paragraph_ids: [p_014]
    ai_generated: true

  - id: el_002
    type: dialogue
    character_id: char_linwan
    character_name: 林晚
    text: "你早就知道了，对不对？"
    parenthetical: ""
    source_trace:
      - chapter_id: ch_001
        paragraph_ids: [p_015]
    ai_generated: true

  - id: el_003
    type: dialogue
    character_id: char_guchen
    character_name: 顾沉
    parenthetical: "沉默片刻"
    text: "我知道的时候，已经来不及了。"
    ai_generated: true
    source_trace:
      - chapter_id: ch_001
        paragraph_ids: [p_016]
```

设计原因：

剧本编辑的最小单位不是段落，而是元素。这样才能实现自动排版、格式校验、对白统计、角色出场统计、FDX/Fountain/Word/PDF 导出。

## 9. 导出格式设计

### 9.1 中文 Word / PDF

这是默认导出格式。

导出模板：

```text
《剧名》

300–500字梗概

人物小传

第1集 分集大纲

剧本正文

第1集 第1场 内景 林家客厅 夜
△客厅里只开着一盏落地灯……
林晚：你早就知道了，对不对？
```

可选模板：

- 电影剧本模板。
- 电视剧剧本模板。
- 微短剧剧本模板。
- 投稿匿名模板。
- 制片阅读模板。
- 分场表模板。

### 9.2 FDX

FDX 作为专业互通格式，用于导入 Final Draft、WriterDuet、Fade In 等工具。

映射规则：

- `scene.heading` → Scene Heading。
- `action` → Action。
- `dialogue.character_name` → Character。
- `dialogue.parenthetical` → Parenthetical。
- `dialogue.text` → Dialogue。
- `transition` → Transition。
- `note` → Script Note。

### 9.3 Fountain

Fountain 作为开放纯文本导出格式。

中文角色名导出时建议使用强制角色标记：

```text
.第1集 第3场 内景 林家客厅 夜

客厅里只开着一盏落地灯。林晚站在门口，手里攥着湿透的信封。

@林晚
你早就知道了，对不对？

@顾沉
（沉默片刻）
我知道的时候，已经来不及了。
```

### 9.4 YAML

YAML 是给高级用户、开发者、AI 工作流和二次处理使用的格式。它必须通过 Schema 校验，确保字段完整、类型正确、场号不重复、人物 ID 可解析。

## 10. AI 改编引擎设计

AI 引擎采用多 Agent / 多阶段流程，而不是单次大模型生成。

### 10.1 章节解析 Agent

输入小说章节，输出：

- 章节摘要。
- 人物。
- 地点。
- 事件。
- 对话。
- 心理描写。
- 冲突点。
- 可影视化片段。
- 不可影视化片段。

### 10.2 人物统一 Agent

负责：

- 合并同一人物的不同称谓。
- 识别人物关系。
- 建立人物 ID。
- 生成初版人物小传。
- 生成角色语言风格。

### 10.3 结构改编 Agent

负责：

- 生成电影/剧集/短剧结构。
- 拆分分集。
- 设计钩子。
- 识别高潮点。
- 压缩或合并支线。
- 判断每集核心冲突。

### 10.4 场景拆分 Agent

负责把小说事件转为剧本场景。

输出：

- 场号。
- 内外景。
- 地点。
- 时间。
- 出场人物。
- 场景目标。
- 冲突。
- 情绪转折。
- 原文追溯。

### 10.5 剧本写作 Agent

负责生成动作和对白。

约束：

- 不写不可拍的心理描写。
- 不写小说式旁白，除非用户选择保留旁白。
- 动作短句化。
- 对白人物化。
- 避免说明书式对白。
- 保留原作关键台词。
- 新增台词标记为 AI 改编新增。

### 10.6 质量检查 Agent

检查：

- 场号是否连续。
- 场景标题是否完整。
- 每场是否有出场人物。
- 对白是否有角色。
- 是否存在未定义角色。
- 是否存在地点突变。
- 是否偏离原作。
- 是否过度旁白。
- 是否解释性对白过多。
- 是否有重复场景。
- 微短剧是否有足够爆点。
- 分集结尾是否有钩子。

## 11. 中文小说改编专项能力

### 11.1 心理描写影视化

小说原文：

```text
林晚忽然觉得自己像个笑话。她这些年的等待，原来只是顾沉手里的一枚棋子。
```

可转为：

```text
△林晚盯着顾沉，眼眶发红。她忽然笑了一下，把手里的戒指摘下来，轻轻放在桌上。
林晚：原来我等了这么多年，只是等你把我推出去。
```

### 11.2 设定压缩

小说里的世界观设定不能整段搬入对白。系统应提供三种处理方式：

- 转成道具信息。
- 转成冲突事件。
- 放入编剧备注。

### 11.3 人物称谓统一

例如：

- “林晚”
- “晚晚”
- “林小姐”
- “她”
- “大小姐”

系统内部统一为 `char_linwan`，显示时根据场景关系使用对应称谓。

### 11.4 网文爽点识别

系统识别并标记：

- 打脸。
- 反转。
- 误会。
- 身份揭露。
- 复仇。
- 追妻/追夫。
- 逆袭。
- 危机救场。
- 付费卡点。

这些标签用于短剧分集和营销型剧本结构。

## 12. 功能模块清单

### 12.1 项目管理

- 新建项目。
- 导入小说。
- 项目模板。
- 目标类型选择。
- 项目版本。
- 项目导出。
- 项目归档。

### 12.2 小说分析

- 章节切分。
- 人物抽取。
- 地点抽取。
- 事件抽取。
- 关系抽取。
- 时间线抽取。
- 对话抽取。
- 主题分析。

### 12.3 改编工作台

- 故事梗概。
- 人物小传。
- 分集大纲。
- 场景卡片。
- 分场剧本。
- 改编备注。
- 原文追溯。

### 12.4 剧本编辑器

- 元素化编辑。
- 中文格式预览。
- 场号自动编号。
- 集号管理。
- 角色自动补全。
- 地点自动补全。
- 快捷键切换元素。
- 场景折叠。
- 大纲导航。
- 批注。
- 修订模式。

### 12.5 AI 辅助

- 生成初稿。
- 重写本场。
- 润色对白。
- 增强冲突。
- 缩短场景。
- 增加短剧爆点。
- 改成电影节奏。
- 改成剧集节奏。
- 检查偏离原文。
- 生成导演提示。
- 生成分镜草案。

### 12.6 统计与报告

- 总字数。
- 预计时长。
- 场景数量。
- 地点数量。
- 角色出场次数。
- 角色对白量。
- 每集爆点数量。
- 每集结尾钩子。
- 场景成本估计。
- 室内/室外比例。
- 日戏/夜戏比例。

### 12.7 导出

- YAML。
- JSON。
- Word。
- PDF。
- TXT。
- Fountain。
- FDX。
- 分集大纲。
- 人物小传。
- 分场表。
- 角色表。
- 地点表。

## 13. MVP 范围

第一版必须完成：

- 导入 3 个章节以上小说。
- 自动抽取人物、地点、事件。
- 生成故事梗概。
- 生成人物小传。
- 生成分集大纲。
- 生成中文分场剧本 YAML。
- 提供可视化剧本编辑器。
- 支持原文追溯。
- 支持导出 Word、PDF、YAML。
- 支持基础质量检查。

第一版暂缓：

- FDX 完整导出。
- 多人实时协作。
- 分镜图生成。
- 视频生成。
- 复杂排期和预算。
- 专业修订蓝页/粉页流程。

## 14. 第二阶段功能

第二阶段增加：

- Fountain 导入导出。
- FDX 导出。
- 多版本对比。
- 评论批注。
- 场景卡片拖拽。
- 人物关系图。
- 微短剧爆点分析。
- 短剧付费卡点设计。
- AI 分镜建议。
- 团队协作。

## 15. 第三阶段功能

第三阶段进入制作前期工具：

- 分镜脚本。
- 拍摄脚本。
- 道具表。
- 服化道标记。
- 场景成本估算。
- 拍摄日程草案。
- 角色通告表。
- 与视频生成工具联动。

## 16. 质量标准

生成的剧本初稿必须满足：

- 场号连续。
- 每场有明确场景标题。
- 每场有地点和时间。
- 对白必须绑定角色。
- 出场角色必须存在于人物表。
- 重要改编必须可追溯原文。
- 不允许大量小说式心理描写直接进入动作段。
- 不允许整段世界观说明塞进对白。
- 每集有明确开端、冲突和结尾。
- 微短剧模式下，每集至少有一个强冲突或强钩子。

## 17. 推荐默认格式

产品默认保存格式：

```text
内部：YAML
编辑：中文分场剧本
交付：Word / PDF
互通：FDX / Fountain
```

默认中文剧本正文格式：

```text
第1集 第1场 内景 地点 夜

△动作描写。

角色名：对白。
角色名：（括注）对白。
```

默认 YAML 文件名：

```text
project.screenplay.yaml
```

默认 Word 文件名：

```text
《剧名》-完整剧本.docx
《剧名》-人物小传.docx
《剧名》-分集大纲.docx
```

默认 PDF 文件名：

```text
《剧名》-完整剧本.pdf
```

## 18. 设计结论

本产品不应把自己做成单纯的“格式转换器”，而应做成中文小说影视化改编工作台。

核心竞争力有四个：

第一，懂中文小说，能处理人物称谓、心理描写、网文爽点、长篇支线。

第二，懂中文剧本，能输出场号、内外景、地点、时间、动作、对白、分集大纲和人物小传。

第三，懂专业互通，能导出 Word/PDF/FDX/Fountain。

第四，懂 AI 协作，能保留原文追溯、改编说明、版本差异和人工可控编辑。

最终目标是让小说作者快速得到一个可编辑、可交付、可继续打磨的中文剧本初稿，而不是让 AI 替作者做不可控的最终创作。
:::

我的建议是：**MVP 不要把 FDX 当主格式，也不要把 Fountain 当主格式。主格式用 YAML，主编辑视图用中文分场剧本，主交付用 Word/PDF，专业互通再导出 FDX/Fountain。** 这样既符合国内交付习惯，又不牺牲工程化和后续专业软件兼容性。

-----

> 这版可以对齐“写剧本”App以及花生剧本”等热门剧本创作工具在剧本创作方面的全部格式与功能吗，如果不能请再进行补充

上一版还没有完全对齐这些中文工具，尤其是“团队协作、标签化/数据化、微信聊天剧本、卷/季/集/幕/场层级、模板市场/范式”等功能缺口。我会按竞品功能矩阵补齐到产品设计里。

结论：**上一版还不能完全对齐**。它已经覆盖了“小说转中文分场剧本 + YAML + Word/PDF + 人物/分集/场景”主干，但还缺少几类中文编剧工具的成熟功能：**协同编辑、数据化/标签化、剧本库检索、跨软件格式迁移、微信聊天模式、卷/季/集/幕/场层级、多大纲视图、行内格式、沉浸写作模式、发布/投稿/交易接口**。

我查到的公开资料里，“写剧本”App 主打电影、电视剧、短视频、微短剧等中文剧本格式，支持剧本大纲、分集大纲、人物关系、Word 导入导出，并自动识别场号、场景、动作、对话，提示时间、空间、出场人物，还提供角色出场次数、场景快速定位、分场大纲提醒和人物关系图导出人物小传等能力。

“花生剧本”更偏在线协作平台，强调云端实时写作、多设备访问、多人同时编辑、浮动头像显示协作者编辑过程、人性化快捷键，以及自动把剧本格式化、数据化、标签化，并提供 1000 多个经典剧本范例供搜索场景、人物和对白。

“有戏/来戏”公开功能更像完整专业编剧软件：支持卷、季、集、幕、场的组织结构；支持电影、电视剧、短视频、小剧场；支持 XScrip、Celtx、Final Draft、Fountain、Fade In、Word、文本、壹写作、壹剧本等 9 种导入/打开格式；支持场景、对白、动作、过渡、分页、换行、歌词、备注、大中小标题、注解等 12 种段落格式；支持传统剧本模式、好莱坞模式、微信聊天模式；支持 PDF、HTML、Word、文本、Celtx、Final Draft、Fade In、Fountain、壹写作、壹剧本等 10 种导出格式。

“编剧宝”则补充了另一个方向：`.juben` 格式、灵感管理、模板引擎、一键生成电影/微电影/电视等产品雏形、主题引擎、思维导图式大纲和角色设计、写作时预览、大纲管理、`.juben/html/pdf` 切换、投稿/发布、敏感词检测、地点记忆、对白体格式、字数统计、作品加密等。

下面是**补充后的软件设计稿 v1.1**，目标是尽量对齐这些中文热门剧本工具，同时保留“AI 小说转剧本”的差异化能力。

---

# AI 中文小说转剧本工具设计稿 v1.1：对齐中文编剧工具版

## 1. 产品定位升级

产品不只是“小说转剧本”，而应升级为：

**AI 中文剧本创作与改编工作台**

它包含三条能力线：

第一条是 **AI 改编线**：小说章节 → 故事资料包 → 人物小传 → 分集大纲 → 分场剧本 → YAML/Word/PDF。

第二条是 **专业编剧线**：中文剧本编辑、场号管理、段落格式、人物关系、分场大纲、统计分析、导入导出、修订协作。

第三条是 **短剧生产线**：微短剧节奏、爆点/钩子/付费卡点、竖屏脚本、分镜草案、角色/场景/道具资产表。

## 2. 格式策略补充

上一版只定义了：

```text
内部：YAML
编辑：中文分场剧本
交付：Word / PDF
互通：FDX / Fountain
```

现在要扩展为：

```text
内部主格式：YAML / JSON
中文编辑格式：中文分场剧本
小说导入格式：TXT / DOCX / 粘贴文本
国内交付格式：DOCX / PDF / HTML / TXT
专业互通格式：FDX / Fountain / Celtx / Fade In
中文工具互通：壹写作 / 壹剧本 / .juben / 自定义导入解析
短剧生产格式：分镜表 / 拍摄脚本 / 角色资产表 / 场景资产表
```

注意：`.juben`、花生剧本内部格式、写剧本 App 原生格式未必有公开规范，所以第一阶段不应承诺“原生无损兼容”。更稳妥的说法是：

**支持公开可解析格式导入导出，并通过 Word/TXT/Fountain/FDX 做最大化迁移兼容。**

## 3. 需要补齐的剧本文档类型

上一版已经有“剧本正文、人物小传、分集大纲”。现在补齐为完整中文编剧项目包：

| 文档类型 | 是否必须 | 说明 |
|---|---:|---|
| 小说原文 | 必须 | 原文章节、段落、追溯 ID |
| 故事梗概 | 必须 | 300 字、500 字、1500 字、3000 字多版本 |
| 一句话故事 | 必须 | 项目 pitch 用 |
| 人物小传 | 必须 | 可从人物关系图导出 |
| 人物关系图 | 必须 | 对齐写剧本/编剧宝/有戏类工具 |
| 分集大纲 | 剧集/短剧必须 | 每集起承转合、结尾钩子 |
| 分场大纲 | 必须 | 每场目的、冲突、人物、地点 |
| 剧本正文 | 必须 | 中文分场剧本 |
| 编剧阐述 | 可选 | 投稿、申报、项目路演 |
| 世界观设定 | 可选 | 玄幻、科幻、架空、悬疑项目需要 |
| 时间线 | 可选 | 多线叙事、悬疑、穿越项目需要 |
| 角色资产表 | 短剧/视频必须 | AI 视频生成或制片管理 |
| 场景资产表 | 短剧/视频必须 | 拍摄/生成成本分析 |
| 道具资产表 | 可选 | 关键道具、线索、商业植入 |
| 分镜草案 | 第二阶段 | 面向 AI 短剧/视频生产 |
| 拍摄脚本 | 第三阶段 | 制作前期使用 |

## 4. 剧本组织结构补充

上一版的结构是：

```text
项目 → 分集 → 场景 → 元素
```

现在要对齐“有戏/来戏”的复杂层级，扩展为：

```text
项目 Project
  ├── 卷 Volume
  ├── 季 Season
  ├── 集 Episode
  ├── 幕 Act
  ├── 场 Scene
  ├── 段落 Element
  └── 行内标记 Inline Mark
```

不同类型使用不同层级：

```text
电影：项目 → 幕 → 场 → 段落
电视剧：项目 → 季 → 集 → 场 → 段落
网剧：项目 → 季/单季 → 集 → 场 → 段落
微短剧：项目 → 集 → 场/节拍 → 段落
短视频：项目 → 场景/镜头 → 台词/动作
小剧场/栏目：项目 → 卷 → 集 → 场
微信聊天剧：项目 → 集 → 聊天消息/旁白/动作
```

YAML 中应增加：

```yaml
structure:
  mode: "series"          # film | series | micro_drama | short_video | chat_drama
  hierarchy:
    - project
    - season
    - episode
    - scene
    - element
```

## 5. 段落格式补充

上一版有：

```text
场景标题、动作、角色、对白、括注、旁白、转场、字幕、备注
```

现在补齐到专业中文工具级别：

| 元素类型 | YAML type | 中文显示示例 |
|---|---|---|
| 场景 | scene_heading | 第1集 第3场 内景 客厅 夜 |
| 动作 | action | △林晚推门而入。 |
| 角色 | character | 林晚 |
| 对白 | dialogue | 林晚：你骗了我。 |
| 括注 | parenthetical | （压低声音） |
| 旁白 | voice_over | 旁白：那一年，雨下了很久。 |
| 独白 | monologue | 林晚：我以为我能忘掉。 |
| 过渡 | transition | 切至： |
| 分页 | page_break | --- page break --- |
| 换行 | line_break | 空行 |
| 歌词 | lyrics | ♪ 我曾经…… |
| 备注 | note | 【编剧注：此处可删】 |
| 注解 | annotation | {{需要核对原文}} |
| 大标题 | heading_large | 第一幕 |
| 中标题 | heading_medium | 第一集 雨夜归来 |
| 小标题 | heading_small | A 线：林晚回家 |
| 微信消息 | chat_message | 林晚：你在哪？ |
| 系统消息 | chat_system | 对方撤回了一条消息 |
| 弹幕/字幕 | subtitle | 字幕：三年前 |
| 镜头提示 | shot_hint | 镜头：特写戒指 |
| 音效 | sfx | 音效：门铃响 |
| 音乐 | music | 音乐：低沉弦乐起 |
| AI 改编备注 | adaptation_note | AI 将心理描写改为动作 |

这意味着 YAML 的 `elements` 不能只支持传统影视剧本，还要支持短视频、聊天剧、音频剧和 AI 分镜生产。

## 6. 行内格式补充

对齐“有戏/来戏”的行内格式，需要支持：

```text
居中、加粗、倾斜、删除线、下划线、翻译、行内备注
```

YAML 设计：

```yaml
text: "林晚盯着那枚戒指，终于笑了。"
inline_marks:
  - range: [0, 2]
    type: "bold"
  - range: [8, 10]
    type: "underline"
  - range: [13, 17]
    type: "inline_note"
    note: "这里表现情绪反转"
```

编辑器中不要让用户直接写标记语言，而是通过工具栏或快捷键添加。

## 7. 编辑模式补充

上一版只有“中文剧本编辑器”。现在要支持至少 5 种模式：

### 7.1 中文传统剧本模式

适合国内电影、电视剧、网剧、微短剧。

```text
第1集 第3场 内景 林家客厅 夜

△客厅昏暗。林晚站在门口。

林晚：你早就知道了？
顾沉：我没有选择。
```

### 7.2 好莱坞模式

适合导出 FDX/Fountain。

```text
INT. LIN FAMILY LIVING ROOM - NIGHT

Lin Wan stands in the doorway.

LIN WAN
You knew all along?
```

中文也可以显示为英文式排版，但内容为中文。

### 7.3 微信聊天模式

适合短视频、互动剧、聊天体小说改编。

```text
【微信聊天】

林晚：你在哪？
顾沉：公司。
系统：林晚发送了一张图片。
林晚：那这是谁？
```

YAML：

```yaml
elements:
  - type: chat_message
    sender: char_linwan
    text: "你在哪？"
  - type: chat_message
    sender: char_guchen
    text: "公司。"
  - type: chat_system
    text: "林晚发送了一张图片。"
```

### 7.4 短视频口播/段子模式

适合主播、电商、短视频脚本。

```text
镜头：主播正面半身
主播：今天这个反转，真的太离谱了。
字幕：丈夫消失三年后，她发现……
```

### 7.5 AI 分镜模式

适合后续视频生成。

```text
镜头1：客厅全景，夜，冷色调
动作：林晚推门而入
台词：你早就知道了？
画面重点：湿透的信封
```

## 8. 大纲与脑图补充

上一版有分集大纲，但没有做到“脑图式管理”。

需要增加：

```text
故事脑图
人物脑图
关系脑图
伏笔脑图
场景脑图
分集脑图
情绪曲线图
冲突强度图
时间线图
```

每个节点都可以绑定：

```yaml
outline_node:
  id: node_001
  type: "plot_point"
  title: "林晚发现信封"
  linked_scenes: [sc_001_003]
  linked_characters: [char_linwan, char_guchen]
  tags: ["反转", "证据", "短剧爆点"]
  status: "draft"
```

用户可以在脑图里拖动节点，系统自动同步调整场景顺序或提示结构冲突。

## 9. 人物关系图补充

对齐“写剧本”App 的人物关系图和“编剧宝/有戏”的角色设计，需要把人物模块升级为：

```text
人物卡
人物关系图
人物弧光
人物台词风格
人物出场统计
人物对白统计
人物关系变化时间线
人物小传导出
```

人物关系 YAML：

```yaml
relationships:
  - id: rel_001
    from: char_linwan
    to: char_guchen
    type: "未婚夫妻"
    status: "破裂"
    episode_range: [1, 12]
    description: "林晚怀疑顾沉背叛自己。"
    visual:
      line_style: "solid"
      color: "red"
```

功能要求：

- 支持拖拽创建关系。
- 支持关系类型自定义。
- 支持关系随集数变化。
- 支持导出图片。
- 支持自动生成人物小传。
- 支持从小说称谓中自动合并人物。

## 10. 数据化/标签化补充

这是上一版最大缺口之一。花生剧本强调格式化、数据化、标签化，所以系统必须把每个剧本元素变成可检索、可统计、可复用的数据。

### 10.1 标签体系

标签分为：

```text
结构标签：开端、转折、高潮、结尾
情绪标签：愤怒、压抑、暧昧、恐惧、爽感
剧情标签：反转、误会、打脸、追妻、复仇、身份揭露
制作标签：夜戏、雨戏、群戏、危险动作、低成本
场景标签：室内、室外、车内、医院、办公室
角色标签：主角、高频角色、反派、工具人
AI 标签：原文改写、AI 新增、需人工确认、偏离原作风险
```

### 10.2 数据统计

必须支持：

```text
总字数
每集字数
每场字数
预计时长
角色出场次数
角色对白字数
场景数量
地点数量
室内/室外比例
日/夜比例
每集爆点数量
每集结尾钩子
旁白占比
动作/对白比例
AI 新增内容比例
原文覆盖率
```

### 10.3 检索

支持搜索：

```text
搜索某个角色所有对白
搜索某个地点所有场景
搜索所有“打脸”片段
搜索所有夜戏
搜索所有 AI 新增内容
搜索所有待确认备注
搜索类似经典场景
```

## 11. 剧本库与范例功能补充

对齐花生剧本的“经典剧本范例搜索”，产品应增加：

```text
剧本范例库
场景范例库
对白范例库
人物关系范例库
微短剧爆点范例库
开场钩子范例库
结尾卡点范例库
```

但要注意版权风险。建议第一阶段只做：

```text
用户自己的项目库
用户授权上传的剧本库
公版/授权范例库
结构模板库，不直接复用受版权保护文本
```

AI 可提供：

```text
“找类似场景结构”
“参考这种冲突类型重写”
“生成同类型但不复刻的场景”
```

## 12. 云端协作补充

上一版缺少花生剧本式协作。需要增加：

```text
多人实时编辑
协作者头像
光标位置显示
评论批注
场景级讨论
元素级评论
修改建议
修订模式
版本历史
权限管理
分享链接
只读/可评论/可编辑权限
```

权限模型：

```yaml
permissions:
  owner: user_001
  collaborators:
    - user_id: user_002
      role: "co_writer"
      permissions:
        - edit_script
        - comment
        - export
    - user_id: user_003
      role: "producer"
      permissions:
        - view
        - comment
```

版本管理：

```yaml
revision:
  version: 12
  branch: "producer_notes_revision"
  changes:
    - id: change_001
      user: user_002
      type: "rewrite_dialogue"
      target_element: el_009
      before: "你骗了我。"
      after: "你从一开始就在骗我。"
      created_at: "2026-06-06T10:30:00Z"
```

## 13. 导入导出补充

对齐热门工具，导入导出要分阶段。

### 第一阶段必须支持

```text
导入：TXT、DOCX、粘贴文本
导出：YAML、JSON、DOCX、PDF、TXT、HTML
```

### 第二阶段支持

```text
导入：Fountain、FDX
导出：Fountain、FDX
```

### 第三阶段支持

```text
导入：Celtx、Fade In、壹写作、壹剧本、.juben 可解析文本
导出：Celtx、Fade In、壹写作、壹剧本兼容文本
```

注意：第三阶段要看目标格式是否公开，不能保证私有格式 100% 无损。

## 14. 输入体验补充

对齐成熟写作工具，编辑器要支持：

```text
自动识别场号
自动识别场景
自动识别动作
自动识别对白
自动识别角色
自动识别时间
自动识别空间
自动识别出场人物
角色自动补全
地点自动补全
场号自动递增
分场大纲提醒
场景快速定位
文字缩放
云端同步指定剧本
```

沉浸写作模式：

```text
禅模式：隐藏侧边栏，只显示编辑区
焦点模式：只高亮当前段落/当前场景
打字机模式：输入行保持在屏幕中心
深色模式
浅色模式
多彩主题
自定义字体大小
```

## 15. 模板系统补充

对齐编剧宝的模板引擎，产品要内置：

```text
电影剧本模板
电视剧剧本模板
网剧剧本模板
微短剧模板
短视频脚本模板
微信聊天剧模板
相声/小品/脱口秀对白体模板
广播剧模板
动画短剧模板
分镜脚本模板
人物小传模板
分集大纲模板
项目申报材料模板
```

模板不仅控制样式，也控制 AI 生成规则。

例如微短剧模板：

```yaml
template:
  type: "micro_drama"
  episode_duration: "1-3min"
  max_characters_per_episode: 4
  max_locations_per_episode: 2
  required_beats:
    - opening_hook
    - conflict
    - reversal
    - cliffhanger
```

## 16. AI 小说改编专项补充

既然竞品多是“写剧本工具”，你的差异化必须是“小说改编能力”。补充这些能力：

```text
章节到分集映射
小说人物称谓合并
内心独白影视化
长叙述压缩
支线合并建议
世界观设定转化
爽点识别
反转识别
付费卡点生成
原文忠实度评分
AI 新增内容标记
删改说明
原文对照视图
```

原文对照视图：

```text
左：小说原文
中：AI 改编剧本
右：改编说明 / 风险提示 / 可替代方案
```

每个场景给出：

```text
来源章节
来源段落
改编方式：保留 / 压缩 / 合并 / 新增 / 删除 / 重排
忠实度评分
影视化评分
冲突强度评分
短剧爆点评分
```

## 17. YAML Schema 需要新增的字段

补充后的顶层结构：

```yaml
schema_version: "1.1"

project:
  id: ""
  title: ""
  subtitle: ""
  language: "zh-CN"
  target_type: "micro_drama"
  edit_mode: "chinese_traditional"
  privacy: "private"

formats:
  internal: ["yaml", "json"]
  import_supported: ["txt", "docx", "fountain", "fdx"]
  export_supported: ["docx", "pdf", "html", "txt", "fountain", "fdx"]

structure:
  mode: "series"
  hierarchy: ["project", "season", "episode", "scene", "element"]

source:
  type: "novel"
  chapters: []

bible:
  logline: ""
  synopsis: {}
  characters: []
  relationships: []
  locations: []
  objects: []
  timeline: []

outlines:
  story_outline: []
  episode_outlines: []
  scene_outlines: []
  mindmap_nodes: []

screenplay:
  volumes: []
  seasons: []
  episodes: []
  scenes: []

assets:
  character_assets: []
  location_assets: []
  prop_assets: []
  costume_assets: []

analytics:
  character_stats: []
  scene_stats: []
  location_stats: []
  tag_stats: []

collaboration:
  collaborators: []
  comments: []
  revision_history: []

export_profiles:
  - name: "中文分场剧本 Word"
  - name: "微短剧 PDF"
  - name: "Fountain"
  - name: "Final Draft FDX"
```

`scene` 新增：

```yaml
scene:
  id: sc_001
  episode_number: 1
  scene_number: 3
  heading:
    raw: "第1集 第3场 内景 林家客厅 夜"
    interior_exterior: "内景"
    location: "林家客厅"
    time_of_day: "夜"
  outline:
    purpose: ""
    conflict: ""
    emotional_turn: ""
    hook: ""
  tags:
    - "反转"
    - "夜戏"
    - "AI新增"
  characters_present: []
  source_trace: []
  elements: []
  production:
    estimated_duration: "45s"
    cost_level: "low"
    shooting_notes: []
```

`element` 新增：

```yaml
element:
  id: el_001
  type: "dialogue"
  character_id: "char_linwan"
  character_name: "林晚"
  text: "你早就知道了，对不对？"
  parenthetical: "压低声音"
  inline_marks: []
  tags: ["质问", "情绪爆发"]
  source_trace: []
  ai:
    generated: true
    adaptation_type: "rewrite"
    confidence: 0.86
    needs_human_review: false
```

## 18. 功能优先级调整

### MVP 必须补齐

```text
中文分场剧本编辑器
场号/场景/动作/对白自动识别
剧本大纲
分集大纲
人物关系图
人物小传导出
角色出场统计
场景快速定位
分场大纲提醒
Word 导入导出
YAML 导出
PDF 导出
原文追溯
AI 小说改编
```

### V1.5 增加

```text
云端同步
多人评论
版本历史
标签化
数据统计面板
场景/人物/对白搜索
模板系统
微信聊天模式
微短剧爆点分析
HTML/TXT 导出
```

### V2 增加

```text
多人实时协作
协作者头像
修订模式
Fountain/FDX 导入导出
Celtx/Fade In 尝试兼容
剧本范例库
脑图式大纲
沉浸写作模式
深色/浅色/多彩主题
```

### V3 增加

```text
AI 分镜
拍摄脚本
角色/场景/道具资产库
短剧视频生成工具对接
投稿/发布接口
团队工作流
私有部署
```

## 19. 对齐结论

如果目标只是“小说转 YAML 剧本初稿”，上一版够用。

如果目标是对齐“写剧本 App、花生剧本、有戏、编剧宝”这些中文剧本创作工具，上一版还不够，需要补齐：

```text
1. 多剧本文体：电影、电视剧、短视频、微短剧、微信聊天剧、小品/脱口秀。
2. 多层级结构：卷、季、集、幕、场。
3. 多段落格式：场景、对白、动作、过渡、分页、歌词、备注、标题、注解。
4. 多导入导出：Word、PDF、HTML、TXT、Fountain、FDX、Celtx、Fade In、壹写作、壹剧本。
5. 数据化标签化：人物、场景、对白、标签、统计、搜索。
6. 人物关系图：可视化、可导出人物小传。
7. 分场大纲提醒：每场目的、冲突、人物、地点、时长。
8. 云端协作：多人编辑、评论、修订、版本。
9. 模板引擎：电影、剧集、短剧、聊天剧、对话体。
10. AI 改编特有能力：原文追溯、忠实度、影视化、短剧爆点。
```

最终推荐的产品口径是：

**“对齐中文专业剧本工具的创作体验，以 AI 小说改编为核心差异化，以 YAML 为结构化底层，以 Word/PDF 为国内交付主格式，以 FDX/Fountain 为专业互通格式。”**

-----

> 云端协作可以先不需要

可以，**云端协作先砍掉是合理的**。对你的产品来说，第一阶段核心不是多人写作，而是：

**中文小说 → AI 结构化改编 → 可编辑中文剧本 → YAML Schema → Word/PDF 导出。**

所以设计稿可以调整为 **单人创作 / 本地项目 / 可导出交付** 优先。

---

# 设计稿 v1.2：去掉云端协作后的版本

## 1. 第一阶段产品定位

产品定位调整为：

**AI 中文小说转剧本创作工具**

核心目标：

让中文小说作者上传或粘贴 3 章以上小说文本后，自动获得：

1. 故事梗概；
2. 人物小传；
3. 人物关系；
4. 分集大纲；
5. 分场大纲；
6. 中文分场剧本；
7. 结构化 YAML；
8. Word / PDF 可交付文件。

第一阶段不做多人协作、不做实时同步、不做团队权限。

---

## 2. 暂时移除的功能

这些功能可以从 MVP 中删除：

```text
多人实时编辑
协作者头像
协作者光标
团队权限
分享链接
多人评论
场景级讨论
元素级讨论
云端同步
团队工作区
制片人审阅模式
```

但建议不要删除全部“修订能力”。

可以保留单人版的：

```text
本地版本历史
撤销 / 重做
AI 改写前后对比
原文与剧本对照
导出前检查
批注 / 备注
待确认标记
```

这些不属于云端协作，但对 AI 改编非常重要。

---

## 3. MVP 功能重新排序

### MVP 必做

```text
小说导入
章节解析
人物抽取
地点抽取
事件抽取
人物关系生成
故事梗概生成
人物小传生成
分集大纲生成
分场大纲生成
中文分场剧本生成
YAML Schema 输出
中文剧本编辑器
Word 导出
PDF 导出
TXT 导出
原文追溯
AI 改编说明
剧本格式校验
```

### MVP 可做但不强依赖

```text
人物关系图
角色出场统计
对白统计
场景统计
标签系统
微短剧爆点分析
场景快速定位
分场卡片拖拽排序
```

### MVP 暂不做

```text
云端协作
多人实时编辑
FDX 完整导入导出
Celtx / Fade In 兼容
剧本范例库
投稿平台
AI 分镜
视频生成
拍摄排期
预算管理
```

---

## 4. 产品结构调整

原来是偏“在线协作剧本平台”，现在改成：

```text
项目管理
  └── 小说项目

小说分析
  ├── 章节
  ├── 人物
  ├── 地点
  ├── 事件
  └── 时间线

改编工作台
  ├── 故事梗概
  ├── 人物小传
  ├── 人物关系
  ├── 分集大纲
  ├── 分场大纲
  └── 改编说明

剧本编辑器
  ├── 中文分场剧本
  ├── 场景卡片
  ├── 原文对照
  ├── AI 重写
  └── 格式检查

导出中心
  ├── YAML
  ├── DOCX
  ├── PDF
  ├── TXT
  └── HTML
```

---

## 5. 单人版编辑器设计

编辑器建议保留三栏结构。

### 左栏：小说原文

显示：

```text
章节列表
段落编号
人物识别结果
地点识别结果
关键事件
原文高亮
```

### 中栏：剧本正文

显示中文分场剧本：

```text
第1集 第3场 内景 林家客厅 夜

△客厅里只开着一盏落地灯。林晚站在门口，手里攥着湿透的信封。

林晚：你早就知道了，对不对？
顾沉：（沉默片刻）我知道的时候，已经来不及了。
```

### 右栏：AI 辅助与结构信息

显示：

```text
本场目的
本场冲突
出场人物
原文来源
改编说明
AI 建议
格式问题
短剧爆点
待确认项
```

这个结构比云端协作更适合第一版，因为用户最需要的是**自己能快速校对和改写 AI 生成内容**。

---

## 6. 保留“批注”，但做成单人备注

虽然不做多人协作，但建议保留单人批注。

例如：

```yaml
notes:
  - id: note_001
    target_type: scene
    target_id: sc_001_003
    text: "这里顾沉的动机还不清楚，需要后面补伏笔。"
    status: open
```

用途：

```text
作者自己标记问题
AI 标记不确定内容
导出前列出待处理项
后续打磨时快速定位
```

---

## 7. YAML Schema 中删除 collaboration 模块

上一版有：

```yaml
collaboration:
  collaborators: []
  comments: []
  revision_history: []
```

现在改成：

```yaml
review:
  notes: []
  todo_items: []
  warnings: []

revision:
  current_version: 1
  snapshots: []
  ai_rewrite_history: []
```

推荐顶层结构变为：

```yaml
schema_version: "1.2"

project:
  id: ""
  title: ""
  language: "zh-CN"
  target_type: "micro_drama"
  edit_mode: "chinese_traditional"

source:
  type: "novel"
  chapters: []

adaptation:
  strategy: ""
  target_episode_count: 24
  target_duration_per_episode: "2min"
  source_fidelity: "medium"

bible:
  logline: ""
  synopsis: {}
  characters: []
  relationships: []
  locations: []
  objects: []
  timeline: []

outlines:
  story_outline: []
  episode_outlines: []
  scene_outlines: []

screenplay:
  episodes: []
  scenes: []

analytics:
  character_stats: []
  scene_stats: []
  location_stats: []
  tag_stats: []

review:
  notes: []
  todo_items: []
  warnings: []

revision:
  current_version: 1
  snapshots: []
  ai_rewrite_history: []

export_profiles:
  - name: "中文分场剧本 DOCX"
  - name: "中文分场剧本 PDF"
  - name: "YAML"
```

---

## 8. 不做云端协作后的技术架构建议

第一阶段可以做得更轻。

### 推荐架构

```text
前端：Web App
后端：AI 改编服务 + 文档导出服务
存储：本地浏览器存储 / 用户手动保存项目文件 / 轻量数据库
导出：DOCX / PDF / YAML / TXT
```

### 项目文件形式

可以设计一个项目包：

```text
project-name.scriptproj
```

本质可以是 zip 包，里面包含：

```text
project.yaml
source/
  chapters.json
exports/
  screenplay.docx
  screenplay.pdf
assets/
  character-images/
  reference-files/
```

这样第一阶段即使没有云端，也能做到：

```text
保存项目
重新打开项目
导出备份
跨设备手动迁移
版本归档
```

---

## 9. 功能路线重新规划

### V0.1 原型

```text
粘贴 3 章小说
生成故事梗概
抽取人物
抽取地点
生成 3–5 场剧本样例
输出 YAML
```

### V0.5 MVP

```text
上传 TXT / DOCX
章节解析
人物小传
分集大纲
分场大纲
完整中文分场剧本
可视化剧本编辑器
原文追溯
YAML / DOCX / PDF 导出
```

### V1.0 可用版

```text
人物关系图
场景卡片
标签系统
角色出场统计
对白统计
微短剧爆点分析
AI 重写单场
AI 润色对白
AI 检查格式
项目文件保存 / 打开
```

### V1.5 专业互通版

```text
Fountain 导出
FDX 导出
HTML 导出
更多剧本模板
微信聊天剧模式
短视频脚本模式
广播剧模式
```

### V2.0 再考虑云端

```text
云端项目
多人协作
评论审阅
团队权限
制片人审阅模式
在线分享
```

---

## 10. 修正后的产品重点

去掉云端协作后，你的产品差异化会更清晰：

```text
不是花生剧本式协作平台
不是传统编剧软件
不是单纯 AI 写作工具

而是：
中文小说作者专用的 AI 剧本改编工作台
```

第一阶段最重要的 5 个卖点应该是：

```text
1. 能读懂 3 章以上中文小说。
2. 能自动生成中文分场剧本。
3. 能保留原文追溯，方便作者核对。
4. 能输出标准化 YAML，方便后续编辑和导出。
5. 能导出 Word/PDF，符合国内交付习惯。
```

我的建议是：**云端协作放到 V2，不要进 MVP。** MVP 应该集中打磨“小说改编质量、中文剧本格式、YAML Schema、Word/PDF 导出、原文追溯”这五件事。