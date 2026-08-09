import { makeTable } from '../../../Framework/PDFs/Helpers.js';
import { AbilityNames } from '../Contracts/Abilities.js';
import { JobSubsetEnum } from '../Contracts/StringTypes.js';
// Both top-section tables are STAT_ROW_COUNT rows of HEIGHT_STAT_ROW_MAIN, so tinting them off
// the same row index keeps their stripes running level across the column gap.
const stripeFill = (rowIndex) => rowIndex % 2 === 1 ? STRIPE_GRAY : WHITE;
// ── Page 1 (top): Identity, Abilities, Portrait, Stats ───────────────────────
export function buildPlayerOverview(data) {
    const abilities = data.Abilities();
    return [
        // ── Top section: 30 % identity | 30 % stats | 40 % portrait ──
        {
            columnGap: COLUMN_GAP,
            margin: [0, 0, 0, BETWEEN_SECTION_GAP],
            columns: [
                buildAbilityColumn(abilities, data.Name().Name ?? ''),
                buildStatsColumn(data),
                buildPortraitColumn(),
            ],
        },
    ];
}
// Left column: character name row on top, then the ability-score table (name / score).
function buildAbilityColumn(abilities, characterName) {
    const nameHeaderRow = [
        { text: 'NAME', bold: true, fontSize: FONT_LABEL, border: [true, true, false, true] },
        { text: characterName, fontSize: FONT_BODY, border: [false, true, true, true] },
    ];
    const filledAbilityRows = [];
    const abilityKeys = Object.keys(AbilityNames);
    for (const name of abilityKeys) {
        const abilityValue = abilities[name];
        if (abilityValue == undefined)
            throw "Unexpected value " + name + " in ability pdf builder";
        const borderStyleLeft = (name == abilityKeys[abilityKeys.length - 1]) ?
            [true, false, false, true] : [true, false, false, true];
        const borderStyleRight = (name == abilityKeys[abilityKeys.length - 1]) ?
            [false, false, true, true] : [false, false, true, true];
        filledAbilityRows.push([
            { text: name.toUpperCase(), bold: true, fontSize: FONT_LABEL, border: borderStyleLeft },
            { text: abilityValue, fontSize: FONT_BODY, border: borderStyleRight },
            // { text: '', fontSize: FONT_BODY, border: [false, false, false, false] }
        ]);
    }
    const rows = [nameHeaderRow, ...filledAbilityRows]
        .map((row, i) => row.map(cell => ({ ...cell, fillColor: stripeFill(i) })));
    return {
        width: IDENTITY_COL_WIDTH,
        stack: [{
                ...makeTable(['*', '*'], //, '*']
                rows, Array(rows.length).fill(HEIGHT_STAT_ROW_MAIN)),
                margin: [0, 0, 8, 0],
            }],
    };
}
// Centre column: character stat fields (ancestry, class, hit points, etc.).
function buildStatsColumn(data) {
    // The subset (Jeweler, Freelance, …) is what actually shaped the character's trinkets and
    // story, so it belongs beside the career. Careers that offer no subsets carry None, which
    // must not print. The parenthetical sits a size down because at FONT_BODY the longest
    // pairing overruns STAT_COL_WIDTH, and a wrapped row would grow past HEIGHT_STAT_ROW_MAIN —
    // a minimum, not a cap — knocking this table out of line with the abilities and portrait.
    const subset = data.JobSubset();
    const background = subset !== JobSubsetEnum.None
        ? [{ text: data.Job(), fontSize: FONT_BODY }, { text: ` (${subset})`, fontSize: FONT_SMALL }]
        : [{ text: data.Job(), fontSize: FONT_BODY }];
    const statRows = [
        { label: 'ANCESTRY', value: [{ text: data.Race(), fontSize: FONT_BODY }] },
        { label: 'BACKGROUND', value: background },
        { label: 'LEVEL', value: [] }, // user fills in manually
        { label: 'CLASS', value: [{ text: data.Class(), fontSize: FONT_BODY }] },
        { label: 'HIT DICE', value: [{ text: String(data.HitDie()), fontSize: FONT_BODY }] },
        { label: 'HIT POINTS', value: [{ text: String(data.HitPoints()), fontSize: FONT_BODY }] },
        { label: 'DAMAGE', value: [] },
    ];
    return {
        width: STAT_COL_WIDTH,
        ...makeTable(['*'], statRows.map((row, i) => [{
                text: [
                    { text: row.label + '  ', bold: true, fontSize: FONT_LABEL },
                    ...row.value,
                ],
                fillColor: stripeFill(i),
            }]), Array(statRows.length).fill(HEIGHT_STAT_ROW_MAIN)),
    };
}
// Right column: portrait placeholder box + caption below.
function buildPortraitColumn() {
    return {
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
    };
}
