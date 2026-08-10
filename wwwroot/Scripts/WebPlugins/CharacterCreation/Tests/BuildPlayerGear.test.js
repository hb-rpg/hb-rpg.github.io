// @vitest-environment happy-dom
// `ko` and the PDF layout constants are browser globals loaded by <script> tags; vitest.setup.js
// evaluates the same files before this module graph is imported.
import { describe, expect, test } from 'vitest';
import { ConfiguredCharacterData, TaggedObservableSelectionPackageFactory } from '../Configuration/CharacterWizardData.js';
import { ItemData } from '../Configuration/ItemData.js';
import { buildPlayerGear } from '../Utility/BuildPlayerGear.js';
import { SelectionPackage } from '../Contracts/TaggedData.js';
const gearBody = (content) => content[0].stack[1].table.body;
const sectionTitles = (content) => gearBody(content).filter(row => row[0].colSpan !== undefined).map(row => row[0].text);
// Builds a character whose entire item list is `items`, with no trinkets.
const characterWith = (items) => {
    const data = new ConfiguredCharacterData();
    data.ItemSelections(TaggedObservableSelectionPackageFactory(new SelectionPackage(items, [], []))());
    data.TrinketSelections(TaggedObservableSelectionPackageFactory(new SelectionPackage([], [], []))());
    return data;
};
describe('gear sections', () => {
    test('all the gear is one GEAR section', () => {
        const content = buildPlayerGear(characterWith([ItemData.Sword, ItemData.Gambeson, ItemData.Whetstone]));
        expect(content).toHaveLength(1);
        expect(content[0].stack[0].text).toBe('GEAR');
    });
    test('the column headers are stated once, above the first subsection', () => {
        const body = gearBody(buildPlayerGear(characterWith([ItemData.Sword])));
        expect(body[0].map(cell => cell.text)).toEqual(['ITEM', 'AMOUNT', 'REFERENCE']);
        expect(body.slice(1).filter(row => row[0].text === 'ITEM')).toHaveLength(0);
    });
    test('a subsection with nothing in it is left off the sheet', () => {
        const titles = sectionTitles(buildPlayerGear(characterWith([ItemData.Whetstone])));
        expect(titles).not.toContain('ANIMALS & TRANSPORT');
        expect(titles).not.toContain('WEAPONS & AMMUNITION');
        expect(titles).not.toContain('WEALTH');
    });
    test('the catch-all OTHER subsection always prints, even with no gear at all', () => {
        expect(sectionTitles(buildPlayerGear(characterWith([])))).toEqual(['OTHER']);
    });
    test('every subsection trails blank rows to write new loot into', () => {
        // Sword and Gambeson land in different subsections, so each one's rows are:
        // title, the item, then the blank write-in rows.
        const body = gearBody(buildPlayerGear(characterWith([ItemData.Sword, ItemData.Gambeson])));
        const blanks = (from) => body.slice(from).findIndex(row => row[0].text !== '');
        expect(body[1][0].text).toBe('WEAPONS & AMMUNITION');
        expect(blanks(3)).toBe(2); // two blanks, then the ARMOR & CLOTHING title
        expect(body[5][0].text).toBe('ARMOR & CLOTHING');
        expect(blanks(7)).toBe(2); // two blanks, then the OTHER title
        expect(body.slice(10).every(row => row[0].text === '')).toBe(true); // OTHER's five blanks
        expect(body).toHaveLength(15);
    });
    test('items are routed to the subsection matching their category', () => {
        const titles = sectionTitles(buildPlayerGear(characterWith([
            ItemData.Sword, // melee
            ItemData.Gambeson, // armor
            ItemData.StandardRations, // ration
            ItemData.Gems, // wealth
            ItemData.Sack, // container
            ItemData.RidingHorse, // animal
            ItemData.Whetstone, // tool → catch-all
        ])));
        expect(titles).toEqual([
            'WEAPONS & AMMUNITION',
            'ARMOR & CLOTHING',
            'PROVISIONS',
            'WEALTH',
            'CONTAINERS',
            'ANIMALS & TRANSPORT',
            'OTHER',
        ]);
    });
    test('a dwarf gets a WEALTH section for their gems', () => {
        const titles = sectionTitles(buildPlayerGear(characterWith(ItemData.RaceRecord.Dwarf.FixedSelection)));
        expect(titles).toContain('WEALTH');
    });
});
describe('item column', () => {
    // Body row 0 is the column header, row 1 the subsection title, so the item lands on row 2.
    const entryFor = (item) => gearBody(buildPlayerGear(characterWith([item])))[2][0].text;
    test('weapon stats come from the typed fields, not prose', () => {
        expect(entryFor(ItemData.CrossbowWithBolts))
            .toMatch(/^Crossbow \(Simple Ranged, 1d6, Nearby, \d+ bolts\)$/);
        expect(entryFor(ItemData.UtilityKnife))
            .toBe('Knife (Light Melee, 1d2, Thrown: Nearby)');
    });
    test('armor prints its usage die', () => {
        expect(entryFor(ItemData.Gambeson)).toBe('Leather Gambeson (Light Armor, Ud4)');
    });
    test('an item with neither stats nor description prints as a bare name', () => {
        expect(entryFor(ItemData.Whetstone)).toBe('Whetstone');
    });
});
