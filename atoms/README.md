# Atoms · 示例原子（manifest 样例）

> 当前为 **清单级样例**：展示契约怎么写，便于投稿者照抄。它们**还没有实现与 Runner**，`verified` 一律为 `false`。
> 正式投稿流程见根目录 [CONTRIBUTING.md](../CONTRIBUTING.md)。

## 样例一览

| 文件 | 意图 | layer | side_effects |
| --- | --- | --- | --- |
| `data.csv_to_json.atom.json` | 把 CSV 文本转成 JSON 数组 | capability | none（纯计算） |
| `pdf.extract_tables.atom.json` | 从 PDF 中抽出所有表格 | capability | none |
| `money.currency_convert.atom.json` | 把金额换算成目标币种 | capability | network（需汇率） |
| `mail.send.atom.json` | 发送一封邮件 | capability | email（碰世界） |

## 三个样例想说明的对比

- `data.csv_to_json` 与 `pdf.extract_tables`：**纯计算原子** —— 可并行、可重试、无权限问题，最像 UNIX filter。
- `money.currency_convert`：看似纯计算，实际需要汇率 → 声明 `network`，让拼装器知道要联网授权。
- `mail.send`：**碰世界**的接口原子 —— 内部其实"一串函数在跑"（连接 SMTP、编码、投递），但对外只是一个意图："发这封邮件"。**实现层多碎都被封装在原子内**，这正是"最小颗粒由意图定义、不由代码行数定义"的活例。

投稿前请对照 `../spec/atom.schema.json` 校验你的 manifest。
