import { flattenAndCombineSelectionPackage } from './UpdateUtility.js';
import { ReligionData } from '../Configuration/DietiesData.js';
import { columnHeaderRow, dataRow, emptyRows, imageCell, makeSection } from '../../../Framework/PDFs/Helpers.js';
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
export function buildPlayerBackground(data, deityImages) {
    // Slots the player set to "None" are dropped, so a non-religious character gets no RELIGION section at all
    const deities = ReligionData.realDeities(flattenAndCombineSelectionPackage(data.ReligionSelections(), data));
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
        ...(deities.length > 0 ? [makeSection('RELIGION', [REL_NAME_COL_WIDTH, REL_IMAGE_COL_WIDTH, REL_IMAGE_COL_WIDTH, '*', REFERENCE_COL_WIDTH], religionBody)] : []),
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
