// ── PDF harness fixture ─────────────────────────────────────────────────────────
// Builds a fully-populated ConfiguredCharacterData so every section of the generated
// character sheet renders with real content. Used only by the PDF test harness
// (HarnessEntry.ts) — never by the shipping app.
//
// The constructor already wires ItemSelections (UniversalStartingGear), TrinketSelections,
// and ReligionSelections, so Weapons/Gear and Religion populate for free. Here we set the
// identity/stats and push fixed entries onto the remaining selection packages. Fixed
// selections are returned verbatim by flattenAndFilterSelectionPackage (no tag filtering
// when there are no overrides), so the builders read them directly.
import { ConfiguredCharacterData } from '../../../WebPlugins/CharacterCreation/Configuration/CharacterWizardData.js';
import { createTaggedData, standardSourceTag } from '../../../WebPlugins/CharacterCreation/Utility/TagUtility.js';
import { CharacterName } from '../../../WebPlugins/CharacterCreation/Contracts/CharacterName.js';
import { Abilities, AbilityNames } from '../../../WebPlugins/CharacterCreation/Contracts/Abilities.js';
import { Skill } from '../../../WebPlugins/CharacterCreation/Contracts/Skill.js';
import { Edges } from '../../../WebPlugins/CharacterCreation/Contracts/Edges.js';
import { Spell } from '../../../WebPlugins/CharacterCreation/Contracts/Spell.js';
import { CastingTime, MagicSchool, SpellDuration, SpellRange } from '../../../WebPlugins/CharacterCreation/Contracts/Magic.js';
import { Drawbacks } from '../../../WebPlugins/CharacterCreation/Contracts/Drawbacks.js';
import { Language, LearnedLanguage } from '../../../WebPlugins/CharacterCreation/Contracts/Language.js';
import { Entanglements, OrganizationEntanglementsGroup } from '../../../WebPlugins/CharacterCreation/Contracts/Entanglements.js';
import { DispositionsEnum } from '../../../WebPlugins/CharacterCreation/Contracts/StringTypes.js';
function addFixed(pkg, ...payloads) {
    pkg.FixedSelection.push(...payloads.map(p => createTaggedData(standardSourceTag, p)));
}
const entanglement = (name, attitude) => new Entanglements({ id: 0, name }, attitude, 'Person');
export function makeSampleCharacter() {
    const character = new ConfiguredCharacterData();
    // ── Identity & stats ─────────────────────────────────────────────────────────
    character.Name(new CharacterName('Bartholomew', 'the Bold', 'Giggly'));
    character.Abilities(new Abilities(14, 12, 13, 10, 11, 16));
    character.Class('Fighter');
    character.Level(3);
    character.HitDie(10);
    character.HitPoints(28);
    // ── Languages ────────────────────────────────────────────────────────────────
    addFixed(character.LanguageSelections(), new LearnedLanguage(new Language('Common', 'The trade tongue of the realm.', 100, 'Ch 4-1'), true, true, true), new LearnedLanguage(new Language('Old Dwarvish', 'Runic mountain speech.', 30, 'Ch 4-2'), true, true, false));
    // ── Skills ───────────────────────────────────────────────────────────────────
    addFixed(character.SkillsSelection(), new Skill('Athletics', 'Climbing, swimming, and feats of raw strength.', 'Ch 3-2'), new Skill('Intimidation', 'Cow opponents through force of presence.', 'Ch 3-5'));
    // ── Edges ────────────────────────────────────────────────────────────────────
    addFixed(character.EdgeSelections(), new Edges('Iron Grip', 'Cannot be disarmed by a single failed test.', 'Ch 5-1'), new Edges('Second Wind', 'Recover hit points once per encounter.', 'Ch 5-4'));
    // ── Spells ───────────────────────────────────────────────────────────────────
    addFixed(character.SpellSelection(), new Spell({
        Name: 'Spark',
        Description: 'A jolt of force that staggers the target.',
        Level: 0,
        School: [MagicSchool.Evocation],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Instantaneous,
        Test: [AbilityNames.Dexterity],
        reference: 'Ch 6-1',
    }), new Spell({
        Name: 'Mend',
        Description: 'Knit minor wounds and broken gear.',
        Level: 1,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Permanent,
        Test: [],
        reference: 'Ch 6-3',
    }));
    // ── Drawbacks ────────────────────────────────────────────────────────────────
    addFixed(character.DrawbacksSelection(), new Drawbacks('Hot-Headed', 'Temperament', 'Provoked easily; takes a penalty to resist taunts.', 'Ch 7-2'));
    // ── Entanglements (attitudes shown in the Entanglements column) ───────────────
    character.OrganizationEntanglements(new OrganizationEntanglementsGroup(entanglement('Guild colleagues', DispositionsEnum.Friendly), entanglement('House Aldermoor', DispositionsEnum.Receptive), entanglement('City watch', DispositionsEnum.Disinterested), entanglement('Temple of the Dawn', DispositionsEnum.Negative), entanglement('Master-at-arms', DispositionsEnum.Friendly), entanglement('Riverside neighbors', DispositionsEnum.Receptive), entanglement('The Black Coins', DispositionsEnum.Hostile)));
    return character;
}
