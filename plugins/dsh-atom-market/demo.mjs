import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findStoreRoot, readAtoms, searchAtoms, readAtom } from './lib/store.js'
import { validateManifestText } from './lib/validate.js'
import { draftAtom } from './lib/draft.js'

const root = findStoreRoot() ?? process.cwd()
const out = {}
out.storeRoot = root
out.searchPdf = searchAtoms(readAtoms(root), { query: 'pdf 表格', limit: 3 })
const rec = readAtom(readAtoms(root), 'pdf.extract_tables')
out.readAtom = rec ? { found: true, id: rec.id, intent: rec.intent } : { found: false }
const good = validateManifestText(readFileSync(join(root, 'atoms', 'mail.send.atom.json'), 'utf8'))
out.validateGood = { valid: good.valid, errors: good.errors.length }
const bad = validateManifestText(JSON.stringify({ id: 'x', intent: 'i' }))
out.validateBad = { valid: bad.valid, errors: bad.errors.slice(0, 3) }
out.draft = draftAtom({ intent: '把金额换算成人民币', lang: 'python', tags: ['money'] })
console.log(JSON.stringify(out, null, 2))
