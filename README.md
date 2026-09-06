# Software Atom Market · 软件原子市场

> 让 AI 与世界共享的**最小能力单元（Atom）**：不再让 AI 一遍遍逐行生成代码，而是从一座全球共享、带类型化契约的原子商店里**选砖、接线、组装**。

> A shared marketplace of **software atoms** — composable, verified, minimal capability units. Stop asking AI to regenerate the same code a thousand times; instead let it pick, wire, and assemble from one shared, contract-typed store.

## Why · 为什么

让大模型逐行"生成"代码有三个系统性问题：

1. **即兴发挥，质量不可控** — 同一件事每次生成结果都不一样，bug 随规模放大，难以审查维护。
2. **全世界重复造同一段代码** — 每次生成都是无记忆的重新发明；代码克隆研究已证明人类生态本就在大量复制。
3. **编程壁垒没有消失** — 使用者的价值被困在"描述实现"，而不是"表达意图"。

软件原子市场的回答：

- 能力以 **Atom（原子）** 为单位沉淀：黑盒封装，接口统一为 **意图(intent) + 输入数据 + 输出数据**；
- **造原子**（少数程序员/验证者）与**拼原子**（所有人 + AI）分离；
- AI 的角色从"代码生成器"变成"选砖 + 接线的胶水"——它产出**接线图**，不产出实现代码。

## The minimal unit · 最小颗粒是什么

不是更小的代码函数，而是**与用户一次意图对齐、带统一类型化契约、可独立验证的黑盒能力块**。

判定尺子：*再拆就要解释"怎么做"了 = 太小；一个原子装下两个意图 = 太大。*

组合自由度来自**接线图拓扑**，可靠性来自**契约与验证**，都不来自碎片化程度。

> 知识谱系一句话：这是 UNIX 管道哲学的重生——把 stdin/stdout 的弱类型文本流升级为**可机器校验、可被大模型检索的类型化契约**，让大模型当那个过去只有专家能当的"胶水"。

## What's here · 目录

```
software-atom-market/
├─ README.md         本页：定位 + 速览
├─ LICENSE           MIT
├─ CONTRIBUTING.md   如何投稿一个原子（任何人都能，只收 manifest）
├─ package.json      本仓工具脚本入口（零 npm 依赖）
├─ scripts/
│  └─ validate.mjs   投稿把关：对照 spec 校验 atoms/（node scripts/validate.mjs）
├─ docs/             立项与研究文档（叙事 · 论点 · 文献 · 设计 · 竞扫 · 空白 · 本体笔记）
│  ├─ 00_对外叙事_我们要说的几件事.md
│  ├─ 01_核心论点与判据.md
│  ├─ 02_文献地图与论证证据.md
│  ├─ 03_技术设计_契约_商店_组装层.md
│  ├─ 04_研究空白与实验设想.md
│  ├─ 05_竞争扫描与空白定位.md
│  ├─ 06_本体建模与图纸层.md
│  └─ 07_当前问题与开放困惑.md
├─ spec/             契约规范（机器可读，v0.1 草案）
│  └─ atom.schema.json
└─ atoms/            原子库：atoms/ 目录即索引，*.atom.json 即商品
```

> DSH 消费端插件已独立成仓：[`ZiFan1117/dsh-atom-market`](https://github.com/ZiFan1117/dsh-atom-market)（`dsh-plugin` 社区插件，v0.1.1）——本仓只负责**商店本身**（契约 + 原子 + 收录）。

## 用起来什么样（零配置）

- **给 Agent/人用商店**：把 [`dsh-atom-market`](https://github.com/ZiFan1117/dsh-atom-market) 装进 DeepSeek Harness（`dsh plugin add github:ZiFan1117/dsh-atom-market`，npm 已放弃——GitHub 直装，`lib/` 随仓无需构建），Agent 即可用 `atom_search / atom_read / atom_validate / atom_draft` 逛店、读契约、验投稿、起草新原子。**插件默认直连本 GitHub 商店（`atoms/` 目录即索引），任何人装上即用、无需本地路径或其它配置**；可选覆盖 `DSH_ATOM_STORE_DIR`(离线)、`DSH_ATOM_STORE_OWNER/REPO/BRANCH`(换源)、`GITHUB_PERSONAL_ACCESS_TOKEN`(免限流)。
- **给人投稿**：见 [CONTRIBUTING.md](./CONTRIBUTING.md) —— PR 加一个 JSON，merge 即收录。商店永远指向这个仓库的最新提交。

## Not reinventing the wheel · 与既有生态的分工

- 万级插件的 **DeepSeek Harness 生态**（"一切皆插件"）与 **MCP registry**、Claude Skills、Composio 等证明：共享底座可行、AI 工具层成熟——但它们都是**开发者向**：无语言无关的意图契约、无"验证后上架"闸门、无面向非程序员的组装层。
- **本项目补的是那个标准层**：intent + 数据契约、capability/primitive 双层货架、"tests → verified"上架闸门、组合回填闭环。
- 完整竞争扫描与差距表见 [`docs/05`](./docs/05_竞争扫描与空白定位.md)。

## Status · 状态

- **阶段：商店闭环 v0.1** —— 可投稿（PR 收 `atoms/*.atom.json`）、可把关（`node scripts/validate.mjs`）、可检索（`atoms/` 目录即索引）。DSH 消费端插件已独立为社区插件 [`dsh-atom-market`](https://github.com/ZiFan1117/dsh-atom-market)（v0.1.1，默认直连本 GitHub 商店）。实现一律走 `implementation_ref` 外链，本仓不收代码。
- **本轮明确不做**：npm 发布/CI、独立索引文件、商业化后台。
- 中文文档为主，英文摘要为辅（正在完善）。

## Contribute · 参与

欢迎任何人投稿"你解决的问题"——封装成一个 Atom（一个 JSON）提交上来，让全世界（含 AI/Agent）复用，而不是各自重写。

投稿前请读 [CONTRIBUTING.md](./CONTRIBUTING.md) 与 [契约规范 spec/](./spec/README.md)。

## Roadmap preview · 路线预告

1. ~~商店闭环 v0.1~~（已完成：spec + 校验脚本 + 投稿流程）
2. ~~DSH 插件 `dsh-atom-market`~~（v0.1.1，已独立成仓 [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market)，按 DSH 社区插件方式维护；npm 发布已放弃，走 GitHub 直装）
3. 拼装器 `atom_assemble`：意图 → 检索 → 接线 → 拼装期校验（docs/03 §8）
4. 上架 dsh 市场（dsh-market / awesome-dsh-plugin，缓步）
5. 对照实验：粒度 × 人群 × AI 组装成功率（`docs/04`）

## License

MIT © ZiFan1117. 投稿原子默认以 MIT 授权进入公共库（详见 CONTRIBUTING）。
