# Character Memory 角色记忆设计

## 1. 设计原因

长篇小说改编中，AI 容易遗忘早期设定。例如：

- 第一章设定人物怕黑；
- 第十章生成时让人物独自夜行且毫无反应；
- 前文人物关系紧张，后文突然亲密。

角色记忆模块用于保存人物稳定设定和动态变化。

## 2. 记忆内容

```yaml
character_memory:
  char_001:
    name: 林晚
    stable_traits:
      - 冷静
      - 谨慎
      - 怕黑
    goals:
      - 查清父亲死亡真相
    fears:
      - 真相伤害家人
    relationships:
      char_002:
        type: former_friend
        status: distrust
    arc:
      start: 回避过去
      middle: 主动调查
      end: 面对真相
```

## 3. 记忆类型

| 类型 | 是否变化 | 示例 |
|---|---|---|
| stable_traits | 通常不变 | 性格、习惯、口头禅 |
| dynamic_state | 会变化 | 当前情绪、关系状态 |
| goals | 可阶段性变化 | 调查真相、保护家人 |
| secrets | 随剧情揭露 | 隐瞒的过去 |
| relationships | 会变化 | 信任、怀疑、敌对 |

## 4. RAG 机制

生成每个场景前，系统检索相关人物记忆：

```text
当前场景人物
  ↓
检索 Character Memory
  ↓
读取人物关系与目标
  ↓
生成符合设定的对白和动作
```

## 5. 一致性检查

Reviewer Agent 检查：

1. 人物行为是否违背性格；
2. 人物关系是否突然变化；
3. 目标是否被遗忘；
4. 重要秘密是否提前暴露；
5. 语言风格是否一致。
