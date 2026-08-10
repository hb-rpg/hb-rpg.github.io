import { ko } from "../../../../Framework/Knockout/ko.js";
import { CareerData } from "../../Configuration/CareerData.js";
import { Races } from "../../Configuration/DispositionData.js";
import { ReligionData } from "../../Configuration/DietiesData.js";
import { AbilitiesToArray } from "../../Contracts/Abilities.js";
import { DiceRoll } from "../../Utility/DiceRoll.js";
import { EntanglementOrganizationTypesEnum } from "../../Contracts/StringTypes.js";
import { createGenericPicker, updateRaceItemsData, updateRaceEdgesData, flattenAndCombineSelectionPackage, updateNameData, updateRaceSkillsData, updateRaceLanguageData, updateBackgroundItems, updateBackgroundEdges, updateBackgroundLanguages, updateBackgroundSkills, updateEntanglementBackgroundAffects, updateBackgroundSpells, updateEdgesSpells, updateBackgroundCorruption, updateBackgroundDrawbacks, updateRaceDrawbackData } from "../../Utility/UpdateUtility.js";
import { PreviewModel, StringPreviewModel, StringListPreviewModel, LanguagePreviewModel, AbilityPreviewModel, EntanglementPreviewContainerModel } from "../Preview/PreviewModel.js";
import { AbilityScoresModel } from "../AbilityScoresModel.js";
import { AncestryViewModel } from "./AncestryViewModel.js";
import { SelectionPackageConfigurationModel } from "./SelectionPackageConfigurationModel.js";
import { JobBackgroundPickerModel } from "./JobBackgroundPickerModel.js";
import { createEntanglementPreview } from "../../Contracts/Entanglements.js";
import { EntanglementCreationModel } from "./EntanglementCreationModel.js";
import { Utility } from "../../../../WebCore/Utility.js";
import { TaggedCharacterNameData, TaggedCharacterBynameData, TaggedCharacterEpithetsData } from "../../Configuration/TaggedNameData.js";
import { NameUtility } from "../../Utility/NameUtility.js";
import { CreateObjectModel } from "../CreateObjectModel.js";
import { LockableObjectPickerModel } from "../LockableObjectPickerModel.js";
import { NamePickerModel } from "./NamePickerModel.js";
import { NoteModel } from "../NoteModel.js";
import { EdgesExplanation, SkillsExplanation, SpellsExplanation, TrinketQualifier, TrinketExplanation, LanguageExplanation, DrawbacksExplanation, CorruptionExplanation, ReligionExplanation } from "../../Configuration/ConceptIntroductions.js";
const truncate = (text, max = 80) => text.length > max ? text.slice(0, max) + "…" : text;
// "Mending (Level 0, Ritual) - You are able to fix…". The qualifiers sit right after the name so
// they survive truncation in the dropdown. Spells with no assigned level omit that part.
const describeSpell = (spell) => {
    const qualifiers = [];
    if (spell.Level !== undefined)
        qualifiers.push(`Level ${spell.Level}`);
    if (spell.IsRitual)
        qualifiers.push("Ritual");
    const suffix = qualifiers.length > 0 ? ` (${qualifiers.join(", ")})` : "";
    return `${spell.Name}${suffix}${spell.Description ? " - " + spell.Description : ""}`;
};
export var ConfiguredModals;
(function (ConfiguredModals) {
    ConfiguredModals.createAncestryPickerModel = (characterData) => {
        const ancestryModel = new AncestryViewModel(characterData, Races);
        return createGenericPicker({
            name: "Ancestry",
            characterData,
            pickerModel: ancestryModel,
            dataSelector: (data) => data.Race,
            onUpdate: (data) => {
                ancestryModel.Evaluate();
                updateRaceItemsData(data, "Ancestry");
                updateRaceLanguageData(data);
                updateRaceEdgesData(data, "Ancestry");
                updateRaceSkillsData(data, "Ancestry");
                updateRaceDrawbackData(data, "Ancestry");
                updateNameData(data);
            },
            createPreview: (modal) => new PreviewModel(modal.FriendlyName, ko.observable(-1), new StringPreviewModel(characterData.Race), ko.observable(false), modal.Randomize.bind(modal), modal.EditItem.bind(modal))
        });
    };
    ConfiguredModals.createEdgesPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.EdgeSelections.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const edgesModel = new SelectionPackageConfigurationModel("Edges", characterData, (data) => data.EdgeSelections, (item) => truncate(item.Name + " - " + item.Description), (item) => item.Name + " - " + item.Description, isConfigured, undefined, NoteModel.bundle(EdgesExplanation));
        return createGenericPicker({
            name: "Edges",
            characterData,
            pickerModel: edgesModel,
            dataSelector: (data) => data.EdgeSelections,
            createPreview: (modal) => new PreviewModel("Edges", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => {
                edgesModel.Evaluate();
                updateEdgesSpells(characterData);
            }
        });
    };
    ConfiguredModals.createSkillsPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.SkillsSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const skillsModel = new SelectionPackageConfigurationModel("Skills", characterData, (data) => data.SkillsSelection, (item) => truncate(item.Name + " - " + item.Description), (item) => item.Name + " - " + item.Description, isConfigured, undefined, NoteModel.bundle(SkillsExplanation));
        return createGenericPicker({
            name: "Skills",
            characterData,
            pickerModel: skillsModel,
            dataSelector: (data) => data.SkillsSelection,
            createPreview: (modal) => new PreviewModel("Skills", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { skillsModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.SkillsSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };
    ConfiguredModals.createBackgroundPickerModel = (characterData) => {
        const displayLabel = ko.observable("");
        characterData.JobBackground.subscribe((background) => {
            displayLabel(background ? background.Name : "Unknown");
        });
        const backgroundModel = new JobBackgroundPickerModel(characterData, CareerData.possibleProfessions, CareerData.ProfessionToJobData, CareerData.JobToStoryData, CareerData.JobSubsetData);
        return createGenericPicker({
            name: "Background",
            characterData,
            pickerModel: backgroundModel,
            dataSelector: (data) => data.JobBackground,
            createPreview: (modal) => new PreviewModel(modal.FriendlyName, ko.observable(-1), new StringPreviewModel(displayLabel), ko.observable(false), modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: (data) => {
                backgroundModel.Evaluate();
                updateBackgroundItems(data);
                updateBackgroundEdges(data);
                updateBackgroundSkills(data);
                updateBackgroundLanguages(data);
                updateEntanglementBackgroundAffects(data);
                updateBackgroundSpells(data);
                updateBackgroundCorruption(data);
                updateBackgroundDrawbacks(data);
            }
        });
    };
    ConfiguredModals.createAbilityScoresPickerModel = (characterData) => {
        const abilitiesModel = new AbilityScoresModel(characterData);
        // Derives configured state from actual data so that cancelling the modal (which
        // doesn't write to characterData.Abilities) correctly reverts the preview to
        // "not configured". Uses a writable computed so that the eager IsConfigured(true)
        // call in PreviewModel.Edit() is silently ignored.
        const isConfigured = ko.computed({
            read: () => {
                const arr = AbilitiesToArray(characterData.Abilities());
                return arr.length === DiceRoll.ABILITY_SCORE_AMOUNT && arr.every(v => v > 0);
            },
            write: (_value) => { }
        });
        return createGenericPicker({
            name: "Ability Scores",
            characterData,
            pickerModel: abilitiesModel,
            dataSelector: (data) => data.Abilities,
            createPreview: (modal) => new PreviewModel(modal.FriendlyName, ko.observable(-1), new AbilityPreviewModel(characterData.Abilities), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { abilitiesModel.Evaluate(); }
        });
    };
    ConfiguredModals.createEquipmentPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.ItemSelections.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const equipmentModel = new SelectionPackageConfigurationModel("Equipment", characterData, (data) => data.ItemSelections, (item) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`), (item) => `${item.Name}${item.Description ? " - " + item.Description : ""}${item.Amount ? " x" + item.Amount : ""}`, isConfigured);
        return createGenericPicker({
            name: "Equipment",
            characterData,
            pickerModel: equipmentModel,
            dataSelector: (data) => data.ItemSelections,
            createPreview: (modal) => new PreviewModel("Equipment", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { equipmentModel.Evaluate(); }
        });
    };
    ConfiguredModals.createEntanglementPickerModel = (characterData) => {
        const entanglementPreview = ko.observableArray([]);
        characterData.OrganizationEntanglements.subscribe((newValue) => {
            const finalPreview = [
                createEntanglementPreview(EntanglementOrganizationTypesEnum.CivicAuthorities, newValue.CivicAuthorities),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Colleagues, newValue.Colleagues),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Family, newValue.Family),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Master, newValue.Master),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Neighbors, newValue.Neighbors),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.ReligiousAuthorities, newValue.ReligiousAuthorities),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.ShadowGroups, newValue.ShadowGroups)
            ];
            entanglementPreview(finalPreview);
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        const entanglementModel = new EntanglementCreationModel(characterData);
        return createGenericPicker({
            name: "Entanglement",
            characterData,
            pickerModel: entanglementModel,
            dataSelector: (data) => data.OrganizationEntanglements,
            createPreview: (modal) => new PreviewModel("Entanglement", ko.observable(-1), new EntanglementPreviewContainerModel(entanglementPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { entanglementModel.Evaluate(); }
        });
    };
    ConfiguredModals.createTrinketPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.TrinketSelections.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const trinketModel = new SelectionPackageConfigurationModel("Trinket", characterData, (data) => data.TrinketSelections, (item) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`), (item) => `${item.Name}${item.Description ? " - " + item.Description : ""}${item.Amount ? " x" + item.Amount : ""}`, isConfigured, NoteModel.bundle(TrinketQualifier), NoteModel.bundle(TrinketExplanation));
        return createGenericPicker({
            name: "Trinket",
            characterData,
            pickerModel: trinketModel,
            dataSelector: (data) => data.TrinketSelections,
            createPreview: (modal) => new PreviewModel("Trinket", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { trinketModel.Evaluate(); }
        });
    };
    ConfiguredModals.createLanguagePickerModel = (characterData) => {
        const languagePreview = ko.observableArray([]);
        characterData.LanguageSelections.subscribe((newValue) => {
            languagePreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x));
        });
        const determineName = (language) => {
            return `${language.Language.Name} (${(language.canSpeak) ? " Speak " : ""} ${(language.canRead) ? " Read " : ""} ${(language.canWrite) ? " Write " : ""})`;
        };
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const languageModel = new SelectionPackageConfigurationModel("Language", characterData, (data) => data.LanguageSelections, (item) => truncate(item.Language.Name), (item) => determineName(item) + ": " + item.Language.Description, isConfigured, undefined, NoteModel.bundle(LanguageExplanation));
        return createGenericPicker({
            name: "Language",
            characterData,
            pickerModel: languageModel,
            dataSelector: (data) => data.LanguageSelections,
            createPreview: (modal) => new PreviewModel("Language", ko.observable(-1), new LanguagePreviewModel(languagePreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { languageModel.Evaluate(); }
        });
    };
    ConfiguredModals.createSpellPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.SpellSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const spellsModel = new SelectionPackageConfigurationModel("Spells", characterData, (data) => data.SpellSelection, (item) => truncate(describeSpell(item)), (item) => describeSpell(item), isConfigured, undefined, NoteModel.bundle(SpellsExplanation));
        return createGenericPicker({
            name: "Spells",
            characterData,
            pickerModel: spellsModel,
            dataSelector: (data) => data.SpellSelection,
            createPreview: (modal) => new PreviewModel("Spells", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { spellsModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.SpellSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };
    ConfiguredModals.createDrawbackPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.DrawbacksSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const drawbacksModel = new SelectionPackageConfigurationModel("Drawbacks", characterData, (data) => data.DrawbacksSelection, (item) => truncate(item.Name), (item) => `${item.Name}${item.Description ? " - " + item.Description : ""}`, isConfigured, undefined, NoteModel.bundle(DrawbacksExplanation));
        return createGenericPicker({
            name: "Drawbacks",
            characterData,
            pickerModel: drawbacksModel,
            dataSelector: (data) => data.DrawbacksSelection,
            createPreview: (modal) => new PreviewModel("Drawbacks", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { drawbacksModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.DrawbacksSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };
    ConfiguredModals.createCorruptionPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.CorruptionSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.affliction.Effect).sort());
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        const corruptionModel = new SelectionPackageConfigurationModel("Corruption", characterData, (data) => data.CorruptionSelection, (item) => truncate(`${item.affliction.Effect}${item.affliction.Description ? " - " + item.affliction.Description : ""}`), (item) => `${item.affliction.Effect}${item.affliction.Description ? " - " + item.affliction.Description : ""}`, isConfigured, undefined, NoteModel.bundle(CorruptionExplanation));
        return createGenericPicker({
            name: "Corruption",
            characterData,
            pickerModel: corruptionModel,
            dataSelector: (data) => data.CorruptionSelection,
            createPreview: (modal) => new PreviewModel("Corruption", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { corruptionModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.CorruptionSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };
    ConfiguredModals.createDeityPickerModel = (characterData) => {
        const stringPreview = ko.observableArray([]);
        characterData.ReligionSelections.subscribe((newValue) => {
            const worshipped = ReligionData.realDeities(flattenAndCombineSelectionPackage(newValue, characterData));
            stringPreview(worshipped.length > 0
                ? worshipped.map(x => (x.Pronoun.name) ? x.Pronoun.name : "An unknown god")
                : ["None"]);
        });
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        // Moving into or out of the Religious profession changes whether "None" is on offer
        characterData.Profession.subscribe(() => isConfigured(false));
        const religionModel = new SelectionPackageConfigurationModel("Religion", characterData, (data) => data.ReligionSelections, (item) => truncate(item.Pronoun.name ? item.Description : "An unknown god"), (item) => `${item.Pronoun.name}: ${item.Description}`, isConfigured, undefined, NoteModel.bundle(ReligionExplanation), ReligionData.isNoDeity);
        return createGenericPicker({
            name: "Religion",
            characterData,
            pickerModel: religionModel,
            dataSelector: (data) => data.ReligionSelections,
            createPreview: (modal) => new PreviewModel("Religion", ko.observable(-1), new StringListPreviewModel(stringPreview), isConfigured, modal.Randomize.bind(modal), modal.EditItem.bind(modal)),
            onUpdate: () => { religionModel.Evaluate(); }
        });
    };
    ConfiguredModals.createNamePickerModel = (characterData) => {
        let tempPreview = Utility.BundleViewAndModel({});
        const namePickerModel = new NamePickerModel(characterData, TaggedCharacterNameData, TaggedCharacterBynameData, TaggedCharacterEpithetsData);
        const modal = Utility.BundleViewAndModel(new CreateObjectModel("Identity", namePickerModel, (data) => data.Name, tempPreview, () => { namePickerModel.Evaluate(); }, characterData));
        const NameObservable = ko.observable(NameUtility.determineIdentityPreview(characterData));
        characterData.Name.subscribe(() => NameObservable(NameUtility.determineIdentityPreview(characterData)));
        characterData.Gender.subscribe(() => NameObservable(NameUtility.determineIdentityPreview(characterData)));
        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        tempPreview.Model = new PreviewModel(modal.Model.FriendlyName, ko.observable(-1), new StringPreviewModel(NameObservable), isConfigured, modal.Model.Randomize.bind(modal.Model), modal.Model.EditItem.bind(modal.Model));
        tempPreview.ViewUrl = tempPreview.Model.ViewUrl;
        return Object.assign(modal, { hasContent: ko.computed(() => true) });
    };
    ConfiguredModals.createAbilityPickerModel = (name, choices, characterData) => Utility.BundleViewAndModel(new LockableObjectPickerModel(name, choices, characterData, 0, (value) => value.toString(), (value) => value.toString()));
})(ConfiguredModals || (ConfiguredModals = {}));
