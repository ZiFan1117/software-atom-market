# CATALOG · 原子目录

> 自动生成（勿手编）：中央层来自 `atoms/`，社区层来自 `registry/index.json`（`npm run discover -- --write`）。有改动手跑 `npm run generate` 并提交。

## Central · 中央策展 (4)

| id | intent | category | side_effects | verified |
| --- | --- | --- | --- | --- |
| data.csv_to_json | 把 CSV 文本转成 JSON 数组 | data | none |  |
| mail.send | 发送一封邮件 | comms | email |  |
| money.currency_convert | 把金额换算成目标币种 | money | network |  |
| pdf.extract_tables | 从 PDF 中抽出所有表格 | document | none |  |

## Community · 联邦发现（topic: software-atom）(26)

| id | intent | category | source |
| --- | --- | --- | --- |
| atom.draft | 由一句意图生成 atom 文档骨架（含空四节正文占位） | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| atom.gate.parse | 解析原子文档：YAML frontmatter + 正文（或 legacy JSON manifest）→ meta + body | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| atom.gate.validate | 机器闸校验原子：字段白名单/枚举/必填 + 正文四节四图硬检 → valid/errors/warnings | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| atom.registry.search | 在原子指针集里按 query 检索 id+intent+tags+when_to_use（可过滤 layer/category/source） | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| bazidiy.assistant_preset | 定义“手串定制助手”角色：严格流程、硬约束与话术 | ai | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.calculate_chart | 把公历生辰与时辰排成四柱八字并统计五行 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.design_memory | 按会话保存/恢复一次最终设计方案（save/load 两方法） | storage | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.generate_design | 解析并校验完整珠序后定稿最终手串方案 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.infer_verdict | 判定日主旺衰并推导喜用神与忌神 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.kb.bead_catalog | 提供手串珠子库本体：珠实例、变体、五行归属、直径、颜色与图片 | data | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.kb.style_library | 提供手串款式库本体：款式结构、槽位、允许变体/直径约束与隔片径映射 | data | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.kb.wuxing_ganzhi | 提供五行、天干、地支、节气的概念与个体及生克关系本体 | data | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.parse_slots | 把“珠名:直径,珠名:直径”珠序串解析消歧为槽位序列 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.propose_designs | 一链出方案：旺衰→喜忌→筛珠→款式求解→给喜忌珠与可选方案 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.rules.consistency | 自检全部旺衰×喜忌组合不存在喜忌交集冲突 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.rules.naming | 定义珠子命名规则：必须全称、禁止缩写、同名变体优先非隔片 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.rules.strength | 依据月令与日主关系判定日主旺衰（得令/得生） | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.rules.verdict_choice | 依据旺衰给出喜用神与忌神选择规则 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.select_beads | 按喜忌从珠子库筛出 suitable 与 unsuitable（隔片豁免） | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.solve_styles | 按款式槽位约束枚举组合，求腕围下可行方案与不可行款式原因 | other | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.ui.bead_editor | 可视化逐颗换珠与调直径的编辑器 | web | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| bazidiy.ui.svg_render | 把定稿槽位序列渲染成手串 SVG 卡片 | web | [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy) |
| dsh.atom_market.plugin | 把逛/读/验/稿四个商店动作注册进 DSH：分装成可对话的商店插件（框架原子） | ai | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| github.fetch_file | 从 GitHub contents API 读取仓库某文件原文（base64 解码为 UTF-8） | code | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| store.read_atom | 按指针回源读 manifest/atom 文档并解析（.atom.md 与旧 .atom.json 均支持） | data | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
| store.read_index | 拉取并缓存 registry/index.json 指针集（或本地 DSH_ATOM_STORE_DIR atoms 目录） | data | [ZiFan1117/dsh-atom-market](https://github.com/ZiFan1117/dsh-atom-market) |
