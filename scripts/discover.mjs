import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateManifestObject } from './validate-lib.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const TOPIC = 'software-atom'
const WRITE = process.argv.includes('--write')
const token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || ''
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'software-atom-market-discovery' }
if (token) headers.Authorization = `Bearer ${token}`

const pointerOf = (repo, path, m) => ({
  repo: repo.full_name,
  path,
  id: m.id,
  intent: m.intent,
  layer: m.layer,
  category: m.category ?? 'other',
  side_effects: m.side_effects ?? 'none',
  version: m.version ?? '',
  verified: false,
  updated_at: repo.pushed_at,
})

async function fetchManifest(fullName, path) {
  const res = await fetch(`https://api.github.com/repos/${fullName}/contents/${path}`, { headers })
  if (!res.ok) return null
  const j = await res.json()
  if (!j.content) return null
  try {
    return JSON.parse(Buffer.from(j.content, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

const search = await fetch(
  `https://api.github.com/search/repositories?q=topic:${TOPIC}+archived:false&per_page=50`,
  { headers },
)
if (!search.ok) {
  console.error(`[ERR ] search failed: HTTP ${search.status}`)
  process.exit(1)
}
const { total_count, items = [] } = await search.json()
console.log(`topic:${TOPIC} -> ${total_count} repos`)

const index = []
const problems = []
let repos = 0

for (const repo of items) {
  repos += 1
  const found = []

  const rootManifest = await fetchManifest(repo.full_name, 'atom.json')
  if (rootManifest) found.push({ path: 'atom.json', m: rootManifest })

  const dirRes = await fetch(`https://api.github.com/repos/${repo.full_name}/contents/atoms`, { headers })
  if (dirRes.ok) {
    const entries = await dirRes.json()
    if (Array.isArray(entries)) {
      for (const e of entries.filter((x) => x.type === 'file' && x.name.endsWith('.atom.json'))) {
        const m = await fetchManifest(repo.full_name, `atoms/${e.name}`)
        if (m) found.push({ path: `atoms/${e.name}`, m })
      }
    }
  }

  for (const { path, m } of found) {
    const label = `${repo.full_name}@${path}`
    const res = validateManifestObject(m, label)
    if (res.valid) {
      index.push(pointerOf(repo, path, m))
    } else {
      problems.push(`${label}: ${res.errors.join(' | ')}`)
    }
  }
}

console.log(`repos scanned: ${repos}; valid atoms indexed: ${index.length}; rejected: ${problems.length}`)
for (const p of problems) console.log(`[REJECT] ${p}`)
for (const it of index) console.log(`  + ${it.id}  (${it.repo})  "${String(it.intent).slice(0, 40)}"`)

if (WRITE) {
  const outDir = join(root, 'registry')
  mkdirSync(outDir, { recursive: true })
  const out = { generated_at: new Date().toISOString(), topic: TOPIC, count: index.length, atoms: index }
  writeFileSync(join(outDir, 'index.json'), JSON.stringify(out, null, 2), 'utf8')
  console.log(`registry/index.json written (${index.length} pointers)`)
}
