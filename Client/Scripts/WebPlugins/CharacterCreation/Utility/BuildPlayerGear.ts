import { ConfiguredCharacterData } from '../Configuration/CharacterWizardData.js'
import { flattenAndCombineSelectionPackage } from './UpdateUtility.js'
import { columnHeaderRow, dataRow, groupHeaderRow, makeSection } from '../../../Framework/PDFs/Helpers.js';
import { GameItem, ItemTypes } from '../Contracts/TaggedData.js';
import { createWealthItem } from './BuildItems.js';
import type { Content, TableCell, Width } from '../../../Framework/PDFs/Types.js';

// "Coin" trinkets are produced by the sell-trinket coin factory; their name always carries
// this marker and the coins they're worth is Amount × Value (see ItemData genericCoinFactory).
const COIN_TRINKET_MARKER = 'Coins from selling trinket'
const isCoinTrinket = (item: GameItem) => item.Name.includes(COIN_TRINKET_MARKER)

// Gear prints as one table whose rows are broken up by themed subsection headers rather than as
// one flat list. Anything whose category isn't claimed here (tools, rope, uncategorized trinkets)
// falls through to the catch-all OTHER subsection.
const GEAR_SECTIONS: { title: string, types: ItemTypes[] }[] = [
    { title: 'WEAPONS & AMMUNITION', types: [ItemTypes.Melee, ItemTypes.Ranged, ItemTypes.Ammo] },
    { title: 'ARMOR & CLOTHING',     types: [ItemTypes.Armor, ItemTypes.NonArmorWearables] },
    { title: 'PROVISIONS',           types: [ItemTypes.Ration, ItemTypes.Consumable] },
    { title: 'WEALTH',               types: [ItemTypes.Wealth] },
    { title: 'CONTAINERS',           types: [ItemTypes.Container] },
    { title: 'ANIMALS & TRANSPORT',  types: [ItemTypes.Animal, ItemTypes.TransportEquipment] },
]

// Name and description share one column — "Sword (Martial Melee, 1d8)" — so the sentence gets the
// full width instead of being squeezed beside a name column that's mostly whitespace.
const GEAR_COLUMNS: Width[] = ['*', GEAR_AMOUNT_COL_WIDTH, REFERENCE_COL_WIDTH]
const GEAR_HEADERS = ['ITEM', 'AMOUNT', 'REFERENCE']

// The catch-all can't be called GEAR any more — that now names the whole table.
const OTHER_SECTION_TITLE = 'OTHER'

// The mechanical facts an item carries, as separate phrases. Exported because the DM quick
// reference prints them inline in parentheses, without the flavour text describeItem appends.
export function itemStats(item: GameItem): string[] {
    const stats: string[] = []

    switch (item.Type) {
        case ItemTypes.Melee:
            stats.push(`${item.WeaponType} Melee`, item.Damage)
            if (item.Range) stats.push(`Thrown: ${item.Range}`)
            break
        case ItemTypes.Ranged:
            stats.push(`${item.WeaponType} Ranged`, item.Damage, item.Range)
            if (item.Ammo > 0) stats.push(`${item.Ammo} ${item.AmmoType ?? 'shots'}`)
            break
        case ItemTypes.Ammo:
            stats.push(`Ammunition for ${item.ForWeapon}`, item.Damage)
            break
        case ItemTypes.Armor:
            stats.push(item.ArmorType)
            if (item.UsageDie) stats.push(item.UsageDie)
            if (item.Defense) stats.push(`Defense ${item.Defense}`)
            if (item.Limit) stats.push(item.Limit)
            break
        case ItemTypes.Ration:
            stats.push(`${item.Servings} serving${item.Servings === 1 ? '' : 's'}`)
            break
        // case ItemTypes.Wealth:
        //     if (item.ValuePerUnit) stats.push(`${item.ValuePerUnit} coins per ${item.WealthType.toLowerCase()}`)
        //     break
        case ItemTypes.Container:
            if (item.Capacity.length > 0) stats.push(`Holds ${item.Capacity.join(' / ')}`)
            break
        case ItemTypes.Rope:
            stats.push(`${item.Length} ft`)
            break
    }

    return stats
}

