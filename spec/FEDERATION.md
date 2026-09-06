# Federation · 联邦聚合约定（topic 自动发现）

> 让 atom 作者**不提 PR 也进市场**：在自己的公开仓放 manifest，打上约定 topic，我们的发现器自动聚合。
> 机器闸：发现即校验，**校验通过 = 收录，无人工评审**。详见 [`SPEC.md`](../SPEC.md) 与 [`CONTRIBUTING.md`](../CONTRIBUTING.md)。

## 作者参与（三步，零 PR）

1. 在你的公开仓库放 manifest：
   - 单原子：仓库根目录放 `atom.json`
   - 多原子：仓库里建 `atoms/` 目录，放 `*.atom.json`
2. manifest 按 [`atom.schema.json`](./atom.schema.json) 写；`description` 必含四节 + 四张 Mermaid 图（见 [`detail-convention.md`](./detail-convention.md)）
3. 给仓库打 topic：**`software-atom`**

可选自检（提交前先本地过一遍机器闸，见 [`SPEC.md`](../SPEC.md) §3）：
```sh
curl -O https://raw.githubusercontent.com/ZiFan1117/software-atom-market/main/scripts/validate-lib.mjs
curl -O https://raw.githubusercontent.com/ZiFan1117/software-atom-market/main/scripts/validate-single.mjs
node validate-single.mjs atom.json
```

完成。发现器定期搜索 `topic:software-atom`，拉取并校验 manifest，通过者进入 `registry/index.json`（纯指针）与 `CATALOG.md`。

## 约定细则

| 项 | 约定 |
| --- | --- |
| 聚合 topic | `software-atom`（仓库必须公开） |
| manifest 位置 | 根目录 `atom.json`，或 `atoms/*.atom.json` |
| 校验 | 字段 + `description` 四节四图，机器硬检（与中央一致） |
| 收录 | 机器通过 = 收录；不过 = 记录错误、不入目录 |
| 内容 | 只存指针（repo/path/摘要），他人 manifest/代码不进本仓 |
| 更新 | 发现器定时重跑（`federation.yml` 每日 cron）；作者 push 新版本自动反映 |

## 通道对比

| | 联邦（topic 自动） | 中央（本仓 atoms/） |
| --- | --- | --- |
| 门槛 | 最低：自己仓 + topic | PR 一个 manifest |
| 生效 | 下一个发现周期（每日） | PR 机器闸绿即合并 |
| 适用 | 任何人快速发布 | 想直接进中央目录维护者手头 |

## 实现

- 发现器：`scripts/discover.mjs` → 写 `registry/index.json`
- 定时：`.github/workflows/federation.yml`（每日 03:00 UTC）
- 本地跑：`npm run discover -- --write`
