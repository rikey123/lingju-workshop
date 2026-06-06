# README 写作模板

以下内容可以直接作为比赛仓库 README 的主体结构。

## 项目名称

ScriptMind：基于多智能体与剧情图谱的小说自动影视化改编平台

## 项目简介

ScriptMind 是一款 AI 辅助剧本创作工具，能够将 3 个章节以上的小说文本自动转换为结构化剧本 YAML。系统通过小说解析、人物建模、剧情图谱构建、多智能体协作和质量评估，帮助小说作者快速获得可编辑、可进一步打磨的剧本初稿。

## 核心功能

- 小说章节导入
- 人物与关系提取
- 剧情事件识别
- 场景自动拆分
- 剧本对白生成
- YAML 结构化输出
- YAML Schema 校验
- 剧本质量评估
- 来源章节追踪
- 镜头建议生成

## 创新点

1. Multi-Agent 多智能体协同改编；
2. Story Graph 剧情图谱；
3. Character Memory 角色记忆；
4. Source Trace 原文追踪；
5. Script Reviewer 剧本质量评估；
6. 可扩展 YAML Schema。

## 快速开始

```bash
git clone <repo-url>
cd ScriptMind
pip install -r requirements.txt
python app.py  # 启动 Gradio 演示界面，默认访问 http://localhost:7860
```

> 依赖环境：Python 3.10+，详见 requirements.txt（核心依赖：fastapi、gradio、openai、networkx、faiss-cpu、pyyaml、pydantic）

## 示例

输入：examples/input/novel_sample.md  
输出：examples/output/screenplay_output.yaml

## Demo 视频

视频链接：请在此处填写可访问的视频链接。

## 第三方依赖

详见 [第三方依赖与原创性声明](docs/05_project_management/03_Dependency_and_Originality.md)

主要依赖：fastapi 0.110.0、gradio 4.31.0、openai 1.30.0、networkx 3.2.1、faiss-cpu 1.8.0、pyyaml 6.0.1、pydantic 2.6.4

## 开发记录

本项目采用 PR 驱动开发，每个功能模块通过独立 PR 提交。
