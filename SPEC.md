# Software Atom Manifest · 协议标准（SPEC）

> 版本：**0.2**（机器闸）。更新：2026-09。
> 本文件是"一个原子怎么写、机器怎么验、怎么进市场"的**唯一协议入口**。机器实现 = 校验器脚本；人读 = 本规范；机器与人之间的契约见各实现。

## 0. 一句话协议

> **一个原子 = 一个公开可拉取的 manifest（JSON）**，被机器校验通过后，即可进入公共目录并被任何 Agent/人检索与拼装。

## 1. 组成（三件套 + 两通道）

| 件 | 文件 | 作用 |
| --- | --- | --- |
| 格式规范 | [`spec/atom.schema.json`](./spec/atom.schema.json) | manifest 字段/枚举/必填（机器可读） |
| 详情规范 | [`spec/detail-convention.md`](./spec/detail-convention.md) | `description` 怎么写（四节 + 四张 Mermaid 图，v0.2 机器硬检） |
| 联邦约定 | [`spec/FEDERATION.md`](./spec/FEDERATION.md) | topic 聚合协议（`software-atom`） |
| 校验器（参考实现） | [`scripts/validate.mjs`](./scripts/validate.mjs)（目录级）· [`scripts/validate-single.mjs`](./scripts/validate-single.mjs)（单文件） | 机器闸实现 |
| 消费端实现 | 插件 `dsh-atom-market` 的 `atom_validate` | DSH 内同款校验 |

进市场两通道：**联邦**（自己公开仓 + 打 topic，自动发现）/ **中央**（PR 进 `atoms/`）。

## 2. manifest 怎么写（速查）

```json
{
  "id": "domain.verb",
  "layer": "capability",
  "version": "1.0.0",
  "intent": "一句话：实现什么",
  "description": "Markdown：四节标题 + 四张 Mermaid 图（见下）",
  "input":  { "数据形状 JSON-Schema" },
  "output": { "数据形状 JSON-Schema" },
  "side_effects": "none | network | file | email | db | process",
  "category": "data | document | money | comms | ai | web | storage | code | automation | other"
}
```

`description` 必须含（机器硬检，缺一即不收）：
- 四节标题：`## 它做什么`、`## 怎么实现`、`## 何时用`、`## 示例`
- 四张 Mermaid 图：数据流转 `flowchart`、模块分解 `classDiagram`、交互时序 `sequenceDiagram`、调用图 `graph`/`digraph`

完整模板与反例：[`spec/detail-convention.md`](./spec/detail-convention.md)。

## 3. 机器怎么验（参考实现规则）

校验器逐项检查并给出 `valid/errors/warnings`：
1. 顶层字段 ⊆ 白名单；`id/layer/version/intent/description/input/output` 必填
2. `id` 匹配 `^[a-z0-9]+(\.[a-z0-9_]+)+$`；`layer/side_effects/category` 枚举合法；`version` 语义化
3. `description`：四节标题齐全 + 四张图各自存在且锚点正确
4. `input/output` 为非空数据形状；`tests`（若有）每项含 `input`+`expect`；`verified:true` 需非空 `tests`

投稿者可自检（任一方式）：
```sh
# A. 克隆本仓跑目录级
node scripts/validate.mjs

# B. 单文件自检（下载两个脚本后对单个 manifest 跑）
curl -O https://raw.githubusercontent.com/ZiFan1117/software-atom-market/main/scripts/validate-lib.mjs
curl -O https://raw.githubusercontent.com/ZiFan1117/software-atom-market/main/scripts/validate-single.mjs
node validate-single.mjs atom.json      # 0 = 通过；非 0 = 输出错误清单

# C. DSH 用户：装 dsh-atom-market，用 atom_validate 校验
```

## 4. 语义与信任（v0.2 · 机器闸）

- **机器过 = 收录。无人工评审。** 校验器与 CI（`.github/workflows/validate-atoms.yml`、`federation.yml`）是唯一闸门。
- 机器验"完整 + 合法 + 有内容"；图/声明的**真实性**由作者署名负责，被使用时由 `tests`（未来可执行）与使用反馈兑现。
- 中央目录内原子视为 `verified`（维护者直接发布）；联邦原子来自 `topic:software-atom` 自动发现，来源仓公开可查。

## 5. 演进与兼容

- manifest 版本字段 `version` 语义化：`major` 破坏性变更会同步升 SPEC major 并给出迁移说明。
- 本仓所有规范变更 = PR → 校验器绿 → merge；`SPEC.md` 顶部版本随之更新。
- 变更日志：见 git history；破坏性变更必须在本文件 §兼容 注明。

## 6. 速览：参与 + 消费

- **想发布原子**：自己的公开仓放 `atom.json`（或 `atoms/*.atom.json`）→ 打 topic `software-atom` → 等机器发现/自检通过（详见 [`FEDERATION.md`](./spec/FEDERATION.md)、[`CONTRIBUTING.md`](./CONTRIBUTING.md)）。
- **想用原子**：装 `dsh-atom-market` → `atom_search`（逛，一句话）/ `atom_read`（读全貌，实时拉来源仓）。
