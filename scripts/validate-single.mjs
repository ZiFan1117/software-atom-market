import { readFileSync } from 'node:fs'
import { validateManifestObject } from './validate-lib.mjs'

const file = process.argv[2]
let text
let label

if (!file) {
  text = readFileSync(0, 'utf8')
  label = 'stdin'
} else {
  text = readFileSync(file, 'utf8')
  label = file
}

let m
try {
  m = JSON.parse(text)
} catch (e) {
  console.log(`[ERR ] ${label}: JSON 解析失败（${e instanceof Error ? e.message : String(e)}）`)
  process.exit(1)
}

const res = validateManifestObject(m, label)
for (const w of res.warnings) console.log(`[WARN] ${w}`)
for (const e of res.errors) console.log(`[ERR ] ${e}`)
console.log(res.valid ? `OK ${label} 通过机器校验` : `FAIL ${label} 未通过（${res.errors.length} 错误）`)
process.exit(res.valid ? 0 : 1)
