# Git Commit 与 PR 规范

## 1. 开发原则

为了满足比赛对开发过程的要求，项目应保持持续提交，避免最后一天一次性提交所有代码。

## 2. 分支规范

```text
main
develop
feature/novel-parser
feature/story-graph
feature/yaml-schema
feature/script-generator
feature/reviewer
feature/frontend-demo
```

## 3. Commit 规范

推荐格式：

```text
feat(parser): add chapter splitter
feat(schema): add screenplay yaml schema
fix(generator): fix missing speaker field
docs(readme): update demo instructions
test(schema): add yaml validation cases
```

## 4. PR 规范

每个 PR 只做一件事。

PR 描述必须包含：

1. 标题：一句话说明新增/修改内容；
2. 功能描述：说明该功能的作用与使用方式；
3. 实现思路：简要说明技术选型或核心逻辑；
4. 测试方式：说明如何验证功能正常运行；
5. 截图或输出：如有界面或 YAML 输出，应附结果。

## 5. PR 模板

见 `pr_templates/pull_request_template.md`。
