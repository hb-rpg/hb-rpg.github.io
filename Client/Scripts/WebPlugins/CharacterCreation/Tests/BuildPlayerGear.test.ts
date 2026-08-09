// @vitest-environment happy-dom
// `ko` and the PDF layout constants are browser globals loaded by <script> tags; vitest.setup.js
// evaluates the same files before this module graph is imported.
import { describe, expect, test } from 'vitest'
import { ConfiguredCharacterData, TaggedObservableSelectionPackageFactory } from '../Configuration/CharacterWizardData.js'
import { ItemData } from '../Configuration/ItemData.js'
import { buildPlayerGear } from '../Utility/BuildPlayerGear.js'
import { GameItem, SelectionPackage } from '../Contracts/TaggedData.js'

type Section = { stack: [{ text: string }, unknown] }
const sectionTitles = (content: unknown[]) => content.map(node => (node as Section).stack[0].text)

// Builds a character whose entire item list is `items`, with no trinkets.
const characterWith = (items: GameItem[]) => {
    const data = new ConfiguredCharacterData()
    data.ItemSelections(TaggedObservableSelectionPackageFactory(new SelectionPackage<GameItem>(items, [], []))())
    data.TrinketSelections(TaggedObservableSelectionPackageFactory(new SelectionPackage<GameItem>([], [], []))())
    return data
}

describe('gear sections', () => {
    test('a section with nothing in it is left off the sheet', () => {
        const titles = sectionTitles(buildPlayerGear(characterWith([ItemData.Whetstone])))

        expect(titles).not.toContain('ANIMALS & TRANSPORT')
        expect(titles).not.toContain('WEAPONS & AMMUNITION')
        expect(titles).not.toContain('WEALTH')
    })

    test('the catch-all GEAR section always prints, even with no gear at all', () => {
        expect(sectionTitles(buildPlayerGear(characterWith([])))).toEqual(['GEAR'])
    })

    test('items are routed to the section matching their category', () => {
        const titles = sectionTitles(buildPlayerGear(characterWith([
            ItemData.Sword,          // melee
            ItemData.Gambeson,       // armor
            ItemData.StandardRations,// ration
            ItemData.Gems,           // wealth
            ItemData.Sack,           // container
            ItemData.RidingHorse,    // animal
            ItemData.Whetstone,      // tool → catch-all
        ])))

        expect(titles).toEqual([
            'WEAPONS & AMMUNITION',
            'ARMOR & CLOTHING',
            'PROVISIONS',
            'WEALTH',
            'CONTAINERS',
            'ANIMALS & TRANSPORT',
            'GEAR',
        ])
    })

    test('a dwarf gets a WEALTH section for their gems', () => {
        const titles = sectionTitles(buildPlayerGear(characterWith(ItemData.RaceRecord.Dwarf.FixedSelection)))
        expect(titles).toContain('WEALTH')
    })
})

describe('description column', () => {
    const rowsOf = (section: any) => section.stack[1].table.body as { text: string }[][]
    const describe_ = (item: any) => {
        const [weapons] = buildPlayerGear(characterWith([item])) as any[]
        return rowsOf(weapons)[1][1].text
    }

    test('weapon stats come from the typed fields, not prose', () => {
        expect(describe_(ItemData.CrossbowWithBolts))
            .toMatch(/^Simple Ranged, 1d6, Nearby, \d+ bolts$/)
        expect(describe_(ItemData.UtilityKnife))
            .toBe('Light Melee, 1d2, Thrown: Nearby.')
    })

    test('armor prints its usage die', () => {
        expect(describe_(ItemData.Gambeson)).toBe('Light Armor, Ud4')
    })
})
