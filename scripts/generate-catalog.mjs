import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const atomsDir = join(root, 'atoms')
const indexFile = join(root, 'registry', 'index.json')
const outFile = join(root, 'CATALOG.md')

function row(a) {
  return `| ${a.id} | ${String(a.intent).replace(/\|/g, '\\|')} | ${a.category ?? 'other'} | ${a.side_effects ?? 'none'} | ${a.verified ? '✅' : ''} |`
}

const central = []
const centralFiles = readdirSync(atomsDir).filter((f) => f.endsWith('.atom.json')).sort()
for (const f of centralFiles) {
  try {
    const m = JSON.parse(readFileSync(join(atomsDir, f), 'utf8'))
    if (typeof m.id !== 'string') continue
    central.push({ id: m.id, intent: m.intent ?? '', category: m.category ?? 'other', side_effects: m.side_effects ?? 'none', verified: m.verified === true })
  } catch {
    // validate.mjs reports
  }
}

const centralIds = new Set(central.map((a) => a.id))
const community = []
if (existsSync(indexFile)) {
  try {
    const idx = JSON.parse(readFileSync(indexFile, 'utf8'))
    for (const a of idx.atoms ?? []) {
      if (typeof a.id !== 'string') continue
      if (centralIds.has(a.id)) continue
      community.push({ ...a, source: a.repo })
    }
  } catch {
    // ignore broken index; rerun discover
  }
}

const sortFn = (a, b) => a.id.localeCompare(b.id)
let md = `# CATALOG · 原子目录\n\n> 自动生成（勿手编）：中央层来自 \`atoms/\`，社区层来自 \`registry/index.json\`（\`npm run discover -- --write\`）。有改动手跑 \`npm run generate\` 并提交。\n\n## Central · 中央策展 (${central.length})\n\n| id | intent | category | side_effects | verified |\n| --- | --- | --- | --- | --- |\n`
md += central.sort(sortFn).map(row).join('\n') + '\n'
md += `\n## Community · 联邦发现（topic: software-atom）(${community.length})\n\n| id | intent | category | source |\n| --- | --- | --- | --- |\n`
md += community.sort(sortFn).map((a) => `| ${a.id} | ${String(a.intent).replace(/\|/g, '\\|')} | ${a.category ?? 'other'} | [${a.source}](https://github.com/${a.source}) |`).join('\n') + '\n'

writeFileSync(outFile, md, 'utf8')
console.log(`CATALOG.md written: central ${central.length}, community ${community.length}`)
