// ── Font sizes ─────────────────────────────────────────────────────────────────
const FONT_TITLE          = 16   // "HEARTBREAKER" header
const FONT_SECTION_HEADER =  9   // section titles (LANGUAGES, SKILLS, etc.) — bold, standalone
const FONT_LABEL          =  6   // column headers and small labels
const FONT_BODY           =  8   // cell text
const FONT_SMALL          =  5   // secondary labels

// ── Page layout ───────────────────────────────────────────────────────────────
const PAGE_MARGIN        = 36
const PAGE_MARGIN_TOP    = 54   // taller top margin accommodates the header bar
const HEADER_TEXT_TOP    = 10
const HEADER_VERSION_TOP = 16

// ── Spacing ───────────────────────────────────────────────────────────────────
const COLUMN_GAP          = 8
const SECTION_GAP         = 4    // tight internal spacing (e.g. between name field + ability table)
const BETWEEN_SECTION_GAP = 12   // standard gap after every major section

// ── Cell heights ──────────────────────────────────────────────────────────────
const HEIGHT_IDENTITY_FIELD = 12
const HEIGHT_STAT_ROW       = 13
const HEIGHT_STANDARD_ROW   = 16
const HEIGHT_WRITING_ROW    = 40   // tall rows for hand-writing (narrative, notes)
const HEIGHT_SPELL_NOTES    = 10
// The stat/ability rows match a plain gear (`dataRow`) row: one line of body text plus the
// sheet's top/bottom cell padding. The portrait is then sized off that row height so the three
// top-section columns line up — row height is the source of truth, not the portrait.
const STAT_ROW_COUNT        = 7    // header/name row + 6 abilities (also the 7 stat fields)
const HEIGHT_STAT_ROW_MAIN  = FONT_BODY + 2   // + 2 = SHEET_LAYOUT paddingTop(1) + paddingBottom(1)
// The 7-row table is taller than a single portrait cell by its accumulated per-row padding and
// border lines (~15pt); pad the portrait by that so the three top-section columns bottom-align.
const HEIGHT_PORTRAIT       = HEIGHT_STAT_ROW_MAIN * STAT_ROW_COUNT + 15

// ── Row counts ────────────────────────────────────────────────────────────────
const EXTRA_GEAR_ROWS   = 5
const LANGUAGE_ROWS =  5
const SKILL_ROWS    =  7
const EDGE_ROWS     =  7
const DRAWBACK_ROWS =  3
const SPELL_ROWS    =  7
const SPELL_COLS    =  7
const RELIGION_ROWS =  3
const NOTE_ROWS     =  8

// ── Column widths: top identity/stats/portrait section ───────────────────────
// Usable column space = 540 content - 2×8 gaps = 524pt → 30/30/40 split
const IDENTITY_COL_WIDTH = 157   // 30 %
const STAT_COL_WIDTH     = 157   // 30 %
// portrait: width '*' → takes remaining ~40 % (≈ 210pt)

// ── Column widths: ability scores (inside identity column) ───────────────────
const ABILITY_SCORE_COL_WIDTH  = 22
const ABILITY_DAMAGE_COL_WIDTH = 22

// ── Column widths: gear tables ───────────────────────────────────────────────
const GEAR_NAME_COL_WIDTH   = 160
const GEAR_AMOUNT_COL_WIDTH =  40

// ── Column widths: languages ─────────────────────────────────────────────────
const LANG_NAME_COL_WIDTH      =  80
const LANG_SPOKEN_COL_WIDTH    =  40
const LANG_READWRITE_COL_WIDTH =  40

// ── Column widths: skills, edges, drawbacks ──────────────────────────────────
const LIST_NAME_COL_WIDTH = 100

// ── Column widths: spells ────────────────────────────────────────────────────
const SPELL_NAME_COL_WIDTH  =  90
const SPELL_LEVEL_COL_WIDTH =  25
const SPELL_CAST_COL_WIDTH  =  50
const SPELL_RANGE_COL_WIDTH =  35
const SPELL_TEST_COL_WIDTH  =  35

// ── Column widths: entanglements ─────────────────────────────────────────────
const ENT_LABEL_COL_WIDTH = 115

// ── Column widths: religion ──────────────────────────────────────────────────
const REL_NAME_COL_WIDTH   =  90
const REL_DEITY_IMAGE_SIZE =  35
const REL_IMAGE_COL_WIDTH  =  40

// ── Unified reference column width (~8 chars at body font) ───────────────────
const REFERENCE_COL_WIDTH = 40

// ── DM quick reference ────────────────────────────────────────────────────────
// The quick reference is flowing prose rather than tables, so it needs paragraph spacing and
// looser leading than the cramped one-line rows the rest of the sheet is built from.
const QUICK_REF_LINE_GAP    = 6
const QUICK_REF_LINE_HEIGHT = 1.2

// ── Title font ────────────────────────────────────────────────────────────────
// Drop a TTF font file at /Fonts/title.TTF to use a custom DnD-style typeface.
// Falls back to Roboto Bold if the file is not found.
const FONT_VFS_NAME = 'LucidaSans.TTF'
const FONT_BOLD_VFS_NAME = 'LucidaSansBold.TTF'
const FONT_ITALIC_VFS_NAME = 'LucidaSansItalic.TTF'
const FONT_BOLD_ITALIC_VFS_NAME = 'LucidaSansBoldItalic.TTF'

const REGULAR_FONT_PATH     = '/Fonts/LucidaSans/LSANS.TTF'
const BOLD_FONT_PATH     = '/Fonts/LucidaSans/LSANSD.TTF'
const ITALIC_FONT_PATH      = '/Fonts/LucidaSans/LSANSI.TTF'
const BOLD_ITALIC_FONT_PATH = '/Fonts/LucidaSans/LSANSDI.TTF'
const FONT_ID       = 'LucidaSans'

// ── Colors ────────────────────────────────────────────────────────────────────
const HEADER_GRAY        = '#D8D8D8'   // column header rows
const STRIPE_GRAY        = '#E8E8E8'   // alternating data row tint (slightly darker than before)
const WHITE              = '#FFFFFF'
const ENTITY_LABEL_COLOR = '#D8D8D8'   // shared by entanglement label column and religion rank cells

// ── Table layout (thin borders, tight padding) ────────────────────────────────
const SHEET_LAYOUT = {
    hLineWidth: () => 0.5,
    vLineWidth: () => 0.5,
    hLineColor: () => '#000000',
    vLineColor: () => '#000000',
    paddingLeft:   () => 2,
    paddingRight:  () => 2,
    paddingTop:    () => 1,
    paddingBottom: () => 1,
}