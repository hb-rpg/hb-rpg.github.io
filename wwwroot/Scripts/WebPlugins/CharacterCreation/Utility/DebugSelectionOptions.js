import { TaggedCharacterNameData, TaggedCharacterBynameData, TaggedCharacterEpithetsData } from "../Configuration/TaggedNameData.js";
import { flattenAndFilterSelectionPackage, getMatchingMultiTaggedData } from "./FilterUtility.js";
// Dev-only inspection of what each picker is actually offering, for cross-checking against the
// rulebook. The options a dropdown shows are the end of a long chain - authored SelectionPackages,
// the update* merge functions, then the override/filter pass in flattenAndFilterSelectionPackage -
// and nothing else in the app exposes the result. Logged on modal save, so the table also captures
// the knock-on effects a save has on the other packages (e.g. confirming Background rewrites Items,
// Edges, Skills, Spells...).
//
// One row per option rather than one row per choice group: option names go in a column of their
// own, so nothing is ever truncated or clipped by the console's table rendering.
// Off in production. There is no other query-param or feature-flag infrastructure in the app, so
// this is the whole mechanism: ?debug in the URL, or running against a dev host.
const isSelectionDebugEnabled = () => {
    try {
        if (typeof location === "undefined")
            return false;
        if (location.search.includes("debug"))
            return true;
        return location.hostname === "localhost" || location.hostname === "127.0.0.1";
    }
    catch {
        // No `location` at all (node/vitest); nothing to log to a browser console anyway.
        return false;
    }
};
const byText = (a, b) => a.localeCompare(b);
// Some option names contain commas of their own ("Flask, Bountiful", "Rope, spider silk rope"), so
// a comma-joined list can't be read apart by eye. Use a separator that never occurs in the data.
const LIST_SEPARATOR = " | ";
// Every selection payload names itself differently and the per-type DetermineName lambdas live
// inside ConfiguredModals' closures, so the debug table duck-types its way to a label instead.
export const describeSelectionOption = (payload) => {
    if (payload === null || payload === undefined)
        return "—";
    if (typeof payload !== "object")
        return String(payload);
    const candidate = payload;
    // GameItem, Edges, Skill, Spell, Drawbacks
    if (typeof candidate.Name === "string")
        return candidate.Name;
    // LearnedLanguage
    if (typeof candidate.Language?.Name === "string")
        return candidate.Language.Name;
    // Corruption
    if (typeof candidate.affliction?.Effect === "string")
        return candidate.affliction.Effect;
    // Deity - the "None" sentinel and generated masters both have a blank pronoun name
    if (candidate.Pronoun)
        return (typeof candidate.Pronoun.name === "string" && candidate.Pronoun.name)
            ? candidate.Pronoun.name
            : "None / unknown god";
    return String(payload);
};
// Which rulebook entry put this option on the table. `Tags.Source` is the explicit answer where the
// data author set one (sourceTag in TagUtility); otherwise the identity tags say who it came from.
export const describeSelectionSource = (tags) => {
    if (!tags)
        return "—";
    const parts = [];
    if (tags.Source)
        parts.push(tags.Source);
    if (tags.Race)
        parts.push(`Race: ${tags.Race.Race}`);
    if (tags.Profession)
        parts.push(`Profession: ${tags.Profession.Class}${tags.Profession.Job ? ` / ${tags.Profession.Job}` : ""}`);
    if (tags.Background)
        parts.push(`Background: ${tags.Background.BackgroundType}`);
    if (tags.DevelopmentalEnvironment)
        parts.push(`Upbringing: ${tags.DevelopmentalEnvironment.Class}`);
    if (tags.Religion)
        parts.push(`Religion: ${tags.Religion.God}`);
    if (tags.PrestigeLevel)
        parts.push(`Prestige: ${tags.PrestigeLevel.Prestige}`);
    if (tags.EntanglementType)
        parts.push(`Entanglement: ${tags.EntanglementType}`);
    if (tags.Optional)
        parts.push("Optional");
    return parts.length > 0 ? parts.join(" | ") : "—";
};
// Name parts carry an array of tags rather than one; an empty array means the entry matches anybody.
const describeMultiSource = (tags) => tags.length === 0 ? "Any" : [...new Set(tags.map(describeSelectionSource))].sort(byText).join(" ; ");
// Configuration order, mirroring the modalPickers array in CharacterSheetModel - the order the user
// actually fills the wizard in. Keep the two in sync; reading the cascade top-to-bottom is the whole
// point of this log, so alphabetising here would defeat it. (Ancestry, Background, Ability Scores
// and Entanglement come earlier in the wizard but own no selection package of this shape.)
const SELECTION_PACKAGES = [
    ["Equipment", (data) => data.ItemSelections],
    ["Trinket", (data) => data.TrinketSelections],
    ["Edges", (data) => data.EdgeSelections],
    ["Skills", (data) => data.SkillsSelection],
    ["Spells", (data) => data.SpellSelection],
    ["Drawbacks", (data) => data.DrawbacksSelection],
    ["Corruption", (data) => data.CorruptionSelection],
    ["Language", (data) => data.LanguageSelections],
    ["Religion", (data) => data.ReligionSelections],
];
// The name picker doesn't use SelectionPackage at all - it filters flat MultiTagged pools with
// getMatchingMultiTaggedData - so it needs its own builder to appear in the same tree. Last, because
// Name is the final step of the wizard.
const NAME_POOLS = [
    ["Name", TaggedCharacterNameData, (data) => data.Name().Name],
    ["Byname", TaggedCharacterBynameData, (data) => data.Name().Bynames],
    ["Epithet", TaggedCharacterEpithetsData, (data) => data.Name().Epithets],
];
const buildNameTree = (label, characterData, pool, selectedAccessor) => {
    const selected = selectedAccessor(characterData);
    const sources = new Map();
    getMatchingMultiTaggedData(pool, characterData).forEach((entry) => {
        const source = describeMultiSource(entry.Tags);
        if (!sources.has(source))
            sources.set(source, { Source: source, fixed: [], choices: [{ pickCount: 1, options: [], selected: [] }] });
        const line = sources.get(source).choices[0];
        line.options.push(entry.Payload);
        if (entry.Payload === selected)
            line.selected.push(entry.Payload);
    });
    sources.forEach((group) => group.choices[0].options.sort(byText));
    return { Package: label, sources: [...sources.values()] };
};
const buildPackageTree = (label, characterData, accessor) => {
    // Insertion-ordered: sources appear in the order the data merged them, which is itself a clue
    // about which update* pass contributed what.
    const sources = new Map();
    const groupFor = (source) => {
        if (!sources.has(source))
            sources.set(source, { Source: source, fixed: [], choices: [] });
        return sources.get(source);
    };
    // Read-only: the filter only reads ChoiceGroup.options, and both override lambdas return fresh
    // ChoiceGroup copies rather than mutating the character's packages.
    const flattened = flattenAndFilterSelectionPackage(accessor(characterData)(), characterData);
    flattened.fixedSelection.forEach((fixed) => {
        groupFor(describeSelectionSource(fixed.Tags)).fixed.push(describeSelectionOption(fixed.Payload));
    });
    flattened.filteredChoiceSelection.forEach((choicePackage) => {
        const choice = choicePackage.choiceReference;
        groupFor(describeSelectionSource(choice.Tags)).choices.push({
            pickCount: choice.Payload.pickCount,
            options: choicePackage.possibleChoices().map(describeSelectionOption).sort(byText),
            // Selections may be copies made by an override lambda, so these are names, not references.
            selected: choice.Payload.selectedValues.map(describeSelectionOption).sort(byText),
        });
    });
    sources.forEach((group) => group.fixed.sort(byText));
    return { Package: label, sources: [...sources.values()] };
};
const buildAllTrees = (characterData) => [
    ...SELECTION_PACKAGES.map(([label, accessor]) => buildPackageTree(label, characterData, accessor)),
    ...NAME_POOLS.map(([label, pool, selected]) => buildNameTree(label, characterData, pool, selected)),
];
const sourceKey = (packageName, source) => `${packageName}§${source}`;
const namesOf = (group) => [...group.fixed, ...group.choices.flatMap((line) => line.options)];
const fingerprint = (trees) => {
    const map = new Map();
    trees.forEach((tree) => {
        map.set(tree.Package, {
            names: tree.sources.flatMap(namesOf),
            signature: JSON.stringify(tree),
        });
        tree.sources.forEach((group) => {
            map.set(sourceKey(tree.Package, group.Source), { names: namesOf(group), signature: JSON.stringify(group) });
        });
    });
    return map;
};
/**
 * Captures the current option tree so a later logAllSelectionOptions call can highlight what moved.
 * Call this immediately BEFORE the update* cascade runs. Cheap no-op when debugging is off.
 */
