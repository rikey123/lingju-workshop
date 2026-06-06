# Story Graph 剧情图谱设计

## 1. 设计目的

长篇小说包含大量人物、地点、事件和关系。如果直接让 AI 生成剧本，容易出现：

- 人物关系混乱；
- 前后设定矛盾；
- 关键事件遗漏；
- 场景顺序不合理；
- 冲突线断裂。

Story Graph 用图结构保存剧情信息，帮助系统在改编时保持一致性。

## 2. 图谱节点

| 节点类型 | 示例 |
|---|---|
| Character | 林晚、沈亦川 |
| Event | 医院重逢、旧案调查 |
| Location | 县医院、老宅 |
| Conflict | 信任危机、真相隐瞒 |
| Object | 日记本、旧照片 |

## 3. 图谱边

| 边类型 | 含义 |
|---|---|
| appears_in | 人物出现在某事件 |
| happens_at | 事件发生在某地点 |
| causes | 事件导致另一个事件 |
| conflicts_with | 人物之间存在冲突 |
| trusts | 信任关系 |
| hides_from | 隐瞒关系 |
| investigates | 调查关系 |

## 4. 示例

```yaml
story_graph:
  nodes:
    - id: char_001
      type: Character
      name: 林晚
    - id: event_001
      type: Event
      name: 医院重逢
    - id: loc_001
      type: Location
      name: 县医院
  edges:
    - from: char_001
      to: event_001
      type: appears_in
    - from: event_001
      to: loc_001
      type: happens_at
```

## 5. 图谱在剧本生成中的作用

### 5.1 保证人物一致性

生成新场景时，系统从图谱读取人物关系，避免对白违背人物关系。

### 5.2 保证事件顺序

系统根据事件因果链安排场景顺序。

### 5.3 保留关键冲突

系统将高冲突事件优先改编为重点场景。

### 5.4 支持可视化

Story Graph 可以用于生成答辩中的人物关系图和剧情发展图。
