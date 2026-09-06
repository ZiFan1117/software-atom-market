# Contributing · 让一个原子进市场

> 进市场两种方式，**全部机器闸、无人工评审**：
> A. **联邦（默认，最简单）**：manifest 放**你自己的仓库** + 打 topic `software-atom` → 自动被发现。
> B. **中央（可选）**：PR 把 manifest 提交进本仓 `atoms/`。

## 方式 A：联邦（推荐，三步）

1. 在你自己（公开）的仓库放 manifest：
   - 单个：仓库根目录 `atom.json`
   - 多个：`atoms/*.atom.json`
2. 给仓库打 topic：**`software-atom`**
3. 完成。我们的发现器每日扫描，**机器校验通过即收录**进 `registry/index.json` 与 `CATALOG.md`；不过就给错误清单。

## 方式 B：中央 PR（可选）

1. 按样例在 `atoms/<id>.atom.json` 写 manifest
2. 本地 `node scripts/validate.mjs` 全过（自动 PR 检查也会跑同一个脚本）
3. 改动 `atoms/` 后运行 `npm run generate` 并把 `CATALOG.md` 一起提交
4. 开 PR；**机器绿 = 合并即收录**，无人工评审

## manifest 必填与硬规则（A/B 一致）

| 字段 | 规则 |
| --- | --- |
| `id` | `domain.verb` 形；文件名 = `id + ".atom.json"`（中央） |
| `layer` | `capability` / `primitive` |
| `version` | 语义化版本 |
| `intent` | 一句"实现什么"（列表/搜索层） |
| `description` | **必填**：四节标题（它做什么/怎么实现/何时用/示例）+ **四张 Mermaid 图**（数据流转 `flowchart`、模块分解 `classDiagram`、交互时序 `sequenceDiagram`、调用图 `graph`/`digraph`）——细则与模板见 [`spec/detail-convention.md`](./spec/detail-convention.md) |
| `input` / `output` | 非空数据形状（JSON-Schema 子集） |
| `side_effects` | 推荐：none / network / file / email / db / process |

机器校验 = 字段齐全 + description 四节四图 + 格式合法。**机器过就收录；没有人工评审。**

## 别做什么

- 别把实现代码放进 manifest 或本仓（代码留你处，用 `implementation_ref` 指路）。
- 别夹带密钥/凭据/私有数据。
- 别"顺手加选项"膨胀原子（一次意图一个原子）。
- 别放伪造的图——机器验"有"，用户验"真"（假图会被使用量与报错淘汰）。

## 许可

manifest 默认以 MIT 进入公共库（联邦仓内 manifest 归属作者、按作者仓库许可展示）；投稿即代表同意上述约定。
