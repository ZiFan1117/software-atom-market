---
id: money.currency_convert
layer: capability
version: 1.0.0
intent: "把金额换算成目标币种"
when_to_use: "按当前汇率做一次性换算（发票、报表、预算）。"
language: zh-CN
tags: ["money","currency","fx"]
category: money
side_effects: network
lang: python
author: ZiFan1117
verified: false
implementation_ref: "central sample manifest (no runner); federated implementation target: money.currency_convert"
input: {"type":"object","required":["amount","from","to"],"properties":{"amount":{"type":"number","description":"金额（正数）"},"from":{"type":"string","description":"ISO 4217 源币种，如 USD"},"to":{"type":"string","description":"ISO 4217 目标币种，如 CNY"},"rate_source":{"type":"string","description":"可选，指定汇率源；默认官方实时汇率","default":"auto"}}}
output: {"type":"object","required":["converted","rate","rate_date"],"properties":{"converted":{"type":"number"},"rate":{"type":"number"},"rate_date":{"type":"string","format":"date"}}}
tests: [{"input":{"amount":100,"from":"USD","to":"CNY"},"expect":{"type":"object","required":["converted","rate"]}}]
---
## 它做什么

按实时汇率把一笔金额从源币种换算成目标币种，返回换算结果、所用汇率与汇率日期。

## 怎么实现

数据流转：
```mermaid
flowchart LR
  A[amount/from/to] --> B[校验入参] --> C[取汇率] --> D[amount * rate] --> E[结果+rate_date]
```

模块分解：
```mermaid
classDiagram
  class Validator { check(amount, from, to) }
  class RateService { fetch(from,to) }
  class Converter { convert(amount,rate) }
  Validator --> RateService --> Converter
```

交互时序（需联网取汇率）：
```mermaid
sequenceDiagram
  participant U as 用户/上游
  participant A as money.currency_convert
  participant FX as 汇率源
  U->>A: amount/from/to
  A->>FX: 请求汇率
  FX-->>A: rate + date
  A-->>U: converted + rate
```

调用图：
```mermaid
graph TD
  main --> validateInput
  main --> fetchRate
  fetchRate --> normalizeRate
  main --> compute
```

## 何时用 / 何时不用

- 适用：按当前汇率做一次性换算（发票、报表、预算）。
- 不适用：需要离线可用的固定汇率（可用 rate_source 指自有源）；需要历史汇率回测时需另接行情原子。

## 示例

输入：`{amount:100, from:USD, to:CNY}` → 输出：`{converted:<金额>, rate:<汇率>, rate_date:<日期>}`
