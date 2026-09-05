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
├─ CONTRIBUTING.md   如何投稿一个原子（任何人都能）
├─ docs/             立项与研究文档（论点 · 文献 · 设计 · 研究空白）
│  ├─ 01_核心论点与判据.md
│  ├─ 02_文献地图与论证证据.md
│  ├─ 03_技术设计_契约_商店_组装层.md
│  └─ 04_研究空白与实验设想.md
├─ spec/             契约规范（机器可读，v0.1 草案）
│  └─ atom.schema.json
└─ atoms/            示例原子（manifest 样例，供投稿参考）
```

## Status · 状态

- **阶段**：立项/规范草案（v0.1）。契约 schema 与示例原子为**清单级样例，尚无实现与 Runner**。
- **路线图**：见 `docs/04_研究空白与实验设想.md` §6；技术闭环见 `docs/03` §8 MVP。
- 中文文档为主，英文摘要为辅（正在完善）。

## Contribute · 参与

欢迎任何人投稿"你解决的问题"——把能力封装成一个 Atom 提交上来，让全世界复用，而不是各自重写。

投稿前请读 [CONTRIBUTING.md](./CONTRIBUTING.md) 与 [契约规范 spec/](./spec/README.md)。

## Roadmap preview · 路线预告

1. 契约规范定稿（含类型化拼装期校验）
2. Registry + Runner MVP（Python）
3. LLM 装配工：意图 → 检索 → 接线 → 校验 → 执行
4. 对照实验：粒度 × 人群 × AI 组装成功率（`docs/04`）

## License

MIT © ZiFan1117. 投稿原子默认以 MIT 授权进入公共库（详见 CONTRIBUTING）。
