// ── Table factory ─────────────────────────────────────────────────────────────
export function makeTable(widths, body, heights) {
    const tableProps = { widths, body, dontBreakRows: true };
    if (heights)
        tableProps.heights = heights;
    return { table: tableProps, layout: SHEET_LAYOUT };
}
// ── Section factory ───────────────────────────────────────────────────────────
// Bold section title (no cell border) + table below + standard trailing gap.
export function makeSection(title, widths, body) {
    return {
        stack: [
            { text: title, bold: true, fontSize: FONT_SECTION_HEADER, margin: [4, 0, 0, 2] },
            makeTable(widths, body),
        ],
        margin: [0, 0, 0, BETWEEN_SECTION_GAP],
    };
}
// ── Row builders ──────────────────────────────────────────────────────────────
export function columnHeaderRow(labels) {
    return labels.map(label => ({ text: label, bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY }));
}
export function dataRow(values, shaded = false) {
    return values.map(value => ({ text: value, fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE }));
}
export function emptyRows(count, columnCount, rowHeight = HEIGHT_STANDARD_ROW) {
    return Array.from({ length: count }, (_, i) => dataRow(Array(columnCount).fill(''), i % 2 === 1)
        .map(cell => ({ ...cell, minHeight: rowHeight })));
}
// ── Image helpers ─────────────────────────────────────────────────────────────
export async function toDataUrl(path) {
    if (!path)
        return null;
    try {
        const response = await fetch(path);
        if (!response.ok)
            return null;
        const blob = await response.blob();
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
    catch {
        return null;
    }
}
export function imageCell(dataUrl, shaded = false, minHeight = HEIGHT_STANDARD_ROW) {
    const fill = shaded ? STRIPE_GRAY : WHITE;
    if (dataUrl)
        return { image: dataUrl, fit: [REL_DEITY_IMAGE_SIZE, REL_DEITY_IMAGE_SIZE], alignment: 'center', fillColor: fill };
    return { text: '', fontSize: FONT_BODY, fillColor: fill, minHeight };
}
// ── Title font loader ─────────────────────────────────────────────────────────
export async function loadFonts() {
    // pdfmake 0.3 dropped the mutable `pdfMake.vfs` / `pdfMake.fonts` dictionaries (0.2 API).
    // Register the TTFs and the font family through the 0.3 methods instead.
    const [regular, bold, italic, boldItalic] = await Promise.all([
        getBase64Font(REGULAR_FONT_PATH),
        getBase64Font(BOLD_FONT_PATH),
        getBase64Font(ITALIC_FONT_PATH),
        getBase64Font(BOLD_ITALIC_FONT_PATH),
    ]);
    pdfMake.addVirtualFileSystem({
        [FONT_VFS_NAME]: regular,
        [FONT_BOLD_VFS_NAME]: bold,
        [FONT_ITALIC_VFS_NAME]: italic,
        [FONT_BOLD_ITALIC_VFS_NAME]: boldItalic,
    });
    pdfMake.addFonts({
        [FONT_ID]: {
            normal: FONT_VFS_NAME,
            bold: FONT_BOLD_VFS_NAME,
            italics: FONT_ITALIC_VFS_NAME,
            bolditalics: FONT_BOLD_ITALIC_VFS_NAME,
        },
    });
    return true;
}
export async function getBase64Font(fontPath) {
    const response = await fetch(fontPath);
    if (!response.ok)
        throw "Could not retrieve font";
    const bytes = new Uint8Array(await response.arrayBuffer());
    let base64 = '';
    for (let i = 0; i < bytes.length; i += 512)
        base64 += String.fromCharCode(...bytes.subarray(i, i + 512));
    return btoa(base64);
}
// pdfmake ships as a UMD global (wwwroot/Scripts/pdfmake.min.js, loaded via a classic
// <script> tag before the ES modules). Bind that global to a real, typed module export so
// importers get a runtime value — a `declare const` would emit nothing and break the import.
export const pdfMake = globalThis.pdfMake;
