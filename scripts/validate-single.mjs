import { readFileSync } from 'node:fs'
import { validateManifestObject, validateAtomDocumentText } from './validate-lib.mjs'

const file = process.argv[2]
const text = file ? readFileSync(file, 'utf8') : readFileSync(0, 'utf8')
const label = file || 'stdin'

let res
if (file && file.endsWith('.json')) {
  try {
    res = validateManifestObject(JSON.parse(text), label)
  } catch (e) {
    res = { valid: false, errors: [`${label}: JSON 解析失败（${e instanceof Error ? e.message : String(e)}）`], warnings: [] }
  }
} else {
  // .atom.md 文档优先；stdin/无后缀则自动识别：以 --- 开头按文档，否则按 JSON
  const isDocLike = text.replace(/\r\n/g, '\n').trimStart().startsWith('---')
  if (isDocLike) {
    res = validateAtomDocumentText(text, label)
  } else {
    try {
      res = validateManifestObject(JSON.parse(text), label)
    } catch (e) {
      res = validateAtomDocumentText(text, label)
    }
  }
}

for (const w of res.warnings) console.log(`[WARN] ${w}`)
for (const e of res.errors) console.log(`[ERR ] ${e}`)
console.log(res.valid ? `OK ${label} 通过机器校验` : `FAIL ${label} 未通过（${res.errors.length} 错误）`)
process.exit(res.valid ? 0 : 1)
