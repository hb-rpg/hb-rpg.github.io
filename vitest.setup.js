// The page loads a few libraries and config files as classic <script> tags before any ES module:
// knockout defines the global `ko`, PDFConstants defines the character sheet's layout constants.
// Modules under test read those globals, so evaluate the same files here — as scripts, so their
// top-level consts land in the global scope exactly like they do in the browser.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { runInThisContext } from 'node:vm'

const GLOBAL_SCRIPTS = [
    'wwwroot/Scripts/Framework/Knockout/knockout.js',
    'wwwroot/Scripts/WebPlugins/CharacterCreation/Configuration/PDFConstants.js',
]

for (const script of GLOBAL_SCRIPTS)
    runInThisContext(readFileSync(path.join(process.cwd(), script), 'utf8'))
