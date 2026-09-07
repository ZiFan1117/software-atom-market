export const LAYERS = ['capability', 'primitive']
export const SIDE_EFFECTS = ['none', 'network', 'file', 'email', 'db', 'process']
export const CATEGORIES = ['data', 'document', 'money', 'comms', 'ai', 'web', 'storage', 'code', 'automation', 'other']
export const ALLOWED_TOP_KEYS = new Set([
  'id', 'layer', 'version', 'intent', 'description', 'tags', 'category', 'input', 'output',
  'side_effects', 'lang', 'author', 'verified', 'implementation_ref', 'deps', 'tests',
  'when_to_use', 'language',
])
const ID_RE = /^[a-z0-9]+(\.[a-z0-9_]+)+$/
const VER_RE = /^\d+\.\d+\.\d+$/
const HEADINGS = ['它做什么', '怎么实现', '何时用', '示例']

function isObj(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

export function extractFences(text) {
  const out = []
  const re = /```([^\n`]*)\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(text)) !== null) {
    out.push({ lang: m[1].trim(), body: m[2] })
  }
  return out
}

export function checkDescription(desc, context, errors, warnings) {
  if (typeof desc !== 'string' || desc.trim().length === 0) {
    errors.push(`${context}: description 必填（Markdown，四节+四图）`)
    return
  }
  for (const h of HEADINGS) {
    if (!new RegExp(`^##[^\\n]*${h}`, 'm').test(desc)) {
      errors.push(`${context}: description 缺少章节 “${h}”`)
    }
  }
  const fences = extractFences(desc)
  if (fences.length === 0) {
    errors.push(`${context}: description 没有任何代码块（需要 4 张 Mermaid 图）`)
    return
  }
  const hasMermaid = (p) => fences.some((f) => f.lang.includes('mermaid') && p.test(f.body))
  if (!hasMermaid(/\bflowchart\b/)) errors.push(`${context}: description 缺少数据流转图（mermaid flowchart）`)
  if (!hasMermaid(/\bclassDiagram\b|\bblock-beta\b/)) errors.push(`${context}: description 缺少接口/模块分解图（mermaid classDiagram / block-beta）`)
  if (!hasMermaid(/\bsequenceDiagram\b/)) errors.push(`${context}: description 缺少交互时序图（mermaid sequenceDiagram）`)
  const hasCall = fences.some((f) => /\bdigraph\b/.test(f.body) || /graph\s+(TD|LR|RL|BT)\b/.test(f.body))
  if (!hasCall) errors.push(`${context}: description 缺少调用图（digraph 或 mermaid graph TD/LR/RL/BT）`)
}

/** 解析整份 atom 文档（v0.3）：YAML frontmatter（元数据）+ Markdown 正文（= description）。
 *  frontmatter 子集：每行 `key: value`；值若是数组/对象须为 JSON 内联（JSON ⊆ YAML），标量支持引号/数字/bool/null。 */
export function parseAtomDocument(text, context = 'atom document') {
  const s = String(text).replace(/\r\n/g, '\n')
  const mHead = s.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/)
  const errors = []
  const warnings = []
  if (!mHead) {
    return { valid: false, meta: {}, body: '', errors: [`${context}: 必须以 YAML frontmatter 开头（--- … ---）`], warnings }
  }
  const body = s.slice(mHead[0].length).replace(/^\n+/, '')
  const meta = {}
  for (const line of mHead[1].split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!mm) { warnings.push(`${context}: 忽略无法解析的 frontmatter 行：${JSON.stringify(line)}`); continue }
    const key = mm[1]
    const val = mm[2].trim()
    let out
    if (val === '') {
      out = undefined
    } else if (val.startsWith('{') || val.startsWith('[')) {
      try { out = JSON.parse(val) } catch { errors.push(`${context}: frontmatter 键 ${key} 的数组/对象须为合法 JSON 内联值`); continue }
    } else if (/^"(.*)"$/.test(val)) {
      out = val.slice(1, -1)
    } else if (/^'(.*)'$/.test(val)) {
      out = val.slice(1, -1)
    } else if (val === 'true') {
      out = true
    } else if (val === 'false') {
      out = false
    } else if (val === 'null') {
      out = null
    } else if (/^-?\d+(\.\d+)?$/.test(val)) {
      out = Number(val)
    } else {
      out = val
    }
    meta[key] = out
  }
  return { valid: errors.length === 0, meta, body, errors, warnings }
}

