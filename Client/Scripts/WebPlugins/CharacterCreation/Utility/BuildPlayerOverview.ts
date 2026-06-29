import { ConfiguredCharacterData } from '../Configuration/CharacterWizardData.js'
import { makeTable } from '../../../Framework/PDFs/Helpers.js';
import type { Column, Content } from '../../../Framework/PDFs/Types.js';
import { AbilityNames, Abilities } from '../Contracts/Abilities.js';

// ── Page 1 (top): Identity, Abilities, Portrait, Stats ───────────────────────
export function buildPlayerOverview(data: ConfiguredCharacterData): Content[] {
    const abilities = data.Abilities()
    return [
        // ── Top section: 30 % identity | 30 % stats | 40 % portrait ──
        {
            columnGap: COLUMN_GAP,
            margin: [0, 0, 0, BETWEEN_SECTION_GAP],
            columns: [
                buildAbilityColumn(abilities),
                buildStatsColumn(data),
                buildPortraitColumn(),
            ],
        },
    ]
}

// Left column: ability-score table (name / score / damage).
function buildAbilityColumn(abilities: Abilities): Column {
    const abilityRowHeader: Content[] = [
        { text: 'SCORE',       bold: true, fontSize: FONT_LABEL, border: [true, true, false, true] },
        { text: '',  bold: true, fontSize: FONT_LABEL, border: [false, true, true, true] },
        // { text: 'DAMAGE', bold: true, fontSize: FONT_LABEL, fillColor: HEADER_GRAY, alignment: 'center', border: [false, true, true, true] },
    ]
    const filledAbilityRows: Content[][] = []

    const abilityKeys = Object.keys(AbilityNames)

    for (const name of abilityKeys as (keyof Abilities)[]) {
        const abilityValue = abilities[name]

        if (abilityValue == undefined) throw "Unexpected value " + name + " in ability pdf builder"
        
        const borderStyleLeft : [boolean, boolean, boolean, boolean] = (name == abilityKeys[abilityKeys.length - 1])? 
            [true, false, false, true] : [true, false, false, true]
        
        const borderStyleRight : [boolean, boolean, boolean, boolean] = (name == abilityKeys[abilityKeys.length - 1])? 
            [false, false, true, true] : [false, false, true, true]

        filledAbilityRows.push([
            { text: name.toUpperCase(), bold: true, fontSize: FONT_LABEL, border: borderStyleLeft },
            { text: abilityValue, fontSize: FONT_BODY, border: borderStyleRight },
            // { text: '', fontSize: FONT_BODY, border: [false, false, false, false] }
        ])
    }

    const rows = [abilityRowHeader, ...filledAbilityRows]

    return {
        width: IDENTITY_COL_WIDTH,
        stack: [{
            ...makeTable(
                ['*', '*'], //, '*']
                rows,
                Array(rows.length).fill(HEIGHT_STAT_ROW_MAIN),
            ),
            margin: [0, 0, 8, 0],
        }],
    }
}

// Centre column: character stat fields (ancestry, class, hit points, etc.).
function buildStatsColumn(data: ConfiguredCharacterData): Column {
    const statRows = [
        { label: 'ANCESTRY',   value: data.Race()              },
        { label: 'BACKGROUND', value: data.Job()               },
        { label: 'LEVEL',      value: ''                       },  // user fills in manually
        { label: 'CLASS',      value: data.Class()             },
        { label: 'HIT DICE',   value: String(data.HitDie())    },
        { label: 'HIT POINTS', value: String(data.HitPoints()) },
        { label: 'DAMAGE',     value: ''                       },
    ]

    return {
        width: STAT_COL_WIDTH,
        ...makeTable(
            ['*'],
            statRows.map(row => [{
                stack: [
                    { text: row.label, bold: true, fontSize: FONT_SMALL },
                    { text: row.value,            fontSize: FONT_BODY  },
                ],
            }]),
            Array(statRows.length).fill(HEIGHT_STAT_ROW_MAIN),
        ),
    }
}

// Right column: portrait placeholder box + caption below.
function buildPortraitColumn(): Column {
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
    }
}
