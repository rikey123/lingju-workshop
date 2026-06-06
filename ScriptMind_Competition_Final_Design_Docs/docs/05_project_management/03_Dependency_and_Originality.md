# 第三方依赖与原创性声明

## 1. 第三方依赖说明

> 运行环境：Python 3.10+

| 依赖 | 版本 | 用途 | 是否原创功能 |
|---|---|---|---|
| fastapi | 0.110.0 | 后端接口服务 | 否 |
| uvicorn | 0.29.0 | ASGI 服务器 | 否 |
| pyyaml | 6.0.1 | YAML 解析与导出 | 否 |
| pydantic | 2.6.4 | 数据结构校验与 Schema 生成 | 否 |
| networkx | 3.2.1 | Story Graph 图结构构建 | 否 |
| faiss-cpu | 1.8.0 | 角色记忆向量检索 | 否 |
| openai | 1.30.0 | LLM 调用（OpenAI 兼容接口） | 否 |
| gradio | 4.31.0 | 演示用前端界面 | 否 |
| jsonschema | 4.22.0 | YAML Schema 字段校验 | 否 |

## 2. 原创功能说明

本项目原创部分主要包括：

1. 小说到剧本的多阶段转换流程；
2. 面向剧本生成的 YAML Schema；
3. Multi-Agent 协同改编架构；
4. Story Graph 剧情图谱设计；
5. Character Memory 角色记忆机制；
6. Script Reviewer 质量评估指标；
7. Source Trace 来源追踪字段设计；
8. 剧本 Demo 样例与展示流程。

## 3. 复用代码说明

如复用历史代码或开源代码，需要在 README 和 PR 描述中注明来源、用途和修改内容。

## 4. 避免无效风险

不得将第三方完整项目简单包装为本项目。第三方框架只能作为基础设施，核心业务逻辑必须自主设计与实现。