/** 校验整份 atom 文档：frontmatter(除 description 外的 manifest 字段) + 正文四节四图。 */
export function validateAtomDocumentText(text, context = 'atom document') {
  const { valid, meta, body, errors, warnings } = parseAtomDocument(text, context)
  if (!valid) return { valid, errors, warnings }
  if (body.trim().length === 0) errors.push(`${context}: frontmatter 之后缺少 Markdown 正文（四节+四图）`)
  const manifest = { ...meta, description: body }
  const res = validateManifestObject(manifest, context)
  errors.push(...res.errors)
  warnings.push(...res.warnings)
  return { valid: errors.length === 0, errors, warnings }
}

export function validateManifestObject(m, context = 'manifest') {
  const errors = []
  const warnings = []
  const where = (k) => `${context}: ${k}`

  if (!isObj(m)) return { valid: false, errors: [`${context}: 顶层必须是 JSON 对象`], warnings: [] }

  for (const key of Object.keys(m)) {
    if (!ALLOWED_TOP_KEYS.has(key)) errors.push(`${where(key)}: 不在 spec 允许的顶层键内（additionalProperties=false）`)
  }

  const required = ['id', 'layer', 'version', 'intent', 'description', 'input', 'output']
  for (const key of required) {
    if (!(key in m)) errors.push(`${where(key)}: 缺少必填字段`)
  }

  if (typeof m.id !== 'string' || !ID_RE.test(m.id)) {
    errors.push(`${where('id')}: 必须匹配 ^[a-z0-9]+(\\.[a-z0-9_]+)+$（如 pdf.extract_tables）`)
  }

  if (!LAYERS.includes(m.layer)) errors.push(`${where('layer')}: 必须是 ${LAYERS.join(' / ')} 之一`)

  if (typeof m.version !== 'string' || !VER_RE.test(m.version)) {
    errors.push(`${where('version')}: 必须匹配语义化版本 ^\\d+\\.\\d+\\.\\d+$`)
  }

  if (typeof m.intent !== 'string' || m.intent.trim().length < 2) {
    errors.push(`${where('intent')}: 必须是一句≥2字的意图说明`)
  }

  checkDescription(m.description, context, errors, warnings)

  for (const ioKey of ['input', 'output']) {
    const io = m[ioKey]
    if (!isObj(io) || Object.keys(io).length === 0) {
      errors.push(`${where(ioKey)}: 必须是非空对象（数据形状声明）`)
    } else if (!('$ref' in io) && typeof io.type !== 'string') {
      const hasShape = ['type', 'properties', 'items', 'enum', 'required', '$defs'].some((k) => k in io)
      if (!hasShape) warnings.push(`${where(ioKey)}: 看起来既无 type 也无结构字段，可能是过弱的数据声明`)
    }
  }

  if ('side_effects' in m && !SIDE_EFFECTS.includes(m.side_effects)) {
    errors.push(`${where('side_effects')}: 必须是 ${SIDE_EFFECTS.join(' / ')} 之一`)
  }

  if ('category' in m && !CATEGORIES.includes(m.category)) {
    errors.push(`${where('category')}: 必须是 ${CATEGORIES.join(' / ')} 之一`)
  }

  if ('tags' in m && (!Array.isArray(m.tags) || m.tags.some((t) => typeof t !== 'string'))) {
    errors.push(`${where('tags')}: 必须是字符串数组`)
  }

  if ('deps' in m && (!Array.isArray(m.deps) || m.deps.some((d) => typeof d !== 'string'))) {
    errors.push(`${where('deps')}: 必须是字符串数组`)
  }

  for (const k of ['lang', 'author', 'implementation_ref', 'when_to_use', 'language']) {
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
    warnings.push(`${context}: tests 为空数组（等价未配），建议删除该字段`)
  }

  return { valid: errors.length === 0, errors, warnings }
}

export function validateManifestText(text, context = 'manifest') {
  let m
  try {
    m = JSON.parse(text)
  } catch (e) {
    return { valid: false, errors: [`${context}: JSON 解析失败（${e instanceof Error ? e.message : String(e)}）`], warnings: [] }
  }
  return validateManifestObject(m, context)
}
