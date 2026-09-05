# dsh-atom-market

> 把 **Software Atom Market（软件原子市场）** 变成 DeepSeek Harness Agent 可逛、可校验、可投稿的能力库。
> 原子 = 带类型化契约的最小能力单元：`intent + input + output`。本插件让 Agent 在商店里**选砖、读契约、验投稿、起草新原子**，而不是一遍遍生成同一段代码。

DSH plugin · Cordis · Everything is a plugin.

## 它做什么

| 工具 | 作用 | 例子 |
| --- | --- | --- |
| `atom_search` | 按意图/标签/id 逛店（公共字段） | "搜能抽 PDF 表格的原子" |
| `atom_read` | 读某原子完整 manifest（含 input/output 形状与 tests） | 拿到 `pdf.extract_tables` 的完整契约 |
| `atom_validate` | 投稿前按 spec 校验候选 manifest → valid/errors/warnings | 拦下一个缺 input 的坏投稿 |
| `atom_draft` | 由一句意图起草 `verified:false` 候选 + 投稿步骤 | 为"把金额换算成人民币"生成骨架 |

商店数据源：默认向上查找仓库根目录的 `atoms/*.atom.json`（目录即索引）；可用环境变量 `DSH_ATOM_STORE_DIR` 显式指定。

## 安装（本地 / github，不依赖发布 npm）

本包声明 `dsh.bundle.patch`（见 `cordis.patch.yml`），安装后即激活插件行，`apply(ctx)` 自动向 `ctx.tools` 注册四个工具。

- **源码安装（本地/github 路径）**：先在本目录 `npm install && npm run build`（生成 `lib/`，该目录不入 git），再在 DSH 里 `dsh plugin add <本目录路径或 github:owner/repo>`。
- **npm 安装**：`npm publish` 后 `dsh plugin add dsh-atom-market`（当前阶段暂不发布；需要被 dsh-market / awesome-dsh-plugin 收录时再发）。

## 开发

```sh
npm install
npm run build      # tsc → lib/
npm run test       # node --test，覆盖 store/validate/draft 纯逻辑
npm run demo       # 无 DSH 全链路冒烟（读本仓 atoms/）
```

## 与 atom 契约的映射

| Software Atom Market | DSH defineTool |
| --- | --- |
| `intent` | `description` |
| `input`（数据形状） | `parameters` |
| `output`（数据形状） | `output.schema`（canonical value，程序化可读） |
| manifest（黑盒契约） | `execute` 只返回 canonical JSON，人话在 `render` |
| `side_effects` | 由工具本身的实现负责（本插件是纯读/查，无副作用） |

投稿/校验/收录流程见仓库根目录 `CONTRIBUTING.md` 与 `spec/README.md`。roadmap：v0.2 `atom_assemble`（意图 → 检索 → 接线图 → 拼装期校验）。

## License

MIT © ZiFan1117
