import { flattenAndCombineSelectionPackage } from './UpdateUtility.js';
import { NameUtility } from './NameUtility.js';
// ── Font sizes ─────────────────────────────────────────────────────────────────
const FONT_TITLE = 16; // "HEARTBREAKER" header
const FONT_SECTION_HEADER = 9; // section titles (LANGUAGES, SKILLS, etc.) — bold, standalone
const FONT_LABEL = 6; // column headers and small labels
const FONT_BODY = 8; // cell text
const FONT_SMALL = 5; // secondary labels
// ── Page layout ───────────────────────────────────────────────────────────────
const PAGE_MARGIN = 36;
const PAGE_MARGIN_TOP = 54; // taller top margin accommodates the header bar
const HEADER_TEXT_TOP = 10;
const HEADER_VERSION_TOP = 16;
// ── Spacing ───────────────────────────────────────────────────────────────────
const COLUMN_GAP = 8;
const SECTION_GAP = 4; // tight internal spacing (e.g. between name field + ability table)
const BETWEEN_SECTION_GAP = 12; // standard gap after every major section
// ── Cell heights ──────────────────────────────────────────────────────────────
const HEIGHT_IDENTITY_FIELD = 12;
const HEIGHT_STAT_ROW = 13;
const HEIGHT_STANDARD_ROW = 16;
const HEIGHT_WRITING_ROW = 40; // tall rows for hand-writing (narrative, notes)
const HEIGHT_SPELL_NOTES = 10;
const HEIGHT_STAT_ROW_MAIN = 29;
// Portrait height is derived so its single-row table (H + 1pt padding×2 + 1pt borders) equals
// the 7-row stat/ability table (7×(H+2pt padding) + 4pt borders = 7H+18). Solving: H_p = 7×H_s + 15.
const HEIGHT_PORTRAIT = 7 * HEIGHT_STAT_ROW_MAIN + 15;
// ── Row counts ────────────────────────────────────────────────────────────────
const WEAPON_ROWS = 12;
const GEAR_ROWS = 6;
const LANGUAGE_ROWS = 5;
const SKILL_ROWS = 7;
const EDGE_ROWS = 7;
const DRAWBACK_ROWS = 3;
const SPELL_ROWS = 7;
const SPELL_COLS = 7;
const RELIGION_ROWS = 3;
const NOTE_ROWS = 8;
// ── Column widths: top identity/stats/portrait section ───────────────────────
// Usable column space = 540 content - 2×8 gaps = 524pt → 30/30/40 split
const IDENTITY_COL_WIDTH = 157; // 30 %
const STAT_COL_WIDTH = 157; // 30 %
// portrait: width '*' → takes remaining ~40 % (≈ 210pt)
// ── Column widths: ability scores (inside identity column) ───────────────────
const ABILITY_SCORE_COL_WIDTH = 22;
const ABILITY_DAMAGE_COL_WIDTH = 22;
// ── Column widths: gear tables ───────────────────────────────────────────────
const GEAR_NAME_COL_WIDTH = 160;
const GEAR_AMOUNT_COL_WIDTH = 40;
// ── Column widths: languages ─────────────────────────────────────────────────
const LANG_NAME_COL_WIDTH = 80;
const LANG_SPOKEN_COL_WIDTH = 40;
const LANG_READWRITE_COL_WIDTH = 40;
// ── Column widths: skills, edges, drawbacks ──────────────────────────────────
const LIST_NAME_COL_WIDTH = 100;
// ── Column widths: spells ────────────────────────────────────────────────────
const SPELL_NAME_COL_WIDTH = 90;
const SPELL_LEVEL_COL_WIDTH = 25;
const SPELL_CAST_COL_WIDTH = 50;
const SPELL_RANGE_COL_WIDTH = 35;
const SPELL_TEST_COL_WIDTH = 35;
// ── Column widths: entanglements ─────────────────────────────────────────────
const ENT_LABEL_COL_WIDTH = 115;
// ── Column widths: religion ──────────────────────────────────────────────────
const REL_NAME_COL_WIDTH = 90;
const REL_DEITY_IMAGE_SIZE = 35;
const REL_IMAGE_COL_WIDTH = 40;
// ── Unified reference column width (~8 chars at body font) ───────────────────
const REFERENCE_COL_WIDTH = 40;
// ── Title font ────────────────────────────────────────────────────────────────
// Drop a TTF font file at /Fonts/title.ttf to use a custom DnD-style typeface.
// Falls back to Roboto Bold if the file is not found.
const FONT_VFS_NAME = 'LucidaSans.ttf';
const FONT_BOLD_VFS_NAME = 'LucidaSansBold.ttf';
const REGULAR_FONT_PATH = '/Fonts/LucidaSans/LSANS.ttf';
const BOLD_FONT_PATH = '/Fonts/LucidaSans/LSANSD.ttf';
const FONT_ID = 'LucidaSans';
// ── Colors ────────────────────────────────────────────────────────────────────
const HEADER_GRAY = '#D8D8D8'; // column header rows
const STRIPE_GRAY = '#E8E8E8'; // alternating data row tint (slightly darker than before)
const WHITE = '#FFFFFF';
const ENTITY_LABEL_COLOR = '#D8D8D8'; // shared by entanglement label column and religion rank cells
// ── Table layout (thin borders, tight padding) ────────────────────────────────
const SHEET_LAYOUT = {
    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    hLineColor: () => '#000000',
    vLineColor: () => '#000000',
    paddingLeft: () => 2,
    paddingRight: () => 2,
    paddingTop: () => 1,
    paddingBottom: () => 1,
};
// ── Table factory ─────────────────────────────────────────────────────────────
function makeTable(widths, body, heights) {
    const tableProps = { widths, body, dontBreakRows: true };
    if (heights)
        tableProps.heights = heights;
    return { table: tableProps, layout: SHEET_LAYOUT };
}
// ── Section factory ───────────────────────────────────────────────────────────
// Bold section title (no cell border) + table below + standard trailing gap.
function makeSection(title, widths, body) {
    return {
        stack: [
            { text: title, bold: true, fontSize: FONT_SECTION_HEADER, margin: [4, 0, 0, 2] },
            makeTable(widths, body),
        ],
        margin: [0, 0, 0, BETWEEN_SECTION_GAP],
    };
}
// ── Row builders ──────────────────────────────────────────────────────────────
function columnHeaderRow(labels) {
    return labels.map(label => ({ text: label, bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY }));
}
function dataRow(values, shaded = false) {
    return values.map(value => ({ text: value, fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE }));
}
function emptyRows(count, columnCount, rowHeight = HEIGHT_STANDARD_ROW) {
    return Array.from({ length: count }, (_, i) => dataRow(Array(columnCount).fill(''), i % 2 === 1)
        .map(cell => ({ ...cell, minHeight: rowHeight })));
}
// ── Image helpers ─────────────────────────────────────────────────────────────
async function toDataUrl(path) {
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
function imageCell(dataUrl, shaded = false, minHeight = HEIGHT_STANDARD_ROW) {
    const fill = shaded ? STRIPE_GRAY : WHITE;
    if (dataUrl)
        return { image: dataUrl, fit: [REL_DEITY_IMAGE_SIZE, REL_DEITY_IMAGE_SIZE], alignment: 'center', fillColor: fill };
    return { text: '', fontSize: FONT_BODY, fillColor: fill, minHeight };
}
// ── Title font loader ─────────────────────────────────────────────────────────
async function loadFonts() {
    pdfMake.vfs[FONT_VFS_NAME] = await getBase64Font(REGULAR_FONT_PATH);
    pdfMake.vfs[FONT_BOLD_VFS_NAME] = await getBase64Font(BOLD_FONT_PATH);
    pdfMake.fonts[FONT_ID] = { normal: FONT_VFS_NAME, bold: FONT_BOLD_VFS_NAME };
    return true;
}
async function getBase64Font(fontPath) {
    const response = await fetch(fontPath);
    if (!response.ok)
        throw "Could not retrieve font";
    const bytes = new Uint8Array(await response.arrayBuffer());
    let base64 = '';
    for (let i = 0; i < bytes.length; i += 512)
        base64 += String.fromCharCode(...bytes.subarray(i, i + 512));
    return btoa(base64);
}
// ── Page 1: Identity, Abilities, Portrait, Stats, Gear ───────────────────────
function buildPage1(data) {
    const items = flattenAndCombineSelectionPackage(data.ItemSelections(), data);
    const trinkets = flattenAndCombineSelectionPackage(data.TrinketSelections(), data);
    const allItems = [...items, ...trinkets];
    const abilityNames = ['STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA'];
    const abilityValues = [
        data.Abilities().Strength,
        data.Abilities().Dexterity,
        data.Abilities().Constitution,
        data.Abilities().Intelligence,
        data.Abilities().Wisdom,
        data.Abilities().Charisma,
    ];
    const statRows = [
        { label: 'ANCESTRY', value: data.Race() },
        { label: 'BACKGROUND', value: data.Job() },
        { label: 'LEVEL', value: '' }, // user fills in manually
        { label: 'CLASS', value: data.Class() },
        { label: 'HIT DICE', value: String(data.HitDie()) },
        { label: 'HIT POINTS', value: String(data.HitPoints()) },
        { label: 'DAMAGE', value: '' },
    ];
    const abilityScoreTable = {
        ...makeTable(['*', ABILITY_SCORE_COL_WIDTH, ABILITY_DAMAGE_COL_WIDTH], [
            [
                { text: '', bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY, minHeight: HEIGHT_STAT_ROW_MAIN },
                { text: 'SCORE', bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY, alignment: 'center', minHeight: HEIGHT_STAT_ROW_MAIN },
                { text: 'DAMAGE', bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY, alignment: 'center', minHeight: HEIGHT_STAT_ROW_MAIN },
            ],
            ...abilityNames.map((name, i) => [
                { text: name, bold: true, fontSize: FONT_LABEL, fillColor: ENTITY_LABEL_COLOR, minHeight: HEIGHT_STAT_ROW_MAIN },
                { text: abilityValues[i] !== undefined ? String(abilityValues[i]) : '', fontSize: FONT_BODY, minHeight: HEIGHT_STAT_ROW_MAIN },
                { text: '', fontSize: FONT_BODY, minHeight: HEIGHT_STAT_ROW_MAIN },
            ]),
        ]),
        margin: [0, 0, 8, 0],
    };
    return [
        // ── Top section: 30 % identity | 30 % stats | 40 % portrait ──
        {
            columnGap: COLUMN_GAP,
            margin: [0, 0, 0, BETWEEN_SECTION_GAP],
            columns: [
                // Left: ability scores
                {
                    width: IDENTITY_COL_WIDTH,
                    stack: [abilityScoreTable],
                },
                // Centre: character stats
                {
                    width: STAT_COL_WIDTH,
                    ...makeTable(['*'], statRows.map(row => [{
                            stack: [
                                { text: row.label, bold: true, fontSize: FONT_SMALL },
                                { text: row.value, fontSize: FONT_BODY },
                            ],
                            minHeight: HEIGHT_STAT_ROW_MAIN,
                        }])),
                },
                // Right: portrait placeholder box + caption below
                {
                    width: '*',
                    stack: [
                        {
                            table: {
                                widths: ['*'],
                                heights: [HEIGHT_PORTRAIT],
                                body: [[{ text: '' }]],
                                dontBreakRows: true,
                            },
                            layout: SHEET_LAYOUT,
                        },
                        {
                            text: 'PORTRAIT, SYMBOL, OR COAT OF ARMS',
                            italics: true, fontSize: FONT_LABEL, alignment: 'center',
                            margin: [0, 2, 0, 0],
                        },
                    ],
                },
            ],
        },
        makeSection('WEAPONS & GEAR', [GEAR_NAME_COL_WIDTH, '*', GEAR_AMOUNT_COL_WIDTH, REFERENCE_COL_WIDTH], [
            columnHeaderRow(['NAME', 'DESCRIPTION', 'AMOUNT', 'REFERENCE']),
            ...Array.from({ length: WEAPON_ROWS }, (_, i) => {
                const item = allItems[i];
                return dataRow([
                    item?.Name ?? '',
                    item?.Description ?? '',
                    item?.Amount !== undefined ? String(item.Amount) : '',
                    '',
                ], i % 2 === 1);
            }),
        ]),
        makeSection('ADDITIONAL GEAR', ['*', GEAR_AMOUNT_COL_WIDTH, REFERENCE_COL_WIDTH], [
            columnHeaderRow(['GEAR', 'AMOUNT', 'REFERENCE']),
            ...emptyRows(GEAR_ROWS, 3),
        ]),
    ];
}
// ── Page 2: Languages, Skills, Edges, Spells ─────────────────────────────────
function buildPage2(data) {
    const languages = flattenAndCombineSelectionPackage(data.LanguageSelections(), data);
    const skills = flattenAndCombineSelectionPackage(data.SkillsSelection(), data);
    const edges = flattenAndCombineSelectionPackage(data.EdgeSelections(), data);
    const spells = flattenAndCombineSelectionPackage(data.SpellSelection(), data);
    const spellBody = [
        columnHeaderRow(['SPELL', 'LEVEL', 'SCHOOL', 'CASTING TIME', 'RANGE', 'TEST', 'REFERENCE']),
    ];
    for (let i = 0; i < SPELL_ROWS; i++) {
        const spell = spells[i];
        const shaded = i % 2 === 1;
        spellBody.push(dataRow([spell?.Name ?? '', '', '', '', '', '', spell?.reference ?? ''], shaded));
        spellBody.push([{
                text: [
                    { text: 'Notes  ', italics: true, fontSize: FONT_LABEL },
                    { text: spell?.Description ?? '', fontSize: FONT_BODY },
                ],
                colSpan: SPELL_COLS,
                fillColor: shaded ? STRIPE_GRAY : WHITE,
                minHeight: HEIGHT_SPELL_NOTES,
            }, ...Array(SPELL_COLS - 1).fill({})]);
    }
    return [
        makeSection('LANGUAGES', [LANG_NAME_COL_WIDTH, '*', LANG_SPOKEN_COL_WIDTH, LANG_READWRITE_COL_WIDTH, REFERENCE_COL_WIDTH], [
            columnHeaderRow(['LANGUAGE', 'DESCRIPTION', 'SPOKEN', 'READ/WRITE', 'REFERENCE']),
            ...Array.from({ length: LANGUAGE_ROWS }, (_, i) => {
                const lang = languages[i];
                const readWriteValue = lang?.canRead && lang?.canWrite ? 'Yes'
                    : lang?.canRead ? 'Read'
                        : lang?.canWrite ? 'Write'
                            : '';
                return dataRow([
                    lang?.Language?.Name ?? '',
                    lang?.Language?.Description ?? '',
                    lang?.canSpeak ? 'Yes' : '',
                    readWriteValue,
                    lang?.Language?.reference ?? '',
                ], i % 2 === 1);
            }),
        ]),
        makeSection('SKILLS', [LIST_NAME_COL_WIDTH, '*', REFERENCE_COL_WIDTH], [
            columnHeaderRow(['SKILL', 'DESCRIPTION', 'REFERENCE']),
            ...Array.from({ length: SKILL_ROWS }, (_, i) => {
                const skill = skills[i];
                return dataRow([skill?.Name ?? '', skill?.Description ?? '', skill?.reference ?? ''], i % 2 === 1);
            }),
        ]),
        makeSection('EDGES', [LIST_NAME_COL_WIDTH, '*', REFERENCE_COL_WIDTH], [
            columnHeaderRow(['EDGE', 'DESCRIPTION', 'REFERENCE']),
            ...Array.from({ length: EDGE_ROWS }, (_, i) => {
                const edge = edges[i];
                return dataRow([edge?.Name ?? '', edge?.Description ?? '', edge?.reference ?? ''], i % 2 === 1);
            }),
        ]),
        makeSection('SPELLS', [SPELL_NAME_COL_WIDTH, SPELL_LEVEL_COL_WIDTH, '*', SPELL_CAST_COL_WIDTH, SPELL_RANGE_COL_WIDTH, SPELL_TEST_COL_WIDTH, REFERENCE_COL_WIDTH], spellBody),
    ];
}
const ENTANGLEMENT_ROWS = [
    { lines: ['COLLEAGUES', 'ATTITUDE:'], dataKey: 'Colleagues' },
    { lines: ['FAMILY/CLAN', 'ATTITUDE:'], dataKey: 'Family' },
    { lines: ['LOCAL CIVIC AUTHORITIES', 'ATTITUDE:'], dataKey: 'CivicAuthorities' },
    { lines: ['LOCAL RELIGIOUS AUTHORITIES', 'ATTITUDE:'], dataKey: 'ReligiousAuthorities' },
    { lines: ['MASTER/MENTOR', 'ATTITUDE:'], dataKey: 'Master' },
    { lines: ['NEIGHBORS/LOCAL INHABITANTS', 'ATTITUDE:'], dataKey: 'Neighbors' },
    { lines: ['SHADOW GROUPS', 'ATTITUDE:'], dataKey: 'ShadowGroups' },
    { lines: ['OTHER/SPECIAL', 'ATTITUDE:'], dataKey: null },
    { lines: ['OTHER/SPECIAL', 'ATTITUDE:'], dataKey: null },
];
const RELIGION_RANK_LABELS = ['Primary', 'Secondary', 'Tertiary'];
function buildPage3(data, deityImages) {
    const deities = flattenAndCombineSelectionPackage(data.ReligionSelections(), data);
    const drawbacks = flattenAndCombineSelectionPackage(data.DrawbacksSelection(), data);
    const entanglements = data.OrganizationEntanglements();
    // ── Entanglements ──────────────────────────────────────────────────────────
    const entanglementBody = [
        columnHeaderRow(['ENTANGLEMENTS', 'YOUR NARRATIVE', 'REFERENCE']),
    ];
    for (let i = 0; i < ENTANGLEMENT_ROWS.length; i++) {
        const { lines, dataKey } = ENTANGLEMENT_ROWS[i];
        const entanglement = dataKey ? entanglements[dataKey] : undefined;
        const attitude = entanglement ? String(entanglement.Attitudes ?? '') : '';
        const shaded = i % 2 === 1;
        entanglementBody.push([
            {
                stack: [
                    { text: lines[0], bold: true, fontSize: FONT_LABEL },
                    { text: `${lines[1]} ${attitude}`.trim(), fontSize: FONT_SMALL },
                ],
                fillColor: ENTITY_LABEL_COLOR,
                minHeight: HEIGHT_WRITING_ROW,
            },
            { text: '', fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE, minHeight: HEIGHT_WRITING_ROW },
            { text: '', fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE, minHeight: HEIGHT_WRITING_ROW },
        ]);
    }
    // ── Religion ───────────────────────────────────────────────────────────────
    const religionBody = [
        columnHeaderRow(['RELIGION (DEITY)', 'SYMBOL', 'RUNE', 'PORTFOLIO & NOTES', 'REFERENCE']),
    ];
    for (let i = 0; i < RELIGION_ROWS; i++) {
        const deity = deities[i];
        const images = deityImages[i] ?? { symbol: null, rune: null };
        const shaded = false;
        religionBody.push([
            { text: RELIGION_RANK_LABELS[i], bold: true, fontSize: FONT_LABEL, fillColor: ENTITY_LABEL_COLOR, minHeight: HEIGHT_STANDARD_ROW },
            imageCell(images.symbol, shaded, HEIGHT_STANDARD_ROW),
            imageCell(images.rune, shaded, HEIGHT_STANDARD_ROW),
            { text: deity?.Description ?? '', fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE, minHeight: HEIGHT_STANDARD_ROW },
            { text: deity?.reference ?? '', fontSize: FONT_BODY, fillColor: shaded ? STRIPE_GRAY : WHITE, minHeight: HEIGHT_STANDARD_ROW },
        ]);
    }
    return [
        makeSection('ENTANGLEMENTS', [ENT_LABEL_COL_WIDTH, '*', REFERENCE_COL_WIDTH], entanglementBody),
        makeSection('RELIGION', [REL_NAME_COL_WIDTH, REL_IMAGE_COL_WIDTH, REL_IMAGE_COL_WIDTH, '*', REFERENCE_COL_WIDTH], religionBody),
        makeSection('DRAWBACKS', [LIST_NAME_COL_WIDTH, '*', REFERENCE_COL_WIDTH], [
            columnHeaderRow(['DRAWBACK', 'DESCRIPTION', 'REFERENCE']),
            ...Array.from({ length: DRAWBACK_ROWS }, (_, i) => {
                const db = drawbacks[i];
                return dataRow([db?.Name ?? '', db?.Description ?? '', db?.reference ?? ''], i % 2 === 1);
            }),
        ]),
        makeSection('NOTES & TREASURE', ['*'], emptyRows(NOTE_ROWS, 1, HEIGHT_WRITING_ROW)),
    ];
}
// ── Entry point ───────────────────────────────────────────────────────────────
export async function createPdf(data) {
    const [titleFontLoaded, rawDeities] = await Promise.all([
        loadFonts(),
        Promise.resolve(flattenAndCombineSelectionPackage(data.ReligionSelections(), data)),
    ]);
    const deityImages = await Promise.all(Array.from({ length: RELIGION_ROWS }, (_, i) => {
        const deity = rawDeities[i];
        return Promise.all([toDataUrl(deity?.SymbolPath), toDataUrl(deity?.RunePath)])
            .then(([symbol, rune]) => ({ symbol, rune }));
    }));
    const titleFontName = FONT_ID;
    const fullName = NameUtility.determineFullNameFromCharacterName(data.Name());
    pdfMake.createPdf({
        pageSize: 'LETTER',
        pageMargins: [PAGE_MARGIN, PAGE_MARGIN_TOP, PAGE_MARGIN, PAGE_MARGIN],
        defaultStyle: { font: FONT_ID, fontSize: FONT_BODY, lineHeight: 1 },
        header: () => ({
            columns: [
                { text: fullName, bold: true, fontSize: FONT_TITLE, font: titleFontName, margin: [PAGE_MARGIN, HEADER_TEXT_TOP, 0, 0] },
                { text: 'v. 10/03/2025', fontSize: FONT_SMALL, alignment: 'right', margin: [0, HEADER_VERSION_TOP, PAGE_MARGIN, 0] },
            ],
        }),
        footer: (currentPage) => ({
            stack: [
                { text: `Character Sheet page ${currentPage}`, fontSize: FONT_SMALL, italics: true },
                { text: `Character Creation ${['Ch 2-3', 'Ch 2-4', 'Ch 2-5'][currentPage - 1]}`, fontSize: FONT_SMALL, italics: true },
            ],
            alignment: 'right',
            margin: [0, SECTION_GAP, PAGE_MARGIN, 0],
        }),
        content: [
            ...buildPage1(data),
            ...buildPage2(data),
            ...buildPage3(data, deityImages),
        ],
    }).download(`${fullName}_sheet.pdf`);
}
