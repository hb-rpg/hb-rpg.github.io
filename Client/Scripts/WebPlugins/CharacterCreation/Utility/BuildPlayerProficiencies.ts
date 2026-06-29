import { ConfiguredCharacterData } from '../Configuration/CharacterWizardData.js'
import { flattenAndCombineSelectionPackage } from './UpdateUtility.js'
import { columnHeaderRow, dataRow, makeSection } from '../../../Framework/PDFs/Helpers.js';
import type { Content, TableCell } from '../../../Framework/PDFs/Types.js';

// ── Page 2: Languages, Skills, Edges, Spells ─────────────────────────────────
export function buildPlayerProficiencies(data: ConfiguredCharacterData): Content[] {
    const languages = flattenAndCombineSelectionPackage(data.LanguageSelections(), data)
    const skills    = flattenAndCombineSelectionPackage(data.SkillsSelection(), data)
    const edges     = flattenAndCombineSelectionPackage(data.EdgeSelections(), data)
    const spells    = flattenAndCombineSelectionPackage(data.SpellSelection(), data)

    const spellBody: TableCell[][] = [
        columnHeaderRow(['SPELL', 'LEVEL', 'SCHOOL', 'CASTING TIME', 'RANGE', 'TEST', 'REFERENCE']),
    ]
    for (let i = 0; i < SPELL_ROWS; i++) {
        const spell  = spells[i]
        const shaded = i % 2 === 1
        spellBody.push(dataRow([spell?.Name ?? '', '', '', '', '', '', spell?.reference ?? ''], shaded))
        spellBody.push([{
            text: [
                { text: 'Notes  ', italics: true, fontSize: FONT_LABEL },
                { text: spell?.Description ?? '', fontSize: FONT_BODY },
            ],
            colSpan: SPELL_COLS,
            fillColor: shaded ? STRIPE_GRAY : WHITE,
            minHeight: HEIGHT_SPELL_NOTES,
        }, ...Array<TableCell>(SPELL_COLS - 1).fill({ text: '' })])
    }

    return [
        makeSection('LANGUAGES',
            [LANG_NAME_COL_WIDTH, '*', LANG_SPOKEN_COL_WIDTH, LANG_READWRITE_COL_WIDTH, REFERENCE_COL_WIDTH],
            [
                columnHeaderRow(['LANGUAGE', 'DESCRIPTION', 'SPOKEN', 'READ/WRITE', 'REFERENCE']),
                ...Array.from({ length: LANGUAGE_ROWS }, (_, i) => {
                    const lang           = languages[i]
                    const readWriteValue = lang?.canRead && lang?.canWrite ? 'Yes'
                        : lang?.canRead  ? 'Read'
                        : lang?.canWrite ? 'Write'
                        : ''
                    return dataRow([
                        lang?.Language?.Name ?? '',
                        lang?.Language?.Description ?? '',
                        lang?.canSpeak ? 'Yes' : '',
                        readWriteValue,
                        lang?.Language?.reference ?? '',
                    ], i % 2 === 1)
                }),
            ],
        ),
        makeSection('SKILLS',
            [LIST_NAME_COL_WIDTH, '*', REFERENCE_COL_WIDTH],
            [
                columnHeaderRow(['SKILL', 'DESCRIPTION', 'REFERENCE']),
                ...Array.from({ length: SKILL_ROWS }, (_, i) => {
                    const skill = skills[i]
                    return dataRow([skill?.Name ?? '', skill?.Description ?? '', skill?.reference ?? ''], i % 2 === 1)
                }),
            ],
        ),
        makeSection('EDGES',
            [LIST_NAME_COL_WIDTH, '*', REFERENCE_COL_WIDTH],
            [
                columnHeaderRow(['EDGE', 'DESCRIPTION', 'REFERENCE']),
                ...Array.from({ length: EDGE_ROWS }, (_, i) => {
                    const edge = edges[i]
                    return dataRow([edge?.Name ?? '', edge?.Description ?? '', edge?.reference ?? ''], i % 2 === 1)
                }),
            ],
        ),
        makeSection('SPELLS',
            [SPELL_NAME_COL_WIDTH, SPELL_LEVEL_COL_WIDTH, '*', SPELL_CAST_COL_WIDTH, SPELL_RANGE_COL_WIDTH, SPELL_TEST_COL_WIDTH, REFERENCE_COL_WIDTH],
            spellBody,
        ),
    ]
}
