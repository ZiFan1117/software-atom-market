# Atoms · 示例原子（manifest 样例）

> 当前为 **清单级样例**：展示契约怎么写，便于投稿者照抄。它们**还没有实现与 Runner**，`verified` 一律为 `false`。
> 正式投稿流程见根目录 [CONTRIBUTING.md](../CONTRIBUTING.md)。

## 样例一览

| 文件 | 意图 | layer | side_effects |
| --- | --- | --- | --- |
| `data.csv_to_json.atom.md` | 把 CSV 文本转成 JSON 数组 | capability | none（纯计算） |
| `pdf.extract_tables.atom.md` | 从 PDF 中抽出所有表格 | capability | none |
| `money.currency_convert.atom.md` | 把金额换算成目标币种 | capability | network（需汇率） |
| `mail.send.atom.md` | 发送一封邮件 | capability | email（碰世界） |

> 渐进披露示例：上表的"意图"列就是 `intent`（列表/搜索层，一句话）；`pdf.extract_tables.atom.md` 的正文本体演示了详情层（选中后用 `atom_read` 展开整篇正文）。

## 三个样例想说明的对比

- `data.csv_to_json` 与 `pdf.extract_tables`：**纯计算原子** —— 可并行、可重试、无权限问题，最像 UNIX filter。
- `money.currency_convert`：看似纯计算，实际需要汇率 → 声明 `network`，让拼装器知道要联网授权。
- `mail.send`：**碰世界**的接口原子 —— 内部其实"一串函数在跑"（连接 SMTP、编码、投递），但对外只是一个意图："发这封邮件"。**实现层多碎都被封装在原子内**，这正是"最小颗粒由意图定义、不由代码行数定义"的活例。

投稿前请对照 `../spec/atom.schema.json` 校验你的 manifest。

## BaziDIY 系列 · 八字五行手串定制（来源 [ZiFan1117/bazidiy](https://github.com/ZiFan1117/bazidiy)）

> 知识本体 → 规则 → 能力 → 呈现/角色的确定性原子集：八字排盘、喜用神判定、珠子匹配、款式求解、定稿出图与会话存取，全部确定性无 LLM。

| 原子 | intent | layer | verified |
| --- | --- | --- | --- |
| `bazidiy.assistant_preset.atom.md` | 定义“手串定制助手”角色：严格流程、硬约束与话术 | capability | false |
| `bazidiy.calculate_chart.atom.md` | 把公历生辰与时辰排成四柱八字并统计五行 | capability | true |
| `bazidiy.design_memory.atom.md` | 按会话保存/恢复一次最终设计方案（save/load 两方法） | capability | false |
| `bazidiy.generate_design.atom.md` | 解析并校验完整珠序后定稿最终手串方案 | capability | true |
| `bazidiy.infer_verdict.atom.md` | 判定日主旺衰并推导喜用神与忌神 | capability | true |
| `bazidiy.kb.atom.md` | BaziDIY 领域本体与数据：五行/干支/节气 + 珠料×变体=珠 + 款式槽位（Apache Ossie 合并篇） | primitive | false |
| `bazidiy.parse_slots.atom.md` | 把“珠名:直径,珠名:直径”珠序串解析消歧为槽位序列 | capability | true |
| `bazidiy.propose_designs.atom.md` | 一链出方案：旺衰→喜忌→筛珠→款式求解→给喜忌珠与可选方案 | capability | true |
| `bazidiy.rules.consistency.atom.md` | 自检全部旺衰×喜忌组合不存在喜忌交集冲突 | primitive | true |
| `bazidiy.rules.naming.atom.md` | 定义珠子命名规则：必须全称、禁止缩写、同名变体优先非隔片 | primitive | true |
| `bazidiy.rules.relations.atom.md` | 五行关系访问层：加载生克关系并沿关系取后继（共享工具箱，单一定义） | primitive | false |
| `bazidiy.rules.strength.atom.md` | 依据月令与日主关系判定日主旺衰（得令/得生） | primitive | true |
| `bazidiy.rules.verdict_choice.atom.md` | 依据旺衰给出喜用神与忌神选择规则 | primitive | true |
| `bazidiy.select_beads.atom.md` | 按喜忌从珠子库筛出 suitable 与 unsuitable（隔片豁免） | capability | true |
| `bazidiy.solve_styles.atom.md` | 按款式槽位约束枚举组合，求腕围下可行方案与不可行款式原因 | capability | true |
| `bazidiy.ui.bead_editor.atom.md` | 可视化逐颗换珠与调直径的编辑器 | capability | false |
| `bazidiy.ui.svg_render.atom.md` | 把定稿槽位序列渲染成手串 SVG 卡片 | capability | false |
