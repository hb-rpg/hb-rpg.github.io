import { ConfiguredCharacterData } from '../Configuration/CharacterWizardData.js'
import { flattenAndCombineSelectionPackage } from './UpdateUtility.js'
import { NameUtility } from './NameUtility.js'
import { collectGear, itemStats } from './BuildPlayerGear.js'
import { AbilityNames, Abilities } from '../Contracts/Abilities.js'
import { GameItem, ItemTypes } from '../Contracts/TaggedData.js'
import { makeTable } from '../../../Framework/PDFs/Helpers.js'
import type { Border, Content, TextNode } from '../../../Framework/PDFs/Types.js'

// ── Page 4: DM quick reference ────────────────────────────────────────────────
// The three sheet pages are a player artifact: every value in its own bordered cell, half the
// rows left blank to write in. A DM running an encounter needs the opposite — the whole
// character as a few lines of dense prose they can read at a glance. This page is that.

// The prose still has to look like it belongs to the same document as the tabled pages, so it
// prints inside one bordered card: a shaded identity bar on top, the lines stacked below it.
// pdfmake draws a horizontal rule only when the cell owning that edge asks for one, so the
// label's bottom border is the single rule inside the card — the interior rows declare neither
// a top nor a bottom edge and the last row closes the box.
const CARD_LABEL:  Border = [true, true,  true, true ]
const CARD_MIDDLE: Border = [true, false, true, false]
const CARD_BOTTOM: Border = [true, false, true, true ]

// Weapons, ammunition and armor answer "what do they hit with, and how hard" — they belong on
// the combat line. Everything else is inventory and gets the one-line Gear summary.
const COMBAT_TYPES: ItemTypes[] = [ItemTypes.Melee, ItemTypes.Ranged, ItemTypes.Ammo, ItemTypes.Armor]

const isCombatItem = (item: GameItem) => item.Type !== undefined && COMBAT_TYPES.includes(item.Type)

// "Short Bow (Simple Ranged, 1d6, Nearby, 20 arrows)" — the parenthetical is omitted for items
// that carry no mechanical stats at all, so they don't print an empty "()".
function combatEntry(item: GameItem): string {
    const stats = itemStats(item)
    return stats.length > 0 ? `${item.Name} (${stats.join(', ')})` : item.Name
}

// A few non-combat categories carry a quantity the DM actually adjudicates — how many days of
// food are left, how much rope there is, what a pack holds. The rest (wealth's "1 coins per
// coin", say) only add noise to an already dense line, so they print as bare names.
const QUANTIFIED_TYPES: ItemTypes[] = [ItemTypes.Ration, ItemTypes.Rope, ItemTypes.Container]

// "Rations (4 servings)", "Wineskin ×2". Amount is 1 for most items and would be noise everywhere.
function gearEntry(item: GameItem): string {
    const stats = item.Type !== undefined && QUANTIFIED_TYPES.includes(item.Type) ? itemStats(item) : []
    const name  = stats.length > 0 ? `${item.Name} (${stats.join(', ')})` : item.Name
    return (item.Amount ?? 1) > 1 ? `${name} ×${item.Amount}` : name
}

// "STR: 10   DEX: 9   CON: 9 …" — three spaces between pairs so the row reads as columns
// without needing a table. A score that was never rolled prints as an em dash.
function abilityLine(abilities: Abilities): string {
    return (Object.keys(AbilityNames) as (keyof Abilities)[])
        .map(name => {
            const value = abilities[name]
            return `${name.slice(0, 3).toUpperCase()}: ${value ?? '—'}`
        })
        .join('   ')
}

// "Adaptable – You are unusually good at many unexpected tasks."
const namedEntries = (entries: { Name: string, Description?: string }[]): TextNode[] =>
    entries.map(entry => ({
        text: [
            { text: entry.Name, bold: true },
            { text: entry.Description ? ` – ${entry.Description}` : '' },
        ],
        margin: [0, 0, 0, QUICK_REF_LINE_GAP],
    }))

export function buildDMQuickReference(data: ConfiguredCharacterData): Content[] {
    const skills = flattenAndCombineSelectionPackage(data.SkillsSelection(), data)
    const edges  = flattenAndCombineSelectionPackage(data.EdgeSelections(), data)
    const spells = flattenAndCombineSelectionPackage(data.SpellSelection(), data)

    const gear        = collectGear(data)
    const combatItems = gear.filter(isCombatItem)
    const carriedItems = gear.filter(item => !isCombatItem(item))

    // The card's label names the character the way a DM would introduce them: the career
    // background rather than `Class`, which is free text the wizard doesn't set yet.
    const fullName = NameUtility.determineFullNameFromCharacterName(data.Name())
    const label    = `${fullName}, ${data.Race()} ${data.Job()} (${data.Level()} Level/${data.HitDie()} HD)`.replace(/\s+/g, ' ')

    const combatLine = [`HP: ${data.HitPoints()}`, ...combatItems.map(combatEntry)].join(', ')

    // Only casters get a magic block, matching how the sheet's SPELLS section is conditional.
    const spellBlock: TextNode[] = spells.length > 0
        ? [{ text: 'SPELLS', bold: true, fontSize: FONT_LABEL, margin: [0, 0, 0, 2] }, ...namedEntries(spells)]
        : []

    const lines: TextNode[] = [
        { text: abilityLine(data.Abilities()), margin: [0, 0, 0, QUICK_REF_LINE_GAP] },
        { text: combatLine, margin: [0, 0, 0, QUICK_REF_LINE_GAP] },
        ...namedEntries(skills),
        ...namedEntries(edges),
        ...spellBlock,
        {
            text: [
                { text: 'Gear', bold: true },
                { text: ` – ${carriedItems.map(gearEntry).join(', ')}` },
            ],
        },
    ]

    return [
        {
            ...makeTable(['*'], [
                [{ text: label, bold: true, fontSize: FONT_SECTION_HEADER, fillColor: HEADER_GRAY, border: CARD_LABEL }],
                ...lines.map((line, i) => [{
                    ...line,
                    fillColor: WHITE,
                    border: i === lines.length - 1 ? CARD_BOTTOM : CARD_MIDDLE,
                }]),
            ]),
            lineHeight: QUICK_REF_LINE_HEIGHT,
            pageBreak: 'before',
        },
    ]
}
