# Spec · 原子契约规范

> 软件原子市场 v0.1（草案）。机器可读规范见 [`atom.schema.json`](./atom.schema.json)。

## 设计原则

1. **统一插座，语言无关**：所有原子对外只暴露同一形状的契约（intent + input + output），内部实现语言不限。
2. **意图可检索**：`intent` 是给人类阅读、给 AI 做语义检索的入口。
3. **拼装期即可校验**：input/output 用 JSON Schema 声明 → 两块原子接线前就能做类型/形状检查，而不是运行时才炸（对 UNIX 弱类型文本流的修复）。
4. **副作用显式声明**：`side_effects` 区分"纯计算原子"与"碰世界的接口原子"，是沙箱与权限策略的依据。
5. **上架必有验证**：`tests` 提供契约测试样例，`verified` 标记验证状态。

## 术语

| 词 | 含义 |
| --- | --- |
| Atom | 最小能力单元：manifest（契约）+ tests + 实现。本仓**只收 manifest 与 tests**，实现经 `implementation_ref` 外链 |
| manifest | 原子的机器可读声明（本 schema 描述的对象） |
| layer | `capability` 能力原子（给所有人）/ `primitive` 实现原语（给造原子者） |
| Wire | 原子间的一条数据连接（上游 output → 下游 input） |
| Graph | 一组原子 + 一组 Wire（拼出来的"程序"，见 `docs/03`） |

## 中央仓收什么（v0 边界）

- **只收 manifest**。`atoms/*.atom.json` 是唯一权威源，`atoms/` 目录本身即索引——v0 **不维护**独立的 `registry/index.json`（检索时扫目录即可；将来出现性能/分发需要再生成）。
- 实现代码**不入库**，用 `implementation_ref` 指向作者自己的仓库/npm 包/API（见根目录 `CONTRIBUTING.md`）。
- 收录 = PR 合入 `atoms/`；合入前跑 `node scripts/validate.mjs`（零依赖，对照本 schema 规则）。

## 最小合法 manifest

```json
{
  "id": "domain.verb",
  "layer": "capability",
  "version": "1.0.0",
  "intent": "一句话说清能做什么",
  "input": { "$ref-ish / inline JSON Schema" },
  "output": { "..." }
}
```

字段说明、枚举值、示例见 schema 内注释及 `atoms/` 样例。
