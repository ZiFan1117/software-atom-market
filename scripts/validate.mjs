import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateManifestObject } from './validate-lib.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const atomsDir = process.argv[2] || join(__dirname, '..', 'atoms')

const files = readdirSync(atomsDir).filter((f) => f.endsWith('.atom.json'))
const errors = []
const warnings = []
const idSeen = new Map()
let okCount = 0

if (files.length === 0) {
  console.log(`[WARN] ${atomsDir} 下没有 *.atom.json 文件`)
  process.exit(0)
}

for (const f of files.sort()) {
  const file = join(atomsDir, f)
  let m
  try {
    m = JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    errors.push(`${file}: JSON 解析失败（${e.message}）`)
    continue
  }
  const before = errors.length
  const res = validateManifestObject(m, file)
  errors.push(...res.errors)
  warnings.push(...res.warnings)
  if (errors.length === before) okCount += 1

  if (m && typeof m.id === 'string') {
    if (idSeen.has(m.id)) {
      errors.push(`${file}: id "${m.id}" 与 ${idSeen.get(m.id)} 重复`)
    } else {
      idSeen.set(m.id, file)
    }
    if (basename(file) !== `${m.id}.atom.json`) {
      errors.push(`${file}: 文件名必须是 <id>.atom.json，实际为 ${basename(file)}`)
    }
  }
}

for (const w of warnings) console.log(`[WARN] ${w}`)
for (const e of errors) console.log(`[ERR ] ${e}`)
console.log(`\n结果：${files.length} 个原子，通过 ${okCount}，错误 ${errors.length}，警告 ${warnings.length}`)
process.exit(errors.length > 0 ? 1 : 0)
