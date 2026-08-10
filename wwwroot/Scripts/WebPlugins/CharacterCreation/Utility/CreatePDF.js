import { flattenAndCombineSelectionPackage } from './UpdateUtility.js';
import { ReligionData } from '../Configuration/DietiesData.js';
import { NameUtility } from './NameUtility.js';
import { loadFonts, pdfMake, toDataUrl } from '../../../Framework/PDFs/Helpers.js';
import { buildPlayerOverview } from './BuildPlayerOverview.js';
import { buildPlayerGear } from './BuildPlayerGear.js';
import { buildPlayerProficiencies } from './BuildPlayerProficiencies.js';
import { buildPlayerBackground } from './BuildPlayerBackground.js';
import { buildDMQuickReference } from './BuildDMQuickReference.js';
// ── Document definition ─────────────────────────────────────────────────────────
// Assembles the full pdfmake document definition (fonts + deity images + content).
// Split out from createPdf so callers (e.g. the PDF test harness) can render the sheet
// however they like — download, open in a tab, or embed inline — instead of only downloading.
export async function buildCharacterSheetDocDefinition(data) {
    const [titleFontLoaded, rawDeities] = await Promise.all([
        loadFonts(),
        // "None" slots carry no imagery, so drop them here to keep image rows aligned with buildPlayerBackground
        Promise.resolve(ReligionData.realDeities(flattenAndCombineSelectionPackage(data.ReligionSelections(), data))),
    ]);
    const deityImages = await Promise.all(Array.from({ length: RELIGION_ROWS }, (_, i) => {
        const deity = rawDeities[i];
        return Promise.all([toDataUrl(deity?.SymbolPath), toDataUrl(deity?.RunePath)])
            .then(([symbol, rune]) => ({ symbol, rune }));
    }));
    const titleFontName = FONT_ID;
    const fullName = NameUtility.determineFullNameFromCharacterName(data.Name());
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
        footer: (currentPage, pageCount) => {
            // The gear table grows with whatever the character carries, so a loaded character can
            // spill past the three chapters the sheet used to fit in — leave the reference blank on
            // any overflow page rather than printing "undefined".
            const chapter = ['Ch 2-3', 'Ch 2-4', 'Ch 2-5'][currentPage - 1];
            // The quick reference is appended last and always starts a fresh page, so the final
            // page is it — name it rather than calling it another sheet page.
            const isQuickReference = currentPage === pageCount;
            return {
                stack: [
                    { text: isQuickReference ? 'DM Quick Reference' : `Character Sheet page ${currentPage}`, fontSize: FONT_SMALL, italics: true },
                    { text: chapter ? `Character Creation ${chapter}` : '', fontSize: FONT_SMALL, italics: true },
                ],
                alignment: 'right',
                margin: [0, SECTION_GAP, PAGE_MARGIN, 0],
            };
        },
        content: [
            ...buildPlayerOverview(data),
            ...buildPlayerGear(data),
            ...buildPlayerProficiencies(data),
            ...buildPlayerBackground(data, deityImages),
            ...buildDMQuickReference(data),
        ],
    };
}
// ── Entry point ───────────────────────────────────────────────────────────────
export async function createPdf(data) {
    const definition = await buildCharacterSheetDocDefinition(data);
    const fullName = NameUtility.determineFullNameFromCharacterName(data.Name());
    pdfMake.createPdf(definition).download(`${fullName}_sheet.pdf`);
}
