---
id: mail.send
layer: capability
version: 1.0.0
intent: "发送一封邮件"
when_to_use: "通知、报表送达、带附件的自动邮件。"
language: zh-CN
tags: ["mail","email","notify"]
category: comms
side_effects: email
lang: python
author: example
verified: false
implementation_ref: "example: python package; runner 尚未实现"
input: {"type":"object","required":["to","subject"],"properties":{"to":{"type":"array","items":{"type":"string","format":"email"},"description":"收件人"},"cc":{"type":"array","items":{"type":"string","format":"email"}},"subject":{"type":"string"},"body_text":{"type":"string","description":"纯文本正文"},"body_html":{"type":"string","description":"可选，HTML 正文"},"attachments":{"type":"array","items":{"type":"object","required":["filename","content"],"properties":{"filename":{"type":"string"},"content":{"type":"string","contentEncoding":"base64","description":"文件内容"},"mime":{"type":"string"}}}},"account_ref":{"type":"string","description":"发件账号引用（密钥不进 manifest）"}}}
output: {"type":"object","required":["message_id"],"properties":{"message_id":{"type":"string"},"sent_at":{"type":"string","format":"date-time"}}}
tests: [{"input":{"to":["you@example.com"],"subject":"hi","body_text":"hello"},"expect":{"type":"object","required":["message_id"]}}]
---
## 它做什么

把 to/cc/subject/正文与可选附件交给发件账号，完成一封邮件投递并返回 message_id。

## 怎么实现

数据流转：
```mermaid
flowchart LR
  A[to/subject/body] --> B[组装 MIME] --> C[连接 SMTP] --> D[投递] --> E[message_id]
```

模块分解：
```mermaid
classDiagram
  class MimeBuilder { build(mail) }
  class SmtpClient { send(msg) }
  class Attachment { encode(file) }
  MimeBuilder --> Attachment
  SmtpClient --> MimeBuilder
```

交互时序（碰世界：email）：
```mermaid
sequenceDiagram
  participant U as 用户/上游
  participant A as mail.send
  participant S as SMTP
  U->>A: to/subject/body/attachments
  A->>S: MAIL FROM / RCPT / DATA
  S-->>A: 250 OK
  A-->>U: message_id + sent_at
```

调用图：
```mermaid
graph TD
  send --> buildMime
  send --> connectSmtp
  buildMime --> encodeAttachment
  connectSmtp --> deliver
```

## 何时用 / 何时不用

- 适用：通知、报表送达、带附件的自动邮件。
- 不适用：需要阅读收件箱（那是另一类能力）；大批量营销邮件请走专门服务（否则易被限流）。

## 示例

输入：`{to:[you@example.com], subject:hi, body_text:hello}` → 输出：`{message_id:<id>, sent_at:<时间>}`
