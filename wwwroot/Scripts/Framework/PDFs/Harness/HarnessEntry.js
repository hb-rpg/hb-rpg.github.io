// ── PDF harness entry ─────────────────────────────────────────────────────────
// Builds a fully-configured sample character, generates the character-sheet PDF, and
// embeds it inline in the page's iframe. Any failure is printed to #error so wiring /
// data problems surface immediately — that's the whole point of this harness.
import { pdfMake } from '../Helpers.js';
import { buildCharacterSheetDocDefinition } from '../../../WebPlugins/CharacterCreation/Utility/CreatePDF.js';
import { makeSampleCharacter } from './SampleCharacter.js';
window.addEventListener('DOMContentLoaded', async () => {
    const frame = document.getElementById('pdf');
    const errorEl = document.getElementById('error');
    try {
        const definition = await buildCharacterSheetDocDefinition(makeSampleCharacter());
        const blob = await pdfMake.createPdf(definition).getBlob();
        frame.src = URL.createObjectURL(blob);
    }
    catch (err) {
        errorEl.textContent = `PDF generation failed:\n${err instanceof Error ? err.stack ?? err.message : String(err)}`;
    }
});
