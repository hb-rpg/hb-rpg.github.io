import { Observable, ObservableArray } from "../../../../Framework/Knockout/knockout.js";
import { ko } from "../../../../Framework/Knockout/ko.js";
import { CareerData } from "../../Configuration/CareerData.js";
import { ConfiguredCharacterData } from "../../Configuration/CharacterWizardData.js";
import { Races } from "../../Configuration/DispositionData.js";
import { ReligionData } from "../../Configuration/DietiesData.js";
import { Abilities } from "../../Contracts/Abilities.js";
import { Edges } from "../../Contracts/Edges.js";
import { Skill } from "../../Contracts/Skill.js";
import { EntanglementOrganizationTypesEnum, JobType, RaceType } from "../../Contracts/StringTypes.js";
import { TaggedObservableSelectionPackage, StoryModel, GameItem, TaggedCharacterData } from "../../Contracts/TaggedData.js";
import { createGenericPicker, updateRaceItemsData, updateRaceEdgesData, flattenAndCombineSelectionPackage, updateNameData, updateRaceSkillsData, updateRaceLanguageData, updateBackgroundItems, updateBackgroundEdges, updateBackgroundLanguages, updateBackgroundSkills, updateEntanglementBackgroundAffects, updateBackgroundSpells, updateEdgesSpells, updateBackgroundCorruption, updateBackgroundDrawbacks, updateRaceDrawbackData } from "../../Utility/UpdateUtility.js";
import { PreviewModel, StringPreviewModel, StringListPreviewModel, LanguagePreviewModel, AbilityPreviewModel, EntanglementPreviewContainerModel } from "../Preview/PreviewModel.js";
import { AbilityScoresModel } from "../AbilityScoresModel.js";
import { AncestryViewModel } from "./AncestryViewModel.js";
import { SelectionPackageConfigurationModel } from "./SelectionPackageConfigurationModel.js";
import { LearnedLanguage } from "../../Contracts/Language.js";
import { Deity } from "../../Contracts/Diety.js";
import { Spell } from "../../Contracts/Spell.js";
import { Drawbacks } from "../../Contracts/Drawbacks.js";
import { Corruption } from "../../Contracts/Corruption.js";
import { JobBackgroundPickerModel } from "./JobBackgroundPickerModel.js";
import { createEntanglementPreview, OrganizationEntanglementsGroup } from "../../Contracts/Entanglements.js";
import { EntanglementCreationModel } from "./EntanglementCreationModel.js";
import { CharacterPickerModal } from "../../Contracts/CharacterWizardViewModels.js";
import { CharacterName } from "../../Contracts/CharacterName.js";
import { Utility } from "../../../../WebCore/Utility.js";
import { TaggedCharacterNameData, TaggedCharacterBynameData, TaggedCharacterEpithetsData } from "../../Configuration/TaggedNameData.js";
import { NameUtility } from "../../Utility/NameUtility.js";
import { CreateObjectModel } from "../CreateObjectModel.js";
import { LockableObjectPickerModel } from "../LockableObjectPickerModel.js";
import { NamePickerModel } from "./NamePickerModel.js";
import { NoteModel } from "../NoteModel.js";
import { EdgesExplanation, SkillsExplanation, SpellsExplanation, TrinketQualifier, TrinketExplanation, LanguageExplanation, DrawbacksExplanation, CorruptionExplanation, ReligionExplanation } from "../../Configuration/ConceptIntroductions.js";
import { EntanglementPreview } from "../../Contracts/EntanglementPreviewModel.js";

const truncate = (text: string, max = 80): string =>
    text.length > max ? text.slice(0, max) + "…" : text

// "Mending (Level 0, Ritual) - You are able to fix…". The qualifiers sit right after the name so
// they survive truncation in the dropdown. Spells with no assigned level omit that part.
const describeSpell = (spell: Spell): string => {
    const qualifiers: string[] = []
    if (spell.Level !== undefined) qualifiers.push(`Level ${spell.Level}`)
    if (spell.IsRitual) qualifiers.push("Ritual")

    const suffix = qualifiers.length > 0 ? ` (${qualifiers.join(", ")})` : ""
    return `${spell.Name}${suffix}${spell.Description ? " - " + spell.Description : ""}`
}

