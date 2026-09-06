# CATALOG · 原子目录

> 由 `scripts/generate-catalog.mjs` 从 `atoms/*.atom.json` 自动生成（勿手编）。新增/修改原子后运行 `npm run generate` 并一起提交。

| id | intent | layer | side_effects | verified |
| --- | --- | --- | --- | --- |

## comms (1)

| mail.send | 发送一封邮件 | capability | email |  |

## data (1)

| data.csv_to_json | 把 CSV 文本转成 JSON 数组 | capability | none |  |

## document (1)

| pdf.extract_tables | 从 PDF 中抽出所有表格 | capability | none |  |

## money (1)

| money.currency_convert | 把金额换算成目标币种 | capability | network |  |
