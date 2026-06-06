# ScriptMind 竞赛提交设计文档包

> 项目名称：ScriptMind  
> 项目定位：基于多智能体与剧情图谱的小说自动影视化改编平台  
> 题目方向：AI 小说转剧本工具  
> 核心能力：将 3 个章节以上小说文本自动转换为结构化剧本 YAML，并提供 YAML Schema 设计文档。

## 1. 为什么重新设计

根据评审与提交规则，作品不仅要满足题目功能，还要体现：

- 作品完整度与创新性：40%
- 开发过程与质量：40%
- 演示与表达：20%

因此，本项目文档包不只描述“小说转 YAML”，而是围绕比赛要求补充了：

1. 产品完整方案
2. 多智能体技术架构
3. Story Graph 剧情图谱
4. Character Memory 角色记忆
5. YAML Schema 规范
6. Demo 演示方案
7. Git / PR / Commit 开发规范
8. README 提交规范
9. 质量评估与验收清单

## 2. 文档目录

### 提交与评审相关

- [提交材料清单](docs/00_submission/01_Submission_Checklist.md)
- [评审规则对齐说明](docs/00_submission/02_Evaluation_Mapping.md)
- [Demo 视频脚本](docs/00_submission/03_Demo_Video_Script.md)
- [README 写作模板](docs/00_submission/04_README_Template.md)

### 产品与功能设计

- [项目总览](docs/01_design/01_Project_Overview.md)
- [产品需求文档 PRD](docs/01_design/02_Product_Requirements.md)
- [核心功能设计](docs/01_design/03_Feature_Design.md)
- [用户使用流程](docs/01_design/04_User_Workflow.md)

### 技术设计

- [系统架构设计](docs/02_technology/01_System_Architecture.md)
- [Multi-Agent 多智能体设计](docs/02_technology/02_Multi_Agent_Design.md)
- [小说转剧本流程设计](docs/02_technology/03_Conversion_Pipeline.md)
- [Story Graph 剧情图谱设计](docs/02_technology/04_Story_Graph.md)
- [Character Memory 角色记忆设计](docs/02_technology/05_Character_Memory.md)
- [质量评估模块设计](docs/02_technology/06_Quality_Evaluation.md)
- [接口与数据流设计](docs/02_technology/07_API_and_Dataflow.md)

### YAML Schema

- [YAML Schema 设计说明](docs/03_schema/01_YAML_Schema_Design.md)
- [完整 YAML Schema 字段表](docs/03_schema/02_Field_Definition.md)
- [Schema 设计原因说明](docs/03_schema/03_Design_Rationale.md)

### Demo 与样例

- [Demo 场景设计](docs/04_demo/01_Demo_Plan.md)
- [测试用例设计](docs/04_demo/02_Test_Cases.md)
- [示例输入小说](examples/input/novel_sample.md)
- [示例输出剧本 YAML](examples/output/screenplay_output.yaml)
- [示例质量评估结果](examples/output/quality_report.yaml)

### 项目管理与开发规范

- [Git Commit 与 PR 规范](docs/05_project_management/01_Git_PR_Commit_Rules.md)
- [开发过程记录模板](docs/05_project_management/02_Development_Log_Template.md)
- [第三方依赖与原创性声明](docs/05_project_management/03_Dependency_and_Originality.md)
- [最终提交自查表](docs/05_project_management/04_Final_Checklist.md)

## 3. 推荐提交材料

比赛最终建议提交：

1. 公开 GitHub / Gitee 仓库
2. README.md
3. Demo 视频链接
4. 源代码
5. 本文档包
6. 示例输入与输出
7. PR / commit 开发记录
8. 第三方依赖说明
