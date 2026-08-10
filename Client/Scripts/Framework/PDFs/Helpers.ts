import type { ImageNode, PdfMake, StackNode, Table, TableCell, TableHeights, TableNode, TextNode, Width } from './Types.js'

// ── Table factory ─────────────────────────────────────────────────────────────
// The tallest `minHeight` declared on any cell in a row, or 'auto' if none set one.
function rowMinHeight(row: TableCell[]): number | 'auto' {
    let max = 0
    for (const cell of row)
        if (cell && typeof cell === 'object' && typeof cell.minHeight === 'number')
            max = Math.max(max, cell.minHeight)
    return max > 0 ? max : 'auto'
}

export function makeTable(widths: Width[], body: TableCell[][], heights?: TableHeights): TableNode {
    const tableProps: Table = {
        widths,
        body,
        dontBreakRows: true,
        // pdfmake never reads a cell's `minHeight`; row height comes solely from the table-level
        // `heights`. When the caller doesn't pass an explicit one, synthesize it per row from the
        // cells' `minHeight` so those annotations take effect (the value is a minimum — taller
        // content still grows the row).
        heights: heights ?? ((row: number) => rowMinHeight(body[row])),
    }
    return { table: tableProps, layout: SHEET_LAYOUT }
}

// ── Section factory ───────────────────────────────────────────────────────────
// Bold section title (no cell border) + table below + standard trailing gap.
export function makeSection(title: string, widths: Width[], body: TableCell[][]): StackNode {
    return {
        stack: [
            { text: title, bold: true, fontSize: FONT_SECTION_HEADER, margin: [4, 0, 0, 2] },
            makeTable(widths, body),
        ],
        margin: [0, 0, 0, BETWEEN_SECTION_GAP],
    }
}

// ── Row builders ──────────────────────────────────────────────────────────────
export function columnHeaderRow(labels: string[]): TextNode[] {
    return labels.map(label => ({ text: label, bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY }))
}

// A full-width title row that groups the data rows beneath it inside one table — used where
// several categories share a single table instead of each getting its own section. It sits at the
// same font size as `columnHeaderRow` so the two ride at the same height, but stays unbolded so
// the column labels remain the emphasized ones. pdfmake still wants the spanned columns present
// as (empty) cells.
export function groupHeaderRow(title: string, columnCount: number): TableCell[] {
    return [
        { text: title, fontSize: FONT_LABEL, fillColor: HEADER_GRAY, colSpan: columnCount },
        ...Array<TableCell>(columnCount - 1).fill({ text: '' }),
    ]
}

export function dataRow(values: string[], shaded = false): TextNode[] {
    return values.map(value => ({ text: value, fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE }))
}

export function emptyRows(count: number, columnCount: number, rowHeight = HEIGHT_STANDARD_ROW): TableCell[][] {
    return Array.from({ length: count }, (_, i) =>
        dataRow(Array<string>(columnCount).fill(''), i % 2 === 1)
            .map(cell => ({ ...cell, minHeight: rowHeight }))
    )
}

// ── Image helpers ─────────────────────────────────────────────────────────────
export async function toDataUrl(path: string | undefined): Promise<string | null> {
    if (!path) return null
    try {
        const response = await fetch(path)
        if (!response.ok) return null
        const blob = await response.blob()
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
        })
    } catch { return null }
}

export function imageCell(dataUrl: string | null, shaded = false, minHeight = HEIGHT_STANDARD_ROW): ImageNode | TextNode {
    const fill = shaded ? STRIPE_GRAY : WHITE
    if (dataUrl) return { image: dataUrl, fit: [REL_DEITY_IMAGE_SIZE, REL_DEITY_IMAGE_SIZE], alignment: 'center', fillColor: fill }
    return { text: '', fontSize: FONT_BODY, fillColor: fill, minHeight }
}

// ── Title font loader ─────────────────────────────────────────────────────────
export async function loadFonts(): Promise<boolean> {
    // pdfmake 0.3 dropped the mutable `pdfMake.vfs` / `pdfMake.fonts` dictionaries (0.2 API).
    // Register the TTFs and the font family through the 0.3 methods instead.
    const [regular, bold, italic, boldItalic] = await Promise.all([
        getBase64Font(REGULAR_FONT_PATH),
        getBase64Font(BOLD_FONT_PATH),
        getBase64Font(ITALIC_FONT_PATH),
        getBase64Font(BOLD_ITALIC_FONT_PATH),
    ])

    pdfMake.addVirtualFileSystem({
        [FONT_VFS_NAME]: regular,
        [FONT_BOLD_VFS_NAME]: bold,
        [FONT_ITALIC_VFS_NAME]: italic,
        [FONT_BOLD_ITALIC_VFS_NAME]: boldItalic,
    })
    pdfMake.addFonts({
        [FONT_ID]: {
            normal: FONT_VFS_NAME,
            bold: FONT_BOLD_VFS_NAME,
            italics: FONT_ITALIC_VFS_NAME,
            bolditalics: FONT_BOLD_ITALIC_VFS_NAME,
        },
    })
    return true
}

export async function getBase64Font(fontPath:string) {
    
    const response = await fetch(fontPath)
    if (!response.ok) throw "Could not retrieve font"

    const bytes = new Uint8Array(await response.arrayBuffer())
    let base64 = ''

    for (let i = 0; i < bytes.length; i += 512)
        base64 += String.fromCharCode(...(bytes.subarray(i, i + 512) as unknown as number[]))

    return btoa(base64)
} 

// pdfmake ships as a UMD global (wwwroot/Scripts/pdfmake.min.js, loaded via a classic
// <script> tag before the ES modules). Bind that global to a real, typed module export so
// importers get a runtime value — a `declare const` would emit nothing and break the import.
export const pdfMake = (globalThis as any).pdfMake as PdfMake