export namespace ConfiguredModals {
    export const createAncestryPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<RaceType, PreviewModel<StringPreviewModel>> => {
        const ancestryModel = new AncestryViewModel(characterData, Races);

        const isConfigured = ko.observable(false);

        return createGenericPicker<AncestryViewModel, PreviewModel<StringPreviewModel>, RaceType>({
            name: "Ancestry",
            characterData,
            pickerModel: ancestryModel,
            dataSelector: (data) => data.Race,
            isConfigured,
            onUpdate: (data) => {
                ancestryModel.Evaluate();
                updateRaceItemsData(data, "Ancestry");
                updateRaceLanguageData(data);
                updateRaceEdgesData(data, "Ancestry");
                updateRaceSkillsData(data, "Ancestry");
                updateRaceDrawbackData(data, "Ancestry");
                updateNameData(data);
            },
            createPreview: (modal) => new PreviewModel(
                modal.FriendlyName,
                ko.observable(-1),
                new StringPreviewModel(characterData.Race as Observable<string>),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            )
        });
    };

    export const createEdgesPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Edges>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.EdgeSelections.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const edgesModel = new SelectionPackageConfigurationModel(
            "Edges",
            characterData,
            (data) => data.EdgeSelections,
            (item: Edges) => truncate(item.Name + " - " + item.Description),
            (item: Edges) => item.Name + " - " + item.Description,
            isConfigured,
            undefined,
            NoteModel.bundle(EdgesExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Edges>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Edges>>({
            name: "Edges",
            characterData,
            pickerModel: edgesModel,
            dataSelector: (data) => data.EdgeSelections,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Edges",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => {
                edgesModel.Evaluate();
                updateEdgesSpells(characterData);
            }
        });
    };

