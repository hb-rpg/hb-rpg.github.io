// Zero-dependency static server for the PDF test harness.
//
//   node Tools/serve-harness.mjs   then open  http://localhost:5173/
//
// Serves the compiled output in ./wwwroot as the web root (so absolute paths like
// /Scripts/... and /Fonts/... resolve), and maps "/" to the harness page authored in
// ./Client/HTML/pdf-harness.html so it doesn't depend on the build's copy step.
// Run `npx tsc` first so the harness TypeScript is compiled into wwwroot/Scripts.

import http from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const webRoot  = path.join(repoRoot, 'wwwroot')
const harnessPage = path.join(repoRoot, 'Client', 'HTML', 'pdf-harness.html')
const PORT = 5173

const MIME = {
    '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
    '.html': 'text/html', '.json': 'application/json', '.map': 'application/json',
    '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.pdf': 'application/pdf',
}

async function send(res, filePath, status = 200) {
    const body = await fs.readFile(filePath)
    res.writeHead(status, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream' })
    res.end(body)
}

http.createServer(async (req, res) => {
    try {
        const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])

        if (urlPath === '/' || urlPath === '/pdf-harness.html') {
            return await send(res, harnessPage)
        }

        // Resolve within webRoot and reject path traversal.
        const resolved = path.join(webRoot, path.normalize(urlPath))
        if (!resolved.startsWith(webRoot)) {
            res.writeHead(403); return res.end('Forbidden')
        }
        await send(res, resolved)
    } catch (err) {
        if (err && err.code === 'ENOENT') { res.writeHead(404); return res.end('Not found') }
        res.writeHead(500); res.end(String(err))
    }
}).listen(PORT, () => console.log(`PDF harness: http://localhost:${PORT}/`))
