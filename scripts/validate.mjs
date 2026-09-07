import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateManifestObject, validateAtomDocumentText } from './validate-lib.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const atomsDir = process.argv[2] || join(__dirname, '..', 'atoms')

const files = readdirSync(atomsDir).filter((f) => f.endsWith('.atom.json') || f.endsWith('.atom.md')).sort()
const errors = []
const warnings = []
const idSeen = new Map()
let okCount = 0

if (files.length === 0) {
  console.log(`[WARN] ${atomsDir} 下没有 *.atom.json / *.atom.md 文件`)
  process.exit(0)
}

for (const f of files) {
  const file = join(atomsDir, f)
  const ext = extname(f)
  let m = null
  let res = null
  if (ext === '.md') {
    res = validateAtomDocumentText(readFileSync(file, 'utf8'), file)
    m = res.meta ?? {}
  } else {
    try {
      m = JSON.parse(readFileSync(file, 'utf8'))
    } catch (e) {
      errors.push(`${file}: JSON 解析失败（${e.message}）`)
      continue
    }
    res = validateManifestObject(m, file)
  }
  errors.push(...res.errors)
  warnings.push(...res.warnings)
  if (res.valid) okCount += 1

  if (m && typeof m.id === 'string') {
    if (idSeen.has(m.id)) {
      errors.push(`${file}: id "${m.id}" 与 ${idSeen.get(m.id)} 重复`)
    } else {
      idSeen.set(m.id, file)
    }
    if (basename(file) !== `${m.id}.atom${ext}`) {
      errors.push(`${file}: 文件名必须是 <id>.atom${ext}，实际为 ${basename(file)}`)
    }
  }
}

for (const w of warnings) console.log(`[WARN] ${w}`)
for (const e of errors) console.log(`[ERR ] ${e}`)
console.log(`\n结果：${files.length} 个原子，通过 ${okCount}，错误 ${errors.length}，警告 ${warnings.length}`)
process.exit(errors.length > 0 ? 1 : 0)