    export const createSkillsPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Skill>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.SkillsSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const skillsModel = new SelectionPackageConfigurationModel(
            "Skills",
            characterData,
            (data) => data.SkillsSelection,
            (item: Skill) => truncate(item.Name + " - " + item.Description),
            (item: Skill) => item.Name + " - " + item.Description,
            isConfigured,
            undefined,
            NoteModel.bundle(SkillsExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Skill>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Skill>>({
            name: "Skills",
            characterData,
            pickerModel: skillsModel,
            dataSelector: (data) => data.SkillsSelection,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Skills",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { skillsModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.SkillsSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };

    export const createBackgroundPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<StoryModel<JobType>, PreviewModel<StringPreviewModel>> => {
        const displayLabel = ko.observable("");
        characterData.JobBackground.subscribe((background) => {
            displayLabel(background ? background.Name : "Unknown");
        });

        const backgroundModel = new JobBackgroundPickerModel(
            characterData,
            CareerData.possibleProfessions,
            CareerData.ProfessionToJobData,
            CareerData.JobToStoryData,
            CareerData.JobSubsetData
        );

        const isConfigured = ko.observable(false);

        return createGenericPicker<JobBackgroundPickerModel, PreviewModel<StringPreviewModel>, StoryModel<JobType>>({
            name: "Background",
            characterData,
            pickerModel: backgroundModel,
            dataSelector: (data) => data.JobBackground,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                modal.FriendlyName,
                ko.observable(-1),
                new StringPreviewModel(displayLabel),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
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

    export const createAbilityScoresPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<Abilities, PreviewModel<AbilityPreviewModel>> => {
        const abilitiesModel = new AbilityScoresModel(characterData);

        const isConfigured = ko.observable(false);

        return createGenericPicker<AbilityScoresModel, PreviewModel<AbilityPreviewModel>, Abilities>({
            name: "Ability Scores",
            characterData,
            pickerModel: abilitiesModel,
            dataSelector: (data) => data.Abilities,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                modal.FriendlyName,
                ko.observable(-1),
                new AbilityPreviewModel(characterData.Abilities),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { abilitiesModel.Evaluate(); }
        });
    };

    export const createEquipmentPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<GameItem>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.ItemSelections.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const equipmentModel = new SelectionPackageConfigurationModel(
            "Equipment",
            characterData,
            (data) => data.ItemSelections,
            (item: GameItem) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`),
            (item: GameItem) => `${item.Name}${item.Description ? " - " + item.Description : ""}${item.Amount ? " x" + item.Amount : ""}`,
            isConfigured
        );
        return createGenericPicker<SelectionPackageConfigurationModel<GameItem>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<GameItem>>({
            name: "Equipment",
            characterData,
            pickerModel: equipmentModel,
            dataSelector: (data) => data.ItemSelections,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Equipment",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { equipmentModel.Evaluate(); }
        });
    };

    export const createEntanglementPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<OrganizationEntanglementsGroup, PreviewModel<EntanglementPreviewContainerModel>> => {
        const entanglementPreview = ko.observableArray<EntanglementPreview>([]);
        characterData.OrganizationEntanglements.subscribe((newValue) => {
            const finalPreview : EntanglementPreview[] = [
                createEntanglementPreview(EntanglementOrganizationTypesEnum.CivicAuthorities, newValue.CivicAuthorities),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Colleagues, newValue.Colleagues),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Family, newValue.Family),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Master, newValue.Master),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.Neighbors, newValue.Neighbors),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.ReligiousAuthorities, newValue.ReligiousAuthorities),
                createEntanglementPreview(EntanglementOrganizationTypesEnum.ShadowGroups, newValue.ShadowGroups)
            ]
            entanglementPreview(finalPreview);
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));

        const entanglementModel = new EntanglementCreationModel(characterData);
        return createGenericPicker<EntanglementCreationModel, PreviewModel<EntanglementPreviewContainerModel>, OrganizationEntanglementsGroup>({
            name: "Entanglement",
            characterData,
            pickerModel: entanglementModel,
            dataSelector: (data) => data.OrganizationEntanglements,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Entanglement",
                ko.observable(-1),
                new EntanglementPreviewContainerModel(entanglementPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { entanglementModel.Evaluate(); }
        });
    };

    export const createTrinketPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<GameItem>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.TrinketSelections.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const trinketModel = new SelectionPackageConfigurationModel(
            "Trinket",
            characterData,
            (data) => data.TrinketSelections,
            (item: GameItem) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`),
            (item: GameItem) => `${item.Name}${item.Description ? " - " + item.Description : ""}${item.Amount ? " x" + item.Amount : ""}`,
            isConfigured,
            NoteModel.bundle(TrinketQualifier),
            NoteModel.bundle(TrinketExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<GameItem>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<GameItem>>({
            name: "Trinket",
            characterData,
            pickerModel: trinketModel,
            dataSelector: (data) => data.TrinketSelections,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Trinket",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { trinketModel.Evaluate(); }
        });
    };

    export const createLanguagePickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<LearnedLanguage>, PreviewModel<LanguagePreviewModel>> => {
        const languagePreview = ko.observableArray<LearnedLanguage>([]);
        characterData.LanguageSelections.subscribe((newValue) => {
            languagePreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x));
        });

        const determineName = (language: LearnedLanguage) => {
            return `${language.Language.Name} (${(language.canSpeak)? " Speak " : ""} ${(language.canRead)? " Read " : ""} ${(language.canWrite)? " Write " : ""})`
        }

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const languageModel = new SelectionPackageConfigurationModel(
            "Language",
            characterData,
            (data) => data.LanguageSelections,
            (item: LearnedLanguage) => truncate(item.Language.Name),
            (item: LearnedLanguage) => determineName(item) + ": " + item.Language.Description,
            isConfigured,
            undefined,
            NoteModel.bundle(LanguageExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<LearnedLanguage>, PreviewModel<LanguagePreviewModel>, TaggedObservableSelectionPackage<LearnedLanguage>>({
            name: "Language",
            characterData,
            pickerModel: languageModel,
            dataSelector: (data) => data.LanguageSelections,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Language",
                ko.observable(-1),
                new LanguagePreviewModel(languagePreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { languageModel.Evaluate(); }
        });
    };

    export const createSpellPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Spell>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.SpellSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const spellsModel = new SelectionPackageConfigurationModel(
            "Spells",
            characterData,
            (data) => data.SpellSelection,
            (item: Spell) => truncate(describeSpell(item)),
            (item: Spell) => describeSpell(item),
            isConfigured,
            undefined,
            NoteModel.bundle(SpellsExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Spell>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Spell>>({
            name: "Spells",
            characterData,
            pickerModel: spellsModel,
            dataSelector: (data) => data.SpellSelection,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Spells",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { spellsModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.SpellSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };

    export const createDrawbackPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Drawbacks>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.DrawbacksSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.Name).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const drawbacksModel = new SelectionPackageConfigurationModel(
            "Drawbacks",
            characterData,
            (data) => data.DrawbacksSelection,
            (item: Drawbacks) => truncate(item.Name),
            (item: Drawbacks) => `${item.Name}${item.Description ? " - " + item.Description : ""}`,
            isConfigured,
            undefined,
            NoteModel.bundle(DrawbacksExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Drawbacks>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Drawbacks>>({
            name: "Drawbacks",
            characterData,
            pickerModel: drawbacksModel,
            dataSelector: (data) => data.DrawbacksSelection,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Drawbacks",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { drawbacksModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.DrawbacksSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };

    export const createCorruptionPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Corruption>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.CorruptionSelection.subscribe((newValue) => {
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => x.affliction.Effect).sort());
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const corruptionModel = new SelectionPackageConfigurationModel(
            "Corruption",
            characterData,
            (data) => data.CorruptionSelection,
            (item: Corruption) => truncate(`${item.affliction.Effect}${item.affliction.Description ? " - " + item.affliction.Description : ""}`),
            (item: Corruption) => `${item.affliction.Effect}${item.affliction.Description ? " - " + item.affliction.Description : ""}`,
            isConfigured,
            undefined,
            NoteModel.bundle(CorruptionExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Corruption>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Corruption>>({
            name: "Corruption",
            characterData,
            pickerModel: corruptionModel,
            dataSelector: (data) => data.CorruptionSelection,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Corruption",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { corruptionModel.Evaluate(); },
            hasContent: ko.computed(() => {
                const pkg = characterData.CorruptionSelection();
                return pkg.ChoiceSelection().length > 0 || pkg.FixedSelection().length > 0;
            })
        });
    };

    export const createDeityPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Deity>, PreviewModel<StringListPreviewModel>> => {
        const stringPreview = ko.observableArray<string>([]);
        characterData.ReligionSelections.subscribe((newValue) => {
            const worshipped = ReligionData.realDeities(flattenAndCombineSelectionPackage(newValue, characterData));
            stringPreview(worshipped.length > 0
                ? worshipped.map(x => (x.Pronoun.name)? x.Pronoun.name : "An unknown god")
                : ["None"]);
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));
        // Moving into or out of the Religious profession changes whether "None" is on offer
        characterData.Profession.subscribe(() => isConfigured(false));

        const religionModel = new SelectionPackageConfigurationModel(
            "Religion",
            characterData,
            (data) => data.ReligionSelections,
            (item: Deity) => truncate(item.Pronoun.name ? item.Description : "An unknown god"),
            (item: Deity) => `${item.Pronoun.name}: ${item.Description}`,
            isConfigured,
            undefined,
            NoteModel.bundle(ReligionExplanation),
            ReligionData.isNoDeity
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Deity>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Deity>>({
            name: "Religion",
            characterData,
            pickerModel: religionModel,
            dataSelector: (data) => data.ReligionSelections,
            isConfigured,
            createPreview: (modal) => new PreviewModel(
                "Religion",
                ko.observable(-1),
                new StringListPreviewModel(stringPreview),
                isConfigured,
                modal.Randomize.bind(modal),
                modal.EditItem.bind(modal)
            ),
            onUpdate: () => { religionModel.Evaluate(); }
        });
    };

    export const createNamePickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<CharacterName, PreviewModel<StringPreviewModel>> => {
        let tempPreview = Utility.BundleViewAndModel({} as PreviewModel<StringPreviewModel>)

        const isConfigured = ko.observable(false)
        characterData.JobBackground.subscribe(() => isConfigured(false))
        characterData.Race.subscribe(() => isConfigured(false))

        const namePickerModel = new NamePickerModel(characterData, TaggedCharacterNameData, TaggedCharacterBynameData, TaggedCharacterEpithetsData);
        const modal = Utility.BundleViewAndModel(
            new CreateObjectModel(
                "Identity",
                namePickerModel,
                (data) => data.Name,
                tempPreview,
                () => { namePickerModel.Evaluate(); },
                characterData,
                isConfigured
            )
        )

        const NameObservable = ko.observable(NameUtility.determineIdentityPreview(characterData))
        characterData.Name.subscribe(() => NameObservable(NameUtility.determineIdentityPreview(characterData)))
        characterData.Gender.subscribe(() => NameObservable(NameUtility.determineIdentityPreview(characterData)))

        tempPreview.Model = new PreviewModel(
            modal.Model.FriendlyName,
            ko.observable(-1),
            new StringPreviewModel(NameObservable),
            isConfigured,
            modal.Model.Randomize.bind(modal.Model),
            modal.Model.EditItem.bind(modal.Model)
        )
        tempPreview.ViewUrl = tempPreview.Model.ViewUrl

        return Object.assign(modal, { hasContent: ko.computed(() => true) })
    }

    export const createAbilityPickerModel = (
        name: string,
        choices: ObservableArray<number>,
        characterData: ConfiguredCharacterData
    ) => Utility.BundleViewAndModel(new LockableObjectPickerModel(name, choices, characterData, 0, (value) => value.toString(), (value) => value.toString()))
}
