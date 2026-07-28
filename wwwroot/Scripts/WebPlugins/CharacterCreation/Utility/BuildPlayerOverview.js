import { makeTable } from '../../../Framework/PDFs/Helpers.js';
import { AbilityNames } from '../Contracts/Abilities.js';
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
    const rows = [nameHeaderRow, ...filledAbilityRows];
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
    const statRows = [
        { label: 'ANCESTRY', value: data.Race() },
        { label: 'BACKGROUND', value: data.Job() },
        { label: 'LEVEL', value: '' }, // user fills in manually
        { label: 'CLASS', value: data.Class() },
        { label: 'HIT DICE', value: String(data.HitDie()) },
        { label: 'HIT POINTS', value: String(data.HitPoints()) },
        { label: 'DAMAGE', value: '' },
    ];
    return {
        width: STAT_COL_WIDTH,
        ...makeTable(['*'], statRows.map((row, i) => [{
                text: [
                    { text: row.label + '  ', bold: true, fontSize: FONT_LABEL },
                    { text: row.value, fontSize: FONT_BODY },
                ],
                fillColor: i % 2 === 1 ? STRIPE_GRAY : WHITE,
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
