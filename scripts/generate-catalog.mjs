import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const atomsDir = join(root, 'atoms')
const outFile = join(root, 'CATALOG.md')

const files = readdirSync(atomsDir).filter((f) => f.endsWith('.atom.json')).sort()
const groups = new Map()

for (const f of files) {
  try {
    const m = JSON.parse(readFileSync(join(atomsDir, f), 'utf8'))
    if (typeof m.id !== 'string') continue
    const cat = typeof m.category === 'string' ? m.category : 'other'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat).push({
      id: m.id,
      intent: m.intent ?? '',
      layer: m.layer ?? '',
      verified: m.verified === true,
      side_effects: m.side_effects ?? 'none',
      tags: Array.isArray(m.tags) ? m.tags.join(', ') : '',
    })
  } catch {
    // skip broken file; validate.mjs reports it
  }
}

const rows = (items) => items
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((a) => `| ${a.id} | ${a.intent} | ${a.layer} | ${a.side_effects} | ${a.verified ? '✅' : ''} |`)
  .join('\n')

let md = `# CATALOG · 原子目录\n\n> 由 \`scripts/generate-catalog.mjs\` 从 \`atoms/*.atom.json\` 自动生成（勿手编）。新增/修改原子后运行 \`npm run generate\` 并一起提交。\n\n| id | intent | layer | side_effects | verified |\n| --- | --- | --- | --- | --- |\n`

for (const [cat, items] of [...groups.entries()].sort()) {
  md += `\n## ${cat} (${items.length})\n\n${rows(items)}\n`
}

writeFileSync(outFile, md, 'utf8')
console.log(`CATALOG.md written: ${files.length} atoms in ${groups.size} categories`)
