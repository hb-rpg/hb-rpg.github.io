import { ConfiguredCharacterData } from '../Configuration/CharacterWizardData.js'
import { flattenAndCombineSelectionPackage } from './UpdateUtility.js'
import { NameUtility } from './NameUtility.js'
import { loadFonts, pdfMake, toDataUrl } from '../../../Framework/PDFs/Helpers.js';
import { buildPlayerOverview } from './BuildPlayerOverview.js'
import { buildPlayerGear } from './BuildPlayerGear.js'
import { buildPlayerProficiencies } from './BuildPlayerProficiencies.js'
import { buildPlayerBackground, DeityImages } from './BuildPlayerBackground.js'
import type { DocumentDefinition } from '../../../Framework/PDFs/Types.js'

// ── Document definition ─────────────────────────────────────────────────────────
// Assembles the full pdfmake document definition (fonts + deity images + content).
// Split out from createPdf so callers (e.g. the PDF test harness) can render the sheet
// however they like — download, open in a tab, or embed inline — instead of only downloading.
export async function buildCharacterSheetDocDefinition(data: ConfiguredCharacterData): Promise<DocumentDefinition> {
    const [titleFontLoaded, rawDeities] = await Promise.all([
        loadFonts(),
        Promise.resolve(flattenAndCombineSelectionPackage(data.ReligionSelections(), data)),
    ])

    const deityImages: DeityImages[] = await Promise.all(
        Array.from({ length: RELIGION_ROWS }, (_, i) => {
            const deity = rawDeities[i]
            return Promise.all([toDataUrl(deity?.SymbolPath), toDataUrl(deity?.RunePath)])
                .then(([symbol, rune]) => ({ symbol, rune }))
        })
    )

    const titleFontName = FONT_ID
    const fullName      = NameUtility.determineFullNameFromCharacterName(data.Name())

    return {
        pageSize: 'LETTER',
        pageMargins: [PAGE_MARGIN, PAGE_MARGIN_TOP, PAGE_MARGIN, PAGE_MARGIN],
        defaultStyle: { font: FONT_ID, fontSize: FONT_BODY, lineHeight: 1 },
        header: () => ({
            columns: [
                { text: fullName, bold: true, fontSize: FONT_TITLE, font: titleFontName, margin: [PAGE_MARGIN, HEADER_TEXT_TOP, 0, 0] },
                { text: 'v. 10/03/2025', fontSize: FONT_SMALL, alignment: 'right', margin: [0, HEADER_VERSION_TOP, PAGE_MARGIN, 0] },
            ],
        }),
        footer: (currentPage: number) => ({
            stack: [
                { text: `Character Sheet page ${currentPage}`, fontSize: FONT_SMALL, italics: true },
                { text: `Character Creation ${ ['Ch 2-3', 'Ch 2-4', 'Ch 2-5'][currentPage - 1] }`, fontSize: FONT_SMALL, italics: true },
            ],
            alignment: 'right',
            margin: [0, SECTION_GAP, PAGE_MARGIN, 0],
        }),
        content: [
            ...buildPlayerOverview(data),
            ...buildPlayerGear(data),
            ...buildPlayerProficiencies(data),
            ...buildPlayerBackground(data, deityImages),
        ],
    }
}

// ── Entry point ───────────────────────────────────────────────────────────────
export async function createPdf(data: ConfiguredCharacterData): Promise<void> {
    const definition = await buildCharacterSheetDocDefinition(data)
    const fullName   = NameUtility.determineFullNameFromCharacterName(data.Name())
    pdfMake.createPdf(definition).download(`${fullName}_sheet.pdf`)
}
