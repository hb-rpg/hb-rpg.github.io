// @vitest-environment happy-dom
// `ko` and the PDF layout constants are browser globals loaded by <script> tags; vitest.setup.js
// evaluates the same files before this module graph is imported.
import { describe, expect, test } from 'vitest'
import { ConfiguredCharacterData, TaggedObservableSelectionPackageFactory } from '../Configuration/CharacterWizardData.js'
import { ItemData } from '../Configuration/ItemData.js'
import { buildDMQuickReference } from '../Utility/BuildDMQuickReference.js'
import { createTaggedData, standardSourceTag } from '../Utility/TagUtility.js'
import { GameItem, SelectionPackage, TaggedObservableSelectionPackage } from '../Contracts/TaggedData.js'
import { CharacterName } from '../Contracts/CharacterName.js'
import { Abilities } from '../Contracts/Abilities.js'
import { Skill } from '../Contracts/Skill.js'
import { Edges } from '../Contracts/Edges.js'
import { Spell } from '../Contracts/Spell.js'
import { createWealthItem } from '../Utility/BuildItems.js'

// The quick reference is a one-column table — the label bar plus one row per line. Reach for
// the rows directly when asserting on the card's borders and fills.
const body = (data: ConfiguredCharacterData): any[][] =>
    (buildDMQuickReference(data)[0] as any).table.body

// Flatten each row's single cell to a plain string so tests can assert on what the DM reads.
const lines = (data: ConfiguredCharacterData): string[] =>
    body(data).map(([cell]) =>
        Array.isArray(cell.text) ? cell.text.map((run: any) => run.text).join('') : String(cell.text)
    )

const lineStartingWith = (data: ConfiguredCharacterData, prefix: string) =>
    lines(data).find(line => line.startsWith(prefix))

const addFixed = <T>(pkg: TaggedObservableSelectionPackage<T>, ...payloads: T[]) =>
    pkg.FixedSelection.push(...payloads.map(p => createTaggedData(standardSourceTag, p)))

// Builds a character whose entire item list is `items`, with no trinkets unless given.
const characterWith = (items: GameItem[], trinkets: GameItem[] = []) => {
    const data = new ConfiguredCharacterData()
    data.ItemSelections(TaggedObservableSelectionPackageFactory(new SelectionPackage<GameItem>(items, [], []))())
    data.TrinketSelections(TaggedObservableSelectionPackageFactory(new SelectionPackage<GameItem>(trinkets, [], []))())
    return data
}

describe('identity label', () => {
    test('names the character by career background, with level and hit dice', () => {
        const data = characterWith([])
        // showEpithets opts the epithet into the printed name (see NameUtility).
        data.Name(new CharacterName('Figwig', '', 'Fierce', false, true))
        data.Race('Human' as any)
        data.Job('Apprentice Artisan' as any)
        data.Level(0)
        data.HitDie(1)

        expect(lines(data)[0]).toBe('Figwig the Fierce, Human Apprentice Artisan (0 Level/1 HD)')
    })

    test('ignores Class, which the wizard never sets', () => {
        const data = characterWith([])
        data.Name(new CharacterName('Figwig', '', 'Fierce'))
        data.Race('Human' as any)
        data.Job('Apprentice Artisan' as any)
        data.Class('Armiger')

        expect(lines(data)[0]).toContain('Human Apprentice Artisan')
        expect(lines(data)[0]).not.toContain('Armiger')
    })
})

describe('card', () => {
    test('the label bar is shaded and fully bordered', () => {
        const [[label]] = body(characterWith([]))

        expect(label.fillColor).toBe(HEADER_GRAY)
        expect(label.border).toEqual([true, true, true, true])
    })

    test('only the last row closes the box, so no rules run through the prose', () => {
        const [, ...contentRows] = body(characterWith([ItemData.Sword, ItemData.Whetstone]))

        for (const [cell] of contentRows.slice(0, -1))
            expect(cell.border).toEqual([true, false, true, false])

        expect(contentRows[contentRows.length - 1][0].border).toEqual([true, false, true, true])
    })

    test('the conditional spell block still leaves exactly one closing row', () => {
        const data = characterWith([])
        addFixed(data.SpellSelection(), new Spell({ Name: 'Spark', Description: 'A jolt of force that staggers the target.' }))

        const closing = body(data).filter(([cell]) => cell.border?.[3] && !cell.border?.[1])
        expect(closing).toHaveLength(1)
    })
})

