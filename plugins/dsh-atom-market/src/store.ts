import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'

export interface AtomPublicFields {
  id: string
  intent: string
  layer: string
  side_effects?: string
  version: string
  verified?: boolean
  tags?: string[]
}

export interface AtomRecord extends AtomPublicFields {
  file: string
  manifest: Record<string, unknown>
}

const ATOM_SUFFIX = '.atom.json'

export function isStoreRoot(dir: string): boolean {
  const atomsDir = join(dir, 'atoms')
  if (!existsSync(atomsDir) || !statSync(atomsDir).isDirectory()) return false
  try {
    return readdirSync(atomsDir).some((f) => f.endsWith(ATOM_SUFFIX))
  } catch {
    return false
  }
}

export function findStoreRoot(start = process.cwd()): string | null {
  let dir = start
  for (;;) {
    if (isStoreRoot(dir)) return dir
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

export function readAtoms(root: string): AtomRecord[] {
  const atomsDir = join(root, 'atoms')
  const files = readdirSync(atomsDir)
    .filter((f) => f.endsWith(ATOM_SUFFIX))
    .sort()
  const records: AtomRecord[] = []
  for (const f of files) {
    try {
      const manifest = JSON.parse(readFileSync(join(atomsDir, f), 'utf8')) as Record<string, unknown>
      if (typeof manifest.id !== 'string') continue
      records.push({
        id: manifest.id,
        intent: typeof manifest.intent === 'string' ? manifest.intent : '',
        layer: typeof manifest.layer === 'string' ? manifest.layer : '',
        side_effects: typeof manifest.side_effects === 'string' ? manifest.side_effects : undefined,
        version: typeof manifest.version === 'string' ? manifest.version : '',
        verified: typeof manifest.verified === 'boolean' ? manifest.verified : undefined,
        tags: Array.isArray(manifest.tags) ? (manifest.tags as string[]) : undefined,
        file: join(atomsDir, f),
        manifest,
      })
    } catch {
      // skip unparsable entries; validate tool reports them by reading raw text
    }
  }
  return records
}

export interface ListOptions {
  query?: string
  layer?: string
  verified?: boolean
  limit?: number
}

export function searchAtoms(records: AtomRecord[], opts: ListOptions): AtomPublicFields[] {
  const q = (opts.query ?? '').trim().toLowerCase()
  const filtered = records.filter((r) => {
    if (opts.layer && r.layer !== opts.layer) return false
    if (opts.verified !== undefined && r.verified !== opts.verified) return false
    if (!q) return true
    const hay = [r.id, r.intent, (r.tags ?? []).join(' ')].join(' ').toLowerCase()
    return q.split(/\s+/).every((part) => hay.includes(part))
  })
  filtered.sort((a, b) => a.id.localeCompare(b.id))
  const limit = Math.max(1, Math.floor(opts.limit ?? 20))
  return filtered.slice(0, limit).map((r) => ({
    id: r.id,
    intent: r.intent,
    layer: r.layer,
    side_effects: r.side_effects,
    version: r.version,
    verified: r.verified,
    tags: r.tags,
  }))
}

export function readAtom(records: AtomRecord[], id: string): AtomRecord | undefined {
  return records.find((r) => r.id === id)
}
