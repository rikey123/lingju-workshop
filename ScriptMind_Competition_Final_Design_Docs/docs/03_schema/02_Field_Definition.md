# 完整 YAML Schema 字段表

## 1. script

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| metadata | object | 是 | 剧本元信息 |
| source | object | 是 | 原小说信息 |
| characters | array | 是 | 人物列表 |
| story_graph | object | 否 | 剧情图谱摘要（节点与边） |
| acts | array | 是 | 幕结构 |
| quality | object | 否 | 质量评估结果 |

## 2. metadata

| 字段 | 类型 | 必填 | 示例 |
|---|---|---:|---|
| title | string | 是 | 青山旧梦 |
| version | string | 是 | 1.0 |
| language | string | 是 | zh-CN |
| output_format | string | 是 | screenplay |
| generated_by | string | 否 | ScriptMind |
| schema_version | string | 是 | 1.0 |

## 3. character

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| id | string | 是 | 人物唯一 ID |
| name | string | 是 | 人物姓名 |
| role | string | 是 | protagonist/supporting/antagonist |
| description | string | 否 | 人物简介 |
| traits | array | 否 | 性格特征 |
| goals | array | 否 | 人物目标 |
| relationships | array | 否 | 人物关系 |

## 4. act

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| act_id | string | 是 | 幕 ID |
| title | string | 是 | 幕标题 |
| summary | string | 是 | 幕摘要 |
| scenes | array | 是 | 场景列表 |

## 5. scene

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| scene_id | string | 是 | 场景 ID |
| title | string | 否 | 场景标题 |
| source_chapters | array | 是 | 来源章节 |
| location | string | 是 | 地点 |
| time | string | 是 | 时间 |
| atmosphere | string | 否 | 氛围 |
| purpose | string | 是 | 戏剧目的 |
| conflict_level | integer | 否 | 冲突强度，1-10 |
| characters | array | 是 | 出场人物 ID |
| emotional_curve | object | 否 | 情绪变化 |
| beats | array | 是 | 场景内部 beat |
| camera_suggestion | array | 否 | 镜头建议 |
| source_trace | object | 否 | 来源追踪 |

## 6. beat

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| beat_id | string | 是 | beat ID |
| type | string | 是 | action/dialogue/narration/transition/camera |
| speaker | string | 条件必填 | 当 type 为 dialogue 时必填 |
| emotion | string | 否 | 情绪 |
| content | string | 是 | 内容 |
| source_trace | object | 否 | 来源追踪 |

## 7. source_trace

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| chapter_id | integer | 是 | 来源章节 |
| paragraph_range | array | 否 | 来源段落范围 |
| adaptation_type | string | 否 | direct/rewrite/inferred |

## 8. camera_suggestion

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| shot_type | string | 是 | wide/medium/close_up/over_shoulder |
| target | string | 否 | 镜头主体 |
| description | string | 是 | 镜头描述 |
