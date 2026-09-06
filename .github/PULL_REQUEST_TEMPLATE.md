<!-- 感谢投稿。提交前快速自查（仿 DSH 官方收录清单） -->

- [ ] 我新增了**一个文件** `atoms/<id>.atom.json`（唯一投稿物；实现代码不入库）
- [ ] 本地跑过 `node scripts/validate.mjs`，无 `[ERR ]`
- [ ] `id` 形如 `domain.verb`，文件名 = `id + ".atom.json"`，且全局唯一
- [ ] `category` 取值合法（data / document / money / comms / ai / web / storage / code / automation / other）
- [ ] `intent` 是一句"实现什么"（一次意图一个原子）
- [ ] 若含 `description`：按 `spec/detail-convention.md` 四节写（它做什么/怎么实现/何时用·边界/示例）
- [ ] 不夹带密钥/凭据/私有数据；默认以 MIT 授权进入公共库
- [ ] 已运行 `npm run generate` 并提交更新后的 `CATALOG.md`