// The description column's sentence: stats first, then whatever flavour text the item has.
function describeItem(item: GameItem): string {
    return [itemStats(item).join(', '), item.Description].filter(text => text).join('. ')
}

// "Sword (Martial Melee, 1d8. A soldier's blade.)" — the parenthetical is dropped for items that
// carry neither stats nor flavour text, so they never print an empty "()".
function itemEntry(item: GameItem): string {
    const description = describeItem(item)
    return description ? `${item.Name} (${description})` : item.Name
}

function gearRows(items: GameItem[], extraRows = 0): TableCell[][] {
    return Array.from({ length: items.length + extraRows }, (_, i) => {
        const item = items[i]
        return dataRow([
            item ? itemEntry(item) : '',
            item?.Amount !== undefined ? String(item.Amount) : '',
            '',
        ], i % 2 === 1)
    })
}

// Everything the character carries, as one name-sorted list: items plus trinkets, with any "coin"
// trinkets folded into a single coin pile instead of listed one by one. Exported so the DM quick
// reference works from exactly the same inventory the gear sections print.
export function collectGear(data: ConfiguredCharacterData): GameItem[] {
    const items    = flattenAndCombineSelectionPackage(data.ItemSelections(), data)
    const trinkets = flattenAndCombineSelectionPackage(data.TrinketSelections(), data)

    const earnedCoins = trinkets
        .filter(isCoinTrinket)
        .reduce((sum, trinket) => sum + (trinket.Amount ?? 0) * (trinket.Value ?? 0), 0)

    const gear = [...items, ...trinkets.filter(trinket => !isCoinTrinket(trinket))]

    if (earnedCoins > 0) {
        const coins = gear.find(item => item.Name === 'Coins')
        if (coins) {
            // Replace (never mutate — Items are shared singletons) with a merged copy.
            gear[gear.indexOf(coins)] = createWealthItem('Coins', 'Coin', 1, {
                Amount: (coins.Amount ?? 0) + earnedCoins,
                Description: coins.Description,
            })
        } else {
            gear.push(createWealthItem('Coins', 'Coin', 1, {
                Amount: earnedCoins,
                Description: 'Coins earned from selling trinkets',
            }))
        }
    }

    return gear.sort((a, b) => a.Name.localeCompare(b.Name))
}

// ── Page 1 (bottom): gear, one table subdivided by category ──────────────────
export function buildPlayerGear(data: ConfiguredCharacterData) : Content[] {
    const allItems = collectGear(data)
    const claimedTypes = GEAR_SECTIONS.flatMap(section => section.types)

    // A subsection the character owns nothing for is left off the sheet entirely. The ones that do
    // print trail a couple of blank rows so new loot can be written into the right category rather
    // than piling up under OTHER.
    const typedRows = GEAR_SECTIONS.flatMap(section => {
        const sectionItems = allItems.filter(item => item.Type !== undefined && section.types.includes(item.Type))
        if (sectionItems.length === 0) return []

        return [
            groupHeaderRow(section.title, GEAR_HEADERS.length),
            ...gearRows(sectionItems, EXTRA_SUBSECTION_ROWS),
        ]
    })

    // The catch-all always prints — it carries the blank rows players write new loot into.
    const remainingItems = allItems.filter(item => item.Type === undefined || !claimedTypes.includes(item.Type))

    return [
        makeSection('GEAR', GEAR_COLUMNS, [
            // The column headers are stated once, up top; the subsection titles below them span
            // the full width and just group the rows that follow.
            columnHeaderRow(GEAR_HEADERS),
            ...typedRows,
            groupHeaderRow(OTHER_SECTION_TITLE, GEAR_HEADERS.length),
            ...gearRows(remainingItems, EXTRA_GEAR_ROWS),
        ]),
    ]
}
