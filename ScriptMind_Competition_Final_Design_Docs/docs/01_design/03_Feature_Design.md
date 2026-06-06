# 核心功能设计

## 1. 小说章节解析

输入示例：

```yaml
novel:
  title: "青山旧梦"
  chapters:
    - chapter_id: 1
      title: "归来"
      content: "..."
    - chapter_id: 2
      title: "重逢"
      content: "..."
    - chapter_id: 3
      title: "旧案"
      content: "..."
```

解析目标：

1. 判断章节边界；
2. 提取人物名称；
3. 提取对话；
4. 提取地点和时间；
5. 提取关键事件。

## 2. 人物建模

人物模型字段：

```yaml
character:
  id: char_001
  name: 林晚
  role: protagonist
  traits:
    - 冷静
    - 谨慎
  goals:
    - 查清父亲死亡真相
  relationships:
    - target: char_002
      type: former_friend
```

## 3. 场景拆分

小说按章节组织，剧本按场景组织。系统需要根据地点、时间、事件变化自动拆分场景。

场景拆分依据：

- 地点变化；
- 时间变化；
- 出场人物变化；
- 冲突目标变化；
- 情绪节奏变化。

## 4. 剧本 Beat 生成

一个场景由多个 beat 组成。

beat 类型包括：

| 类型 | 说明 |
|---|---|
| action | 动作描写 |
| dialogue | 人物对白 |
| narration | 旁白 |
| transition | 转场 |
| camera | 镜头建议 |

## 5. 来源追踪

每个场景和关键对白记录来源：

```yaml
source_trace:
  chapter_id: 2
  paragraph_range: [12, 16]
  adaptation_type: rewrite
```

## 6. 自动分镜建议

系统根据剧情自动生成镜头建议：

```yaml
camera_suggestion:
  - shot_type: wide
    description: 医院走廊全景
  - shot_type: close_up
    description: 林晚听到熟悉声音后的表情
```

## 7. 质量评估

系统自动输出：

```yaml
quality:
  plot_coherence: 0.91
  character_consistency: 0.88
  dialogue_naturalness: 0.90
  scene_transition: 0.84
```