describe('ability line', () => {
    test('abbreviates every ability to three letters', () => {
        const data = characterWith([])
        data.Abilities(new Abilities(10, 9, 9, 8, 7, 8))

        expect(lines(data)[1]).toBe('STR: 10   DEX: 9   CON: 9   INT: 8   WIS: 7   CHA: 8')
    })

    test('an unrolled ability prints an em dash rather than nothing', () => {
        const data = characterWith([])
        data.Abilities(new Abilities(10, undefined, 9, 8, 7, 8))

        expect(lines(data)[1]).toContain('DEX: —')
    })
})

describe('combat line', () => {
    test('leads with hit points and lists weapons with their stats', () => {
        const data = characterWith([ItemData.Gambeson, ItemData.CrossbowWithBolts])
        data.HitPoints(4)

        const combat = lineStartingWith(data, 'HP: ')!
        expect(combat).toMatch(/^HP: 4, /)
        expect(combat).toContain('Gambeson (Light Armor, Ud4)')
        expect(combat).toMatch(/\(Simple Ranged, 1d6, Nearby, \d+ bolts\)/)
    })

    test('weapons and armor stay off the gear line, and other items stay off the combat line', () => {
        const data = characterWith([ItemData.Gambeson, ItemData.Sword, ItemData.Whetstone])

        const combat = lineStartingWith(data, 'HP: ')!
        const gear   = lineStartingWith(data, 'Gear – ')!

        expect(combat).toContain('Sword')
        expect(combat).toContain('Gambeson')
        expect(combat).not.toContain('Whetstone')

        expect(gear).toContain('Whetstone')
        expect(gear).not.toContain('Sword')
        expect(gear).not.toContain('Gambeson')
    })
})

describe('feature blocks', () => {
    test('skills and edges print as name – description lines', () => {
        const data = characterWith([])
        addFixed(data.SkillsSelection(), new Skill('Adaptable', 'You are unusually good at many unexpected tasks.'))
        addFixed(data.EdgeSelections(), new Edges('Armaments', 'Proficient with all weapons and armors.'))

        expect(lines(data)).toContain('Adaptable – You are unusually good at many unexpected tasks.')
        expect(lines(data)).toContain('Armaments – Proficient with all weapons and armors.')
    })

    test('the spell block is omitted for a character with no spells', () => {
        expect(lines(characterWith([]))).not.toContain('SPELLS')
    })

    test('the spell block prints for a caster', () => {
        const data = characterWith([])
        addFixed(data.SpellSelection(), new Spell({ Name: 'Spark', Description: 'A jolt of force that staggers the target.' }))

        expect(lines(data)).toContain('SPELLS')
        expect(lines(data)).toContain('Spark – A jolt of force that staggers the target.')
    })
})

describe('gear line', () => {
    test('amounts print only when the character carries more than one', () => {
        const data = characterWith([
            ItemData.Whetstone,
            createWealthItem('Coins', 'Coin', 1, { Amount: 18 }),
        ])

        const gear = lineStartingWith(data, 'Gear – ')!
        expect(gear).toContain('Coins ×18')
        expect(gear).toContain('Whetstone')
        expect(gear).not.toContain('Whetstone ×')
    })

    test('coin trinkets are folded into a single coin entry', () => {
        const data = characterWith([], [
            { Name: 'Coins from selling trinket A', Amount: 5, Value: 2, Encumbrance: 0 },
            { Name: 'Coins from selling trinket B', Amount: 4, Value: 2, Encumbrance: 0 },
        ])

        const gear = lineStartingWith(data, 'Gear – ')!
        expect(gear).toContain('Coins ×18')
        expect(gear).not.toContain('selling trinket')
    })
})
