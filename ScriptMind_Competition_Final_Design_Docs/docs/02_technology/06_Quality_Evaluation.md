# 剧本质量评估模块设计

## 1. 设计目的

AI 生成剧本后，不能只输出结果，还需要帮助作者判断初稿质量。质量评估模块用于自动发现问题，并给出修改建议。

## 2. 评分指标

| 指标 | 权重 | 说明 |
|---|---:|---|
| Plot Coherence | 25% | 剧情是否连贯，事件因果是否清晰 |
| Character Consistency | 25% | 人物性格、目标、关系是否一致 |
| Dialogue Naturalness | 20% | 对白是否自然，是否符合人物身份 |
| Scene Structure | 15% | 场景是否完整，是否有明确戏剧目的 |
| YAML Validity | 15% | YAML 是否合法，字段是否完整 |

## 3. 输出示例

```yaml
quality_report:
  overall_score: 88
  dimensions:
    plot_coherence: 91
    character_consistency: 86
    dialogue_naturalness: 89
    scene_structure: 84
    yaml_validity: 93
  issues:
    - scene_id: scene_003
      type: scene_transition
      severity: medium
      description: 第3场到第4场缺少过渡动作。
      suggestion: 增加林晚离开医院前看到旧照片的动作。
```

## 4. 检查规则

### 4.1 剧情连贯性

检查：

- 事件是否有前因后果；
- 场景顺序是否合理；
- 关键事件是否遗漏。

### 4.2 人物一致性

检查：

- 人物目标是否一致；
- 人物关系变化是否有铺垫；
- 对白是否符合人物身份。

### 4.3 对白自然度

检查：

- 是否过度解释；
- 是否过长；
- 是否缺少潜台词；
- 是否符合场景情绪。

### 4.4 YAML 合法性

检查：

- 缩进是否正确；
- 必填字段是否存在；
- ID 是否唯一；
- 人物引用是否有效。
