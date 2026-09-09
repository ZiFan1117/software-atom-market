# CATALOG · 原子目录

> 自动生成（勿手编）：中央层来自 `atoms/`，社区层来自 `registry/index.json`（`npm run discover -- --write`）。有改动手跑 `npm run generate` 并提交。

## Central · 中央策展 (21)

| id | intent | category | side_effects | verified |
| --- | --- | --- | --- | --- |
| bazidiy.assistant_preset | 定义“手串定制助手”角色：严格流程、硬约束与话术 | ai | none | ✅ |
| bazidiy.calculate_chart | 把公历生辰与时辰排成四柱八字并统计五行 | other | none | ✅ |
| bazidiy.derive | 统一确定性推导：生日+时辰 → 八字/旺衰/喜忌 → 候选材质 → 各款式逐槽方案，附 R1–R14 证据链 | other | none | ✅ |
| bazidiy.design_memory | 按会话保存/恢复一次最终设计方案（save/load 两方法） | storage | db | ✅ |
| bazidiy.generate_design | 解析并校验完整珠序后定稿最终手串方案 | other | none | ✅ |
| bazidiy.infer_verdict | 判定日主旺衰并推导喜用神与忌神 | other | none | ✅ |
| bazidiy.kb | BaziDIY 领域本体与数据：五行/干支/节气 + 珠料×变体=珠 + 款式槽位（Apache Ossie 合并篇） | data | none | ✅ |
| bazidiy.parse_slots | 把“珠名:直径,珠名:直径”珠序串解析消歧为槽位序列 | other | none | ✅ |
| bazidiy.plugin | 把 7 个确定性工具与三项装配能力（珠子静态路由 / 客户端 toolview / 运行时 invariant）注册进 dsh 宿主 | ai | none | ✅ |
| bazidiy.propose_designs | 一链出方案：旺衰→喜忌→筛珠→款式求解→给喜忌珠与可选方案 | other | none | ✅ |
| bazidiy.rules | 五行判据与约束：生克关系遍历、旺衰、喜忌、全组合自检、R1–R14 规则清单与封闭世界守卫 | other | none | ✅ |
| bazidiy.rules.naming | 定义珠子命名规则：必须全称、禁止缩写、同名变体优先非隔片 | other | none | ✅ |
| bazidiy.select_beads | 按喜忌从珠子库筛出 suitable 与 unsuitable（隔片豁免） | other | none | ✅ |
| bazidiy.solve_styles | 按款式槽位约束枚举组合，求腕围下可行方案与不可行款式原因 | other | none | ✅ |
| bazidiy.styles | 从款式库构建 Style/Position/Constraint，并提供候选过滤与约束校验器 | other | none | ✅ |
| bazidiy.ui.bead_editor | 可视化逐颗换珠与调直径的编辑器 | web | none | ✅ |
| bazidiy.ui.svg_render | 把定稿槽位序列渲染成手串 SVG 卡片 | web | none | ✅ |
| data.csv_to_json | 把 CSV 文本转成 JSON 数组 | data | none |  |
| mail.send | 发送一封邮件 | comms | email |  |
| money.currency_convert | 把金额换算成目标币种 | money | network |  |
| pdf.extract_tables | 从 PDF 中抽出所有表格 | document | none |  |

## Community · 联邦发现（topic: software-atom）(8)

| id | intent | category | source |
| --- | --- | --- | --- |
| atom.draft | 由一句意图生成 atom 文档骨架（含空四节正文占位） | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| atom.gate.parse | 解析原子文档：YAML frontmatter + 正文（或 legacy JSON manifest）→ meta + body | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| atom.gate.validate | 机器闸校验原子：字段白名单/枚举/必填 + 正文四节四图硬检 → valid/errors/warnings | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| atom.registry.search | 在原子指针集里按 query 检索 id+intent+tags+when_to_use（可过滤 layer/category/source） | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| dsh.atom_market.plugin | 把逛/读/验/稿四个商店动作注册进 DSH：分装成可对话的商店插件（框架原子） | ai | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| github.fetch_file | 从 GitHub contents API 读取仓库某文件原文（base64 解码为 UTF-8） | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| store.read_atom | 按指针回源读 manifest/atom 文档并解析（.atom.md 与旧 .atom.json 均支持） | data | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| store.read_index | 拉取并缓存 registry/index.json 指针集（或本地 DSH_ATOM_STORE_DIR atoms 目录） | data | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
