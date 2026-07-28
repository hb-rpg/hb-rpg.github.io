// @vitest-environment happy-dom
import { describe, expect, test } from 'vitest'
import { ItemData } from '../Configuration/ItemData.js'
import { ChoiceGroup, GameItem, ItemTypes, SelectionPackage } from '../Contracts/TaggedData.js'
import { JobSubsetEnum } from '../Contracts/StringTypes.js'

const allPackages: { label: string, pkg: SelectionPackage<GameItem> }[] = [
    { label: 'UniversalStartingGear', pkg: ItemData.UniversalStartingGear },
    ...Object.entries(ItemData.RaceRecord).map(([label, pkg]) => ({ label: `Race:${label}`, pkg })),
    ...Object.entries(ItemData.JobTypeToItem).map(([label, pkg]) => ({ label: `Job:${label}`, pkg })),
    ...Object.entries(ItemData.JobSubsetToItem).map(([label, pkg]) => ({ label: `JobSubset:${label}`, pkg })),
]

const itemsIn = (pkg: SelectionPackage<GameItem>): GameItem[] => [
    ...pkg.FixedSelection,
    ...pkg.OverrideSelection,
    ...pkg.ChoiceSelection.flatMap((group: ChoiceGroup<GameItem>) => group.options),
]

// Items a category would only mislabel — odd curios with no mechanical role.
const UNCATEGORIZED_BY_DESIGN = new Set([
    'Coin, Lucky Copper', 'Crystal, glowing', 'Glass Marbles, dozen', 'Lucky Dice, pair',
    'Lodestone on a leather thong', 'Rosewood flute', 'Lucky Statuette Jade Monkey',
])

describe('every granted item is categorized', () => {
    for (const { label, pkg } of allPackages) {
        test(label, () => {
            for (const item of itemsIn(pkg)) {
                expect(item.Name, `${label} grants an unnamed item`).toBeTruthy()
                if (UNCATEGORIZED_BY_DESIGN.has(item.Name)) continue
                expect(item.Type, `${label} grants "${item.Name}" with no ItemTypes category`).not.toBeUndefined()
            }
        })
    }

    test('trinkets are categorized or deliberately uncategorized', () => {
        for (const trinket of ItemData.basicTrinketSection) {
            if (UNCATEGORIZED_BY_DESIGN.has(trinket.Name)) continue
            expect(trinket.Type, `trinket "${trinket.Name}" has no category`).not.toBeUndefined()
        }
    })
})

describe('compound items stay broken apart', () => {
    // Guards the regression where one "item" was really several ("Crossbow and bolts",
    // "Toolbox … contains hammers, chisels, files"). Ranged weapons are exempt: they legitimately
    // carry their ammunition, because a ChoiceGroup can only hand out one object.
    const COMPOUND = /\b(and|contains|includes)\b/i

    // Single things whose name happens to read as a list: one garment, one lot of trinkets.
    const SINGLE_BY_DESIGN = new Set([
        'Cloak and Hat',                              // one outfit, and one option of a ChoiceGroup
        'Ragged and dirty shirt and pants',           // one set of rags
        'Baubles and miscellaneous small equipment',  // a lot of oddments sold by weight
    ])

    for (const { label, pkg } of allPackages) {
        test(label, () => {
            for (const item of itemsIn(pkg)) {
                if (item.Type === ItemTypes.Ranged || SINGLE_BY_DESIGN.has(item.Name)) continue
                expect(item.Name, `${label}: "${item.Name}" reads like several items`).not.toMatch(COMPOUND)
            }
        })
    }
})

describe('ranged weapons carry their ammunition', () => {
    for (const weapon of [ItemData.CrossbowWithBolts, ItemData.ShortBowWithArrows, ItemData.SlingWithStones]) {
        test(weapon.Name, () => {
            expect(weapon.Type).toBe(ItemTypes.Ranged)
            expect(weapon.Ammo, `${weapon.Name} should start loaded`).toBeGreaterThan(0)
            expect(weapon.AmmoType).toBeTruthy()
        })
    }
})

describe('trinket packages', () => {
    // BuildPlayerGear folds trinkets sold for coin into the coin pile by matching this marker.
    test('sell-for-coin options keep the marker BuildPlayerGear matches on', () => {
        const pkg = ItemData.getTrinketPackage('Human', 'Dowser', JobSubsetEnum.None)
        const options = pkg.ChoiceSelection.flatMap(group => group.options)

        const coinOptions = options.filter(option => option.Name.includes('Coins from selling trinket'))
        expect(coinOptions.length).toBeGreaterThan(0)
        for (const coins of coinOptions) {
            expect(coins.Type).toBe(ItemTypes.Wealth)
            expect(coins.Value).toBeGreaterThan(0)
        }
    })

    test('every trinket can be sold, so each carries a Value', () => {
        for (const trinket of ItemData.basicTrinketSection)
            expect(trinket.Value, `${trinket.Name} has no sale Value`).toBeGreaterThan(0)
    })
})

describe('selection packages share item singletons', () => {
    // Overrides (e.g. Street Urchin losing their Coins) are matched by object identity in
    // flattenAndFilterSelectionPackage, so an override must point at the very same object.
    test('Street Urchin overrides the universal Coins object', () => {
        const overrides = ItemData.JobTypeToItem['Street Urchin'].OverrideSelection
        expect(overrides).toContain(ItemData.Coins)
        expect(ItemData.UniversalStartingGear.FixedSelection).toContain(ItemData.Coins)
    })
})
