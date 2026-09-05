import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const atomsDir = process.argv[2] || join(__dirname, '..', 'atoms')

const LAYERS = ['capability', 'primitive']
const SIDE_EFFECTS = ['none', 'network', 'file', 'email', 'db', 'process']
const ALLOWED_TOP_KEYS = new Set([
  'id', 'layer', 'version', 'intent', 'description', 'tags', 'input', 'output',
  'side_effects', 'lang', 'author', 'verified', 'implementation_ref', 'deps', 'tests',
])
const ID_RE = /^[a-z0-9]+(\.[a-z0-9_]+)+$/
const VER_RE = /^\d+\.\d+\.\d+$/

function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v) }

function checkManifest(file, m, errors, warnings) {
  const where = (k) => `${file}: ${k}`
  if (!isObj(m)) { errors.push(`${file}: 顶层必须是对象`); return }

  for (const key of Object.keys(m)) {
    if (!ALLOWED_TOP_KEYS.has(key)) errors.push(`${where(key)}: 不在 spec 允许的顶层键内（additionalProperties=false）`)
  }

  const req = ['id', 'layer', 'version', 'intent', 'input', 'output']
  for (const key of req) {
    if (!(key in m)) errors.push(`${where(key)}: 缺少必填字段`)
  }

  if (typeof m.id !== 'string' || !ID_RE.test(m.id)) {
    errors.push(`${where('id')}: 必须匹配 ^[a-z0-9]+(\\.[a-z0-9_]+)+$（如 pdf.extract_tables）`)
  } else if (basename(file) !== `${m.id}.atom.json`) {
    errors.push(`${file}: 文件名必须是 <id>.atom.json，实际为 ${basename(file)}`)
  }

  if (!LAYERS.includes(m.layer)) errors.push(`${where('layer')}: 必须是 ${LAYERS.join(' / ')} 之一`)

  if (typeof m.version !== 'string' || !VER_RE.test(m.version)) {
    errors.push(`${where('version')}: 必须匹配语义化版本 ^\\d+\\.\\d+\\.\\d+$`)
  }

  if (typeof m.intent !== 'string' || m.intent.trim().length < 2) {
    errors.push(`${where('intent')}: 必须是一句≥2字的意图说明`)
  }

  for (const ioKey of ['input', 'output']) {
    const io = m[ioKey]
    if (!isObj(io) || Object.keys(io).length === 0) {
      errors.push(`${where(ioKey)}: 必须是非空对象（数据形状声明）`)
    } else if (!(io.$ref) && !(typeof io.type === 'string')) {
      const hasShape = ['type', 'properties', 'items', 'enum', 'required', '$defs'].some((k) => k in io)
      if (!hasShape) warnings.push(`${where(ioKey)}: 看起来既无 type 也无结构字段，可能是过弱的数据声明`)
    }
  }

  if ('side_effects' in m) {
    if (!SIDE_EFFECTS.includes(m.side_effects)) {
      errors.push(`${where('side_effects')}: 必须是 ${SIDE_EFFECTS.join(' / ')} 之一`)
    }
  }

  if ('tags' in m) {
    if (!Array.isArray(m.tags) || m.tags.some((t) => typeof t !== 'string')) {
      errors.push(`${where('tags')}: 必须是字符串数组`)
    }
  }

  if ('deps' in m && (!Array.isArray(m.deps) || m.deps.some((d) => typeof d !== 'string'))) {
    errors.push(`${where('deps')}: 必须是字符串数组`)
  }

  for (const k of ['lang', 'author', 'implementation_ref', 'description']) {
    if (k in m && typeof m[k] !== 'string') errors.push(`${where(k)}: 必须是字符串`)
  }

  if ('verified' in m && typeof m.verified !== 'boolean') {
    errors.push(`${where('verified')}: 必须是布尔值`)
  }

  if ('tests' in m && m.tests !== undefined) {
    if (!Array.isArray(m.tests)) {
      errors.push(`${where('tests')}: 必须是数组`)
    } else {
      m.tests.forEach((t, i) => {
        if (!isObj(t) || !('input' in t) || !('expect' in t)) {
          errors.push(`${where(`tests[${i}]`)}: 每个测试必须有 input 与 expect`)
        }
      })
    }
  }

  if (m.verified === true) {
    if (!Array.isArray(m.tests) || m.tests.length === 0) {
      errors.push(`${where('verified')}: verified=true 必须有非空的 tests 契约样例`)
    }
  } else if (Array.isArray(m.tests) && m.tests.length === 0) {
    warnings.push(`${file}: tests 为空数组（等价未配），建议删除该字段`)
  }
}

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
  checkManifest(file, m, errors, warnings)
  if (errors.length === before) okCount += 1

  if (m && typeof m.id === 'string') {
    if (idSeen.has(m.id)) {
      errors.push(`${file}: id "${m.id}" 与 ${idSeen.get(m.id)} 重复`)
    } else {
      idSeen.set(m.id, file)
    }
  }
}

for (const w of warnings) console.log(`[WARN] ${w}`)
for (const e of errors) console.log(`[ERR ] ${e}`)
console.log(`\n结果：${files.length} 个原子，通过 ${okCount}，错误 ${errors.length}，警告 ${warnings.length}`)
process.exit(errors.length > 0 ? 1 : 0)