export const snapshotSelectionOptions = (characterData) => isSelectionDebugEnabled() ? fingerprint(buildAllTrees(characterData)) : undefined;
// Multiset difference, so a duplicated option name (the coin trinkets) is accounted for correctly.
const diffNames = (before, after) => {
    const counts = new Map();
    before.forEach((name) => counts.set(name, (counts.get(name) ?? 0) + 1));
    after.forEach((name) => counts.set(name, (counts.get(name) ?? 0) - 1));
    const added = [];
    const removed = [];
    counts.forEach((count, name) => {
        for (let i = 0; i < count; i++)
            removed.push(name);
        for (let i = 0; i < -count; i++)
            added.push(name);
    });
    return { added: added.sort(byText), removed: removed.sort(byText) };
};
const describeChange = (key, after, before) => {
    if (!before)
        return { changed: true, note: "" }; // no baseline - treat everything as relevant
    if (!before.has(key))
        return { changed: true, note: "  ← new" };
    const previous = before.get(key);
    const current = after.get(key);
    if (previous.signature === current.signature)
        return { changed: false, note: "" };
    const { added, removed } = diffNames(previous.names, current.names);
    const parts = [
        added.length > 0 ? `+${added.join(", +")}` : "",
        removed.length > 0 ? `-${removed.join(", -")}` : "",
    ].filter(Boolean);
    // Signature moved but the option names didn't: something structural changed (a pick count, or
    // which option is selected).
    return { changed: true, note: parts.length > 0 ? `  ← ${parts.join("  ")}` : "  ← changed" };
};
const renderPackage = (tree, after, before) => {
    const change = describeChange(tree.Package, after, before);
    // Collapsed groups are still present and expandable, so irrelevant packages stay reachable.
    const openPackage = change.changed ? console.group : console.groupCollapsed;
    openPackage(`${tree.Package}${change.note}`);
    if (tree.sources.length === 0) {
        // An empty package is a signal in its own right, so say so rather than omitting it.
        console.log("(empty)");
        console.groupEnd();
        return;
    }
    tree.sources.forEach((group) => {
        const sourceChange = describeChange(sourceKey(tree.Package, group.Source), after, before);
        const openSource = sourceChange.changed ? console.group : console.groupCollapsed;
        openSource(`Source: ${group.Source}${sourceChange.note}`);
        if (group.fixed.length > 0)
            console.log(`fixed (${group.fixed.length}): ${group.fixed.join(LIST_SEPARATOR)}`);
        if (group.choices.length > 0) {
            console.group("choices");
            group.choices.forEach((line) => {
                const chosen = line.selected.length > 0 ? `   → chosen: ${line.selected.join(LIST_SEPARATOR)}` : "";
                console.log(`Pick ${line.pickCount} of ${line.options.length}: ${line.options.join(LIST_SEPARATOR)}${chosen}`);
            });
            console.groupEnd();
        }
        console.groupEnd();
    });
    console.groupEnd();
};
/**
 * Prints every option of every selection package on the character as a nested tree:
 * package (in wizard configuration order) -> source -> fixed grants and pick groups.
 * Option names are alphabetised within each line and never truncated.
 *
 * Pass the `before` snapshot from snapshotSelectionOptions() to auto-expand only what this save
 * changed; without one, the whole tree is expanded.
 * No-op unless the debug gate is on.
 */
export const logAllSelectionOptions = (characterData, savedModalName, before) => {
    if (!isSelectionDebugEnabled())
        return;
    const trees = buildAllTrees(characterData);
    const after = fingerprint(trees);
    const nothingChanged = before !== undefined
        && [...after.keys()].every((key) => before.get(key)?.signature === after.get(key)?.signature)
        && [...before.keys()].every((key) => after.has(key));
    const context = [
        characterData.Race(),
        characterData.Profession(),
        characterData.Job(),
        characterData.JobSubset(),
    ].filter(Boolean).join(" / ");
    console.group(`[selection options] saved ${savedModalName ?? "modal"}`
        + `${context ? ` — ${context}` : ""}`
        + `${nothingChanged ? " — no changes" : ""}`);
    // On a no-op save every group collapses, which is the honest answer: that step moved nothing.
    trees.forEach((tree) => renderPackage(tree, after, before));
    console.groupEnd();
};
