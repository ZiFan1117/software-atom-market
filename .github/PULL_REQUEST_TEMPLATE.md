<!-- 机器闸投稿清单（合并条件 = validate 绿，无人工评审） -->

- [ ] 新增/修改 `atoms/<id>.atom.json`（仅 manifest；实现代码不入库）
- [ ] 本地 `node scripts/validate.mjs` 无 `[ERR ]`（PR 上的 Action 会再跑一次）
- [ ] `description` 必填且含：四节标题（它做什么/怎么实现/何时用/示例）+ 四张 Mermaid 图（flowchart/classDiagram/sequenceDiagram/graph）
- [ ] 改动 `atoms/` 后已运行 `npm run generate` 并提交 `CATALOG.md`
- [ ] 不含密钥/凭据/私有数据
