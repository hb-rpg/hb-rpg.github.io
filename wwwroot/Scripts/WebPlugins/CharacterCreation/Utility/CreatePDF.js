import { PDFDocument, StandardFonts, rgb, grayscale } from 'https://cdn.jsdelivr.net/npm/pdf-lib/+esm';
import { flattenAndCombineSelectionPackage } from './UpdateUtility.js';
const W = 612;
const H = 792;
const ML = 36;
const MR = 36;
const MT = 36;
const GRAY = grayscale(0.85);
const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);
// ── drawing helpers ──────────────────────────────────────────────────────────
function label(page, text, x, y, font, size = 6) {
    page.drawText(text, { x, y, size, font, color: BLACK });
}
function box(page, x, y, w, h, fill = false) {
    page.drawRectangle({
        x, y, width: w, height: h,
        borderColor: BLACK, borderWidth: 0.5,
        color: fill ? GRAY : WHITE,
    });
}
let fieldCounter = 0;
let activeFont;
function tf(form, page, x, y, w, h, value = '', multiline = false) {
    const name = `f${fieldCounter++}`;
    const field = form.createTextField(name);
    field.setText(value);
    if (multiline)
        field.enableMultiline();
    field.addToPage(page, {
        x: x + 1, y: y + 1, width: w - 2, height: h - 2,
        borderWidth: 0,
        backgroundColor: WHITE,
        textColor: BLACK,
        font: activeFont,
    });
}
function pageHeader(page, fonts, pageNum) {
    const refs = ['Ch 2-3', 'Ch 2-4', 'Ch 2-5'];
    label(page, 'Chapter 2 – Character Creation', ML, H - MT - 8, fonts.bold, 13);
    label(page, `v. 10/03/2025`, W - MR - 70, H - MT - 8, fonts.regular, 7);
    label(page, `Character Sheet page ${pageNum}`, W - MR - 80, MT - 10, fonts.italic, 7);
    label(page, `Character Creation ${refs[pageNum - 1]}`, W - MR - 80, MT - 18, fonts.italic, 7);
}
function tableHeader(page, cols, x, y, rowH, fonts) {
    let cx = x;
    for (const col of cols) {
        box(page, cx, y, col.w, rowH, true);
        label(page, col.label, cx + 2, y + 3, fonts.bold, 6);
        cx += col.w;
    }
}
function tableRow(form, page, cols, x, y, rowH, values, shaded = false) {
    let cx = x;
    cols.forEach((col, i) => {
        box(page, cx, y, col.w, rowH, shaded);
        tf(form, page, cx, y, col.w, rowH, values[i] ?? '');
        cx += col.w;
    });
}
function sectionLabel(page, text, x, y, w, fonts) {
    box(page, x, y, w, 10, true);
    label(page, text, x + 2, y + 2, fonts.bold, 7);
}
// ── Page 1 ───────────────────────────────────────────────────────────────────
function drawPage1(page, form, data, fonts) {
    pageHeader(page, fonts, 1);
    const topY = H - MT - 30;
    const leftW = 115;
    // Identity
    label(page, 'NAME', ML, topY + 12, fonts.bold, 6);
    box(page, ML, topY, leftW, 12);
    tf(form, page, ML, topY, leftW, 12, data.Name().Name ?? '');
    label(page, 'EPITHET / BYNAME', ML, topY - 2, fonts.bold, 6);
    box(page, ML, topY - 14, leftW, 12);
    tf(form, page, ML, topY - 14, leftW, 12, [data.Name().Epithets, data.Name().Bynames].filter(Boolean).join(' / '));
    // Ability scores
    const abilityNames = ['STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA'];
    const abilityVals = [
        data.Abilities().Strength,
        data.Abilities().Dexterity,
        data.Abilities().Constitution,
        data.Abilities().Intelligence,
        data.Abilities().Wisdom,
        data.Abilities().Charisma,
    ];
    let ay = topY - 32;
    for (let i = 0; i < 6; i++) {
        box(page, ML, ay, 22, 14, true);
        label(page, 'SCORE', ML + 3, ay + 8, fonts.regular, 5);
        box(page, ML + 22, ay, 18, 14);
        tf(form, page, ML + 22, ay, 18, 14, abilityVals[i] !== undefined ? String(abilityVals[i]) : '');
        label(page, '#', ML + 28, ay + 8, fonts.regular, 5);
        label(page, abilityNames[i], ML + 44, ay + 4, fonts.bold, 7);
        ay -= 17;
    }
    // Portrait box
    const portX = ML + leftW + 8;
    const portW = 160;
    const portH = 130;
    const portY = topY - portH + 12;
    box(page, portX, portY, portW, portH);
    label(page, 'PORTRAIT, SYMBOL, OR COAT OF ARMS', portX + 20, portY + portH / 2, fonts.italic, 6);
    // Character stats (right of portrait)
    const statsX = portX + portW + 6;
    const statsW = W - statsX - MR;
    const statRows = [
        { lbl: 'ANCESTRY', val: data.Race() },
        { lbl: 'BACKGROUND', val: data.Job() },
        { lbl: 'LEVEL', val: String(data.Level()) },
        { lbl: 'CLASS', val: data.Class() },
        { lbl: 'HIT DICE', val: String(data.HitDie()) },
        { lbl: 'HIT POINTS', val: String(data.HitPoints()) },
        { lbl: 'DAMAGE', val: '' },
    ];
    let sy = topY + 2;
    for (const row of statRows) {
        label(page, row.lbl, statsX, sy + 14, fonts.bold, 5);
        box(page, statsX, sy, statsW, 13);
        tf(form, page, statsX, sy, statsW, 13, row.val);
        sy -= 16;
    }
    // Equipment table
    const tableY = portY - 20;
    const tableW = W - ML - MR;
    const itemCols = [
        { label: 'NAME', w: 160 },
        { label: 'DESCRIPTION', w: tableW - 160 - 60 - 40 },
        { label: 'AMOUNT', w: 40 },
        { label: 'REFERENCE', w: 60 },
    ];
    const rowH = 14;
    sectionLabel(page, 'WEAPONS & GEAR', ML, tableY + 11, tableW, fonts);
    tableHeader(page, itemCols, ML, tableY - 8, rowH, fonts);
    const items = flattenAndCombineSelectionPackage(data.ItemSelections(), data);
    const trinkets = flattenAndCombineSelectionPackage(data.TrinketSelections(), data);
    const allItems = [...items, ...trinkets];
    const maxRows = 12;
    let iy = tableY - 8 - rowH;
    for (let i = 0; i < maxRows; i++) {
        const item = allItems[i];
        tableRow(form, page, itemCols, ML, iy, rowH, [
            item?.Name ?? '',
            item?.Description ?? '',
            item?.Amount !== undefined ? String(item.Amount) : '',
            '',
        ], i % 2 === 1);
        iy -= rowH;
    }
    // Extra blank gear rows
    const gearCols = [
        { label: 'GEAR', w: 160 },
        { label: 'AMOUNT', w: 40 },
        { label: 'REFERENCE', w: tableW - 160 - 40 },
    ];
    sectionLabel(page, 'ADDITIONAL GEAR', ML, iy + rowH - 2, tableW, fonts);
    iy -= 2;
    tableHeader(page, gearCols, ML, iy, rowH, fonts);
    iy -= rowH;
    for (let i = 0; i < 6; i++) {
        tableRow(form, page, gearCols, ML, iy, rowH, ['', '', ''], i % 2 === 1);
        iy -= rowH;
    }
}
// ── Page 2 ───────────────────────────────────────────────────────────────────
function drawPage2(page, form, data, fonts) {
    pageHeader(page, fonts, 2);
    const startY = H - MT - 30;
    const tableW = W - ML - MR;
    const rowH = 14;
    // Languages
    const langCols = [
        { label: 'LANGUAGE', w: 80 },
        { label: 'DESCRIPTION', w: tableW - 80 - 40 - 40 - 50 },
        { label: 'SPOKEN', w: 40 },
        { label: 'READ/WRITE', w: 40 },
        { label: 'REFERENCE', w: 50 },
    ];
    let y = startY;
    sectionLabel(page, 'LANGUAGES', ML, y, tableW, fonts);
    y -= 10;
    tableHeader(page, langCols, ML, y, rowH, fonts);
    y -= rowH;
    const languages = flattenAndCombineSelectionPackage(data.LanguageSelections(), data);
    const langMax = 5;
    for (let i = 0; i < langMax; i++) {
        const lang = languages[i];
        tableRow(form, page, langCols, ML, y, rowH, [
            lang?.Language?.Name ?? '',
            lang?.Language?.Description ?? '',
            lang?.canSpeak ? 'Yes' : '',
            (lang?.canRead && lang?.canWrite) ? 'Yes' : (lang?.canRead ? 'Read' : lang?.canWrite ? 'Write' : ''),
            '',
        ], i % 2 === 1);
        y -= rowH;
    }
    y -= 6;
    // Skills
    const skillCols = [
        { label: 'SKILL', w: 100 },
        { label: 'DESCRIPTION', w: tableW - 100 - 60 },
        { label: 'REFERENCE', w: 60 },
    ];
    sectionLabel(page, 'SKILLS', ML, y, tableW, fonts);
    y -= 10;
    tableHeader(page, skillCols, ML, y, rowH, fonts);
    y -= rowH;
    const skills = flattenAndCombineSelectionPackage(data.SkillsSelection(), data);
    const skillMax = 7;
    for (let i = 0; i < skillMax; i++) {
        const skill = skills[i];
        tableRow(form, page, skillCols, ML, y, rowH, [
            skill?.Name ?? '',
            skill?.Description ?? '',
            '',
        ], i % 2 === 1);
        y -= rowH;
    }
    y -= 6;
    // Edges
    const edgeCols = [
        { label: 'EDGE', w: 100 },
        { label: 'DESCRIPTION', w: tableW - 100 - 60 },
        { label: 'REFERENCE', w: 60 },
    ];
    sectionLabel(page, 'EDGES', ML, y, tableW, fonts);
    y -= 10;
    tableHeader(page, edgeCols, ML, y, rowH, fonts);
    y -= rowH;
    const edges = flattenAndCombineSelectionPackage(data.EdgeSelections(), data);
    const edgeMax = 7;
    for (let i = 0; i < edgeMax; i++) {
        const edge = edges[i];
        tableRow(form, page, edgeCols, ML, y, rowH, [
            edge?.Name ?? '',
            edge?.Description ?? '',
            '',
        ], i % 2 === 1);
        y -= rowH;
    }
    y -= 6;
    // Spells
    const spellCols = [
        { label: 'SPELL', w: 90 },
        { label: 'LEVEL', w: 30 },
        { label: 'SCHOOL', w: 50 },
        { label: 'CASTING TIME', w: 55 },
        { label: 'RANGE', w: 45 },
        { label: 'TEST', w: 45 },
        { label: 'REFERENCE', w: tableW - 90 - 30 - 50 - 55 - 45 - 45 },
    ];
    const noteH = 10;
    sectionLabel(page, 'SPELLS', ML, y, tableW, fonts);
    y -= 10;
    tableHeader(page, spellCols, ML, y, rowH, fonts);
    y -= rowH;
    const spells = flattenAndCombineSelectionPackage(data.SpellSelection(), data);
    const spellMax = 7;
    for (let i = 0; i < spellMax; i++) {
        const spell = spells[i];
        tableRow(form, page, spellCols, ML, y, rowH, [
            spell?.Name ?? '', '', '', '', '', '', '',
        ], i % 2 === 1);
        y -= rowH;
        // Notes sub-row spanning full width
        box(page, ML, y, tableW, noteH, false);
        label(page, 'Notes', ML + 2, y + 2, fonts.italic, 6);
        tf(form, page, ML + 28, y, tableW - 28, noteH, spell?.Description ?? '');
        y -= noteH;
    }
}
// ── Page 3 ───────────────────────────────────────────────────────────────────
function drawPage3(page, form, data, fonts) {
    pageHeader(page, fonts, 3);
    const startY = H - MT - 30;
    const tableW = W - ML - MR;
    const rowH = 16;
    const entRows = [
        { lbl: 'COLLEAGUES\nATTITUDE (#):', key: 'Colleagues' },
        { lbl: 'FAMILY/CLAN\nATTITUDE (#):', key: 'Family' },
        { lbl: 'LOCAL CIVIC AUTHORITIES\nATTITUDE (#):', key: 'CivicAuthorities' },
        { lbl: 'LOCAL RELIGIOUS AUTHORITIES\nATTITUDE (#):', key: 'ReligiousAuthorities' },
        { lbl: 'MASTER/MENTOR\nATTITUDE (#):', key: 'Master' },
        { lbl: 'NEIGHBORS/LOCAL INHABITANTS\nATTITUDE (#):', key: 'Neighbors' },
        { lbl: 'SHADOW GROUPS\nATTITUDE (#):', key: 'ShadowGroups' },
        { lbl: 'OTHER/SPECIAL\nATTITUDE (#):', key: null },
        { lbl: 'OTHER/SPECIAL\nATTITUDE (#):', key: null },
    ];
    const entCols = [
        { label: 'ENTANGLEMENTS', w: 115 },
        { label: 'YOUR NARRATIVE', w: tableW - 115 - 70 },
        { label: 'REFERENCE', w: 70 },
    ];
    let y = startY;
    sectionLabel(page, 'ENTANGLEMENTS', ML, y, tableW, fonts);
    y -= 10;
    tableHeader(page, entCols, ML, y, rowH, fonts);
    y -= rowH;
    const ents = data.OrganizationEntanglements();
    for (let i = 0; i < entRows.length; i++) {
        const { lbl, key } = entRows[i];
        const ent = key ? ents[key] : undefined;
        const narrative = ent ? `${ent.Attitudes ?? ''}` : '';
        // Label cell (gray)
        box(page, ML, y, entCols[0].w, rowH, true);
        // Split label lines
        const lines = lbl.split('\n');
        label(page, lines[0], ML + 2, y + rowH - 7, fonts.bold, 6);
        if (lines[1])
            label(page, lines[1], ML + 2, y + 2, fonts.regular, 5);
        // Narrative text field
        box(page, ML + entCols[0].w, y, entCols[1].w, rowH, i % 2 === 1);
        tf(form, page, ML + entCols[0].w, y, entCols[1].w, rowH, narrative);
        // Reference text field
        box(page, ML + entCols[0].w + entCols[1].w, y, entCols[2].w, rowH, false);
        tf(form, page, ML + entCols[0].w + entCols[1].w, y, entCols[2].w, rowH, '');
        y -= rowH;
    }
    y -= 8;
    // Religion
    const deities = flattenAndCombineSelectionPackage(data.ReligionSelections(), data);
    const religionRows = ['Primary*', 'Secondary', 'Tertiary'];
    const relCols = [
        { label: 'RELIGION (DEITY)', w: 90 },
        { label: 'SYMBOL', w: 60 },
        { label: 'RUNE', w: 60 },
        { label: 'PORTFOLIO & NOTES', w: tableW - 90 - 60 - 60 - 70 },
        { label: 'REFERENCE', w: 70 },
    ];
    sectionLabel(page, 'RELIGION', ML, y, tableW, fonts);
    y -= 10;
    tableHeader(page, relCols, ML, y, rowH, fonts);
    y -= rowH;
    for (let i = 0; i < 3; i++) {
        const deity = deities[i];
        const rowLbl = religionRows[i];
        box(page, ML, y, relCols[0].w, rowH, true);
        label(page, rowLbl, ML + 2, y + 4, fonts.bold, 6);
        let rx = ML + relCols[0].w;
        box(page, rx, y, relCols[1].w, rowH);
        tf(form, page, rx, y, relCols[1].w, rowH, deity?.SymbolPath ?? '');
        rx += relCols[1].w;
        box(page, rx, y, relCols[2].w, rowH);
        tf(form, page, rx, y, relCols[2].w, rowH, deity?.RunePath ?? '');
        rx += relCols[2].w;
        box(page, rx, y, relCols[3].w, rowH);
        tf(form, page, rx, y, relCols[3].w, rowH, deity?.Description ?? '', true);
        rx += relCols[3].w;
        box(page, rx, y, relCols[4].w, rowH);
        tf(form, page, rx, y, relCols[4].w, rowH, '');
        y -= rowH;
    }
    label(page, '* Some classes or backgrounds, like Warlock, only allow a Primary.', ML, y + rowH - 20, fonts.italic, 6);
    y -= 10;
    // Drawback
    const drawbacks = flattenAndCombineSelectionPackage(data.DrawbacksSelection(), data);
    const db = drawbacks[0];
    sectionLabel(page, 'DRAWBACK', ML, y, tableW, fonts);
    y -= 10;
    box(page, ML, y, tableW, rowH);
    tf(form, page, ML, y, tableW, rowH, db ? `${db.Name}: ${db.Description}` : '');
    y -= rowH + 6;
    // Notes & Treasure
    sectionLabel(page, 'NOTES & TREASURE', ML, y, tableW, fonts);
    y -= 10;
    for (let i = 0; i < 8; i++) {
        box(page, ML, y, tableW, 14);
        tf(form, page, ML, y, tableW, 14, '');
        y -= 14;
    }
}
// ── Entry point ──────────────────────────────────────────────────────────────
export async function createPdf(data) {
    fieldCounter = 0;
    const pdfDoc = await PDFDocument.create();
    const [bold, regular, italic] = await Promise.all([
        pdfDoc.embedFont(StandardFonts.HelveticaBold),
        pdfDoc.embedFont(StandardFonts.Helvetica),
        pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    ]);
    const fonts = { bold, regular, italic };
    activeFont = regular;
    const form = pdfDoc.getForm();
    const page1 = pdfDoc.addPage([W, H]);
    const page2 = pdfDoc.addPage([W, H]);
    const page3 = pdfDoc.addPage([W, H]);
    drawPage1(page1, form, data, fonts);
    drawPage2(page2, form, data, fonts);
    drawPage3(page3, form, data, fonts);
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.Name().Name ?? 'character'}_sheet.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
