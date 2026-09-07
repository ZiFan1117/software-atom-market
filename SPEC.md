# Software Atom Manifest · 协议标准（SPEC）

> 版本：**0.3**（整份文档 = YAML frontmatter + Markdown 正文）。更新：2026-09。
> 本文件是"一个原子怎么写、机器怎么验、怎么进市场"的**唯一协议入口**。机器实现 = 校验器脚本；人读 = 本规范；机器与人之间的契约见各实现。

## 0. 一句话协议

> **一个原子 = 一份公开可拉取的 `<id>.atom.md`**（SKILL.md 式：YAML frontmatter + Markdown 正文四节四图），被机器校验通过后即可进入公共目录并被任何 Agent/人检索与拼装。

## 1. 组成（三件套 + 两通道）

| 件 | 文件 | 作用 |
| --- | --- | --- |
| 格式规范 | [`spec/atom.schema.json`](./spec/atom.schema.json) | frontmatter 字段/枚举/必填（机器可读） |
| 详情规范 | [`spec/detail-convention.md`](./spec/detail-convention.md) | 整份 `.atom.md` 怎么写（frontmatter + 四节 + 四图，v0.3 机器硬检） |
| 联邦约定 | [`spec/FEDERATION.md`](./spec/FEDERATION.md) | topic 聚合协议（`software-atom`） |
| 校验器（参考实现） | [`scripts/validate.mjs`](./scripts/validate.mjs)（目录级）· [`scripts/validate-single.mjs`](./scripts/validate-single.mjs)（单文件） | 机器闸实现 |
| 消费端实现 | 插件 `dsh-atom-market` 的 `atom_validate` | DSH 内同款校验 |

进市场两通道：**联邦**（自己公开仓 + 打 topic，自动发现）/ **中央**（PR 进 `atoms/`）。

> **兼容**：v0.2 的 `*.atom.json`（JSON manifest）仍可被校验器与发现器读取，但不作投稿推荐；新投稿一律 `.atom.md`。

## 2. manifest 怎么写（速查）

> **语言/形态无关**：原子不绑定实现语言（`lang` 仅标注、不作约束），也不限定形态——函数级实现、库、乃至**框架**，凡满足"一次意图 + 契约完整 + 机器校验通过"即可作为原子发布（**框架也是原子**）。

```markdown
---
id: domain.verb
layer: capability
version: 1.0.0
intent: 一句话：实现什么
when_to_use: 何时用一句（推荐）
language: zh-CN（推荐）
tags: ["domain", "verb"]（数组/对象用 JSON 内联）
category: data | document | money | comms | ai | web | storage | code | automation | other
side_effects: none | network | file | email | db | process
lang: python
author: 投稿者
verified: false
implementation_ref: 实现代码位置
deps: ["other.atom_id"]
input:  { "type":"object", ... }     # JSON 内联（JSON ⊆ YAML）
output: { "type":"object", ... }
tests:  [ { "input": {...}, "expect": {...} } ]
---

## 它做什么
## 怎么实现
## 何时用
## 示例
```

- frontmatter = manifest 顶层字段（`description` 不放 frontmatter）；正文 = `description`。
- 正文必须含（机器硬检，缺一即不收）：
  - 四节标题：`## 它做什么`、`## 怎么实现`、`## 何时用`、`## 示例`
  - 四张 Mermaid 图：数据流转 `flowchart`、模块分解 `classDiagram`、交互时序 `sequenceDiagram`、调用图 `graph`/`digraph`
- 渐进披露（v0.3）：检索层只读 frontmatter 的 `id/intent/when_to_use/category`；命中后再读整篇正文。

完整模板与反例：[`spec/detail-convention.md`](./spec/detail-convention.md)。

## 3. 机器怎么验（参考实现规则）

校验器逐项检查并给出 `valid/errors/warnings`：
1. 顶层字段 ⊆ 白名单（含 `when_to_use`/`language`）；`id/layer/version/intent/description/input/output` 必填（`.atom.md` 中 description = 正文本体）
2. `id` 匹配 `^[a-z0-9]+(\.[a-z0-9_]+)+$`；`layer/side_effects/category` 枚举合法；`version` 语义化
3. 正文：四节标题齐全 + 四张图各自存在且锚点正确
4. `input/output` 为非空数据形状；`tests`（若有）每项含 `input`+`expect`；`verified:true` 需非空 `tests`

投稿者可自检（任一方式）：
```sh
# A. 克隆本仓跑目录级（同时扫 *.atom.md 与旧 *.atom.json）
node scripts/validate.mjs

# B. 单文件自检
curl -O https://raw.githubusercontent.com/ZiFan1117/software-atom-market/main/scripts/validate-lib.mjs
curl -O https://raw.githubusercontent.com/ZiFan1117/software-atom-market/main/scripts/validate-single.mjs
node validate-single.mjs atom.md      # 0 = 通过；非 0 = 输出错误清单

# C. DSH 用户：装 dsh-atom-market，用 atom_validate 校验
```

## 4. 语义与信任（机器闸）

- **机器过 = 收录。无人工评审。** 校验器与 CI（`.github/workflows/validate-atoms.yml`、`federation.yml`）是唯一闸门。
- 机器验"完整 + 合法 + 有内容"；图/声明的**真实性**由作者署名负责，被使用时由 `tests`（未来可执行）与使用反馈兑现。
- 中央目录内原子视为 `verified`（维护者直接发布）；联邦原子来自 `topic:software-atom` 自动发现，来源仓公开可查。

## 5. 演进与兼容

- manifest 版本字段 `version` 语义化：`major` 破坏性变更会同步升 SPEC major 并给出迁移说明。
- **v0.2 → v0.3**：文件形态从 JSON manifest 改为 `.atom.md`（YAML frontmatter + 正文）。迁移：把 JSON 顶层字段抄进 frontmatter，`description` 值放到 `---` 之后的正文。工具链（校验器/发现器/目录生成）同时支持 `.atom.md` 与旧 `.atom.json`，存量不破。
- 本仓所有规范变更 = PR → 校验器绿 → merge；`SPEC.md` 顶部版本随之更新。

## 6. 速览：参与 + 消费

- **想发布原子**：自己的公开仓放 `atom.md`（或 `atoms/*.atom.md`）→ 打 topic `software-atom` → 等机器发现/自检通过（详见 [`FEDERATION.md`](./spec/FEDERATION.md)、[`CONTRIBUTING.md`](./CONTRIBUTING.md)）。
- **想用原子**：装 `dsh-atom-market` → `atom_search`（逛，一句话）/ `atom_read`（读全貌，实时拉来源仓）。
