# Contributing · 投稿一个原子

> 中央仓**只收 manifest（契约声明）**，不收实现代码。实现留在你自己的仓库/链接，靠 `implementation_ref` 指过来。
> 你不需要自己的 npm 包，不需要跑 CI——只需要一个 GitHub 账号、一个 JSON 文件、一次 PR。

## 谁可以投稿

**任何人都可以。** 封装一个原子不需要你是专家：只要你能把"输入长什么样 → 输出长什么样 → 一句话意图"写清楚，就能投稿。

## 一个原子必须满足什么

一份 Atom manifest（JSON）至少声明四件事：

| 字段 | 要求 | 反例（为什么不行） |
| --- | --- | --- |
| `intent` | 用户能**一句话说清**的意图 | "实现发邮件功能的一串底层逻辑"——那不是一个意图 |
| `input` | 输入数据的明确形状 | 不写 input，或写"任意数据" |
| `output` | 输出数据的明确形状 | 不写 output |
| 原子性 | **一个**意图一个原子 | 一个原子同时"读 PDF 又发邮件"——拆成两个 |

判定尺子：*再拆就得解释"怎么做"了 → 太小；装下两个意图 → 太大。*

另外建议：声明 `side_effects`（是否碰世界）、配 `tests` 样例（`verified:true` 必须带非空 `tests`）；若写 `description`（"怎么实现"详情），**必须按 [`spec/detail-convention.md`](./spec/detail-convention.md) 的四节结构**（它做什么/怎么实现/何时用·边界/示例，可选图），否则维护者会打回。列表只显示 `intent` 一句话，详情靠 `description` 在选中后展开（skill 式渐进披露）。实现代码放在你处，用 `implementation_ref` 指个仓库/包/API 地址。

## 流程

1. **看样例**：`atoms/` 里的几个 `.atom.json` 照着写；字段规则见 `spec/atom.schema.json` 与 `docs/03`。
2. **本地自检**（唯一必要的工具，零依赖）：

   ```sh
   node scripts/validate.mjs
   ```

   对着你加的 manifest 跑通、无 `[ERR ]` 再提交。
3. **开 PR**：fork 本仓 → 加一个 `atoms/<id>.atom.json`（`<id>` 如 `pdf.extract_tables`，文件名必须等于 `id + ".atom.json"`）→ PR。合并即收录。
   - 只是想讨论/占位某个意图，还没写 manifest → 开 **Issue**，标题建议 `[atom] 一句话意图`。
4. **收录后**：维护者复核语义（是否"一次意图"、命名是否合理）后 merge；`verified` 是否置真由维护者根据契约测试样例评估。**merge 那一刻它就被全世界（含 AI/Agent）搜得到**——`atoms/` 目录即索引，无需其它步骤。

## 实现代码去哪

- 中央仓**不收实现**，避免"托管别人的可执行代码"带来的安全与供应链包袱。
- 你的实现放自己的 GitHub 仓库/npm 包/公开 API，在 manifest 里写 `implementation_ref`。
- 本仓将来会提供"中央托管实现 + `verified` 升级制"的通道（对应 docs/03 的验证闸门与回填闭环），当前阶段不做。

## 许可

- manifest（契约声明）默认以 **MIT** 授权进入公共库，投稿即表示同意。
- 你的**实现**仍是你的：授权归你声明，本仓不碰。请勿在 manifest 里夹带密钥/凭据/私有数据。

## 何时该上 CI（写给维护者，现在还不需要）

目前投稿量小、且校验是本地一条命令，人工跑即可。出现以下任一情况再补 GitHub Actions：

1. 开始有**不认识的陌生人**持续投稿 → CI 自动跑 `node scripts/validate.mjs` 挡坏 PR；
2. `atoms/` 涨到几百个、人工难查重名/重复 → CI 加 id 唯一性与命名检查（脚本已内置）；
3. 需要自动生成对外索引/网站 → CI merge 后重建分发产物。

## 别做什么

- 不要把**实现细节**写进 intent 说明——原子是黑盒。
- 不要"顺手加选项"膨胀原子——那是 UNIX 后期每个工具都踩的坑（见 `docs/02` 缺口二）。
- 不要投稿已被收录的重复意图——先搜 `atoms/` 或跑搜索确认没有再说。
