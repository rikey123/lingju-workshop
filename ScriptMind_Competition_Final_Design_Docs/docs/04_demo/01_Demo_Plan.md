# Demo 场景设计

## 1. Demo 目标

演示 ScriptMind 从小说输入到剧本 YAML 输出的完整流程。

## 2. Demo 输入

使用 `examples/input/novel_sample.md`，包含 3 个章节：

1. 第一章：归来；
2. 第二章：重逢；
3. 第三章：旧案。

## 3. Demo 输出

系统生成：

1. 人物列表；
2. Story Graph；
3. 剧本 YAML；
4. 质量评估报告。

## 4. 演示重点

| 演示点 | 对应评分项 |
|---|---|
| 3 章小说输入 | 作品完整度 |
| 自动生成 YAML | 题目契合度 |
| Story Graph | 创新性 |
| Character Memory | 技术亮点 |
| YAML Schema 校验 | 工程质量 |
| Demo 视频清晰讲解 | 演示表达 |

## 5. 演示顺序

1. 启动 Gradio 演示界面（`python app.py`）；
2. 在输入区粘贴 `examples/input/novel_sample.md` 内容，点击"开始转换"；
3. 查看解析结果区：人物列表、地点、事件；
4. 查看剧本输出区：生成的 YAML 剧本结构；
5. 查看质量评估区：各维度评分和修改建议；
6. 下载 YAML 文件，在编辑器中展示完整 Schema 结构；
7. 打开 `docs/03_schema/01_YAML_Schema_Design.md` 说明字段设计原因。
