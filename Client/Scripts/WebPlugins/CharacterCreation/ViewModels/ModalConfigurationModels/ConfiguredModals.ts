import { Observable, ObservableArray } from "../../../../Framework/Knockout/knockout.js";
import { ko } from "../../../../Framework/Knockout/ko.js";
import { CareerData } from "../../Configuration/CareerData.js";
import { ConfiguredCharacterData } from "../../Configuration/CharacterWizardData.js";
import { Races } from "../../Configuration/DispositionData.js";
import { Abilities, AbilitiesToArray } from "../../Contracts/Abilities.js";
import { DiceRoll } from "../../Utility/DiceRoll.js";
import { Edges } from "../../Contracts/Edges.js";
import { Skill } from "../../Contracts/Skill.js";
import { EntanglementOrganizationTypesEnum, JobType, RaceType } from "../../Contracts/StringTypes.js";
import { TaggedObservableSelectionPackage, StoryModel, Item, TaggedCharacterData } from "../../Contracts/TaggedData.js";
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
import { EdgesExplanation, SkillsExplanation, TrinketQualifier, TrinketExplanation, LanguageExplanation, DrawbacksExplanation, CorruptionExplanation, ReligionExplanation } from "../../Configuration/ConceptIntroductions.js";
import { EntanglementPreview } from "../../Contracts/EntanglementPreviewModel.js";

const truncate = (text: string, max = 80): string =>
    text.length > max ? text.slice(0, max) + "…" : text

export namespace ConfiguredModals {
    export const createAncestryPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<RaceType, PreviewModel<StringPreviewModel>> => {
        const ancestryModel = new AncestryViewModel(characterData, Races);
        return createGenericPicker<AncestryViewModel, PreviewModel<StringPreviewModel>, RaceType>({
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
            createPreview: (modal) => new PreviewModel(
                modal.FriendlyName,
                ko.observable(-1),
                new StringPreviewModel(characterData.Race as Observable<string>),
                ko.observable(false),
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
        return createGenericPicker<JobBackgroundPickerModel, PreviewModel<StringPreviewModel>, StoryModel<JobType>>({
            name: "Background",
            characterData,
            pickerModel: backgroundModel,
            dataSelector: (data) => data.JobBackground,
            createPreview: (modal) => new PreviewModel(
                modal.FriendlyName,
                ko.observable(-1),
                new StringPreviewModel(displayLabel),
                ko.observable(false),
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

        // Derives configured state from actual data so that cancelling the modal (which
        // doesn't write to characterData.Abilities) correctly reverts the preview to
        // "not configured". Uses a writable computed so that the eager IsConfigured(true)
        // call in PreviewModel.Edit() is silently ignored.
        const isConfigured = ko.computed({
            read: () => {
                const arr = AbilitiesToArray(characterData.Abilities());
                return arr.length === DiceRoll.ABILITY_SCORE_AMOUNT && arr.every(v => v > 0);
            },
            write: (_value: boolean) => {}
        }) as unknown as Observable<boolean>;

        return createGenericPicker<AbilityScoresModel, PreviewModel<AbilityPreviewModel>, Abilities>({
            name: "Ability Scores",
            characterData,
            pickerModel: abilitiesModel,
            dataSelector: (data) => data.Abilities,
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

    export const createEquipmentPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Item>, PreviewModel<StringListPreviewModel>> => {
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
            (item: Item) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`),
            (item: Item) => `${item.Name}${item.Description ? " - " + item.Description : ""}${item.Amount ? " x" + item.Amount : ""}`,
            isConfigured
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Item>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Item>>({
            name: "Equipment",
            characterData,
            pickerModel: equipmentModel,
            dataSelector: (data) => data.ItemSelections,
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

    export const createTrinketPickerModel = (characterData: ConfiguredCharacterData): CharacterPickerModal<TaggedObservableSelectionPackage<Item>, PreviewModel<StringListPreviewModel>> => {
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
            (item: Item) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`),
            (item: Item) => `${item.Name}${item.Description ? " - " + item.Description : ""}${item.Amount ? " x" + item.Amount : ""}`,
            isConfigured,
            NoteModel.bundle(TrinketQualifier),
            NoteModel.bundle(TrinketExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Item>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Item>>({
            name: "Trinket",
            characterData,
            pickerModel: trinketModel,
            dataSelector: (data) => data.TrinketSelections,
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
            (item: Spell) => truncate(`${item.Name}${item.Description ? " - " + item.Description : ""}`),
            (item: Spell) => `${item.Name}${item.Description ? " - " + item.Description : ""}`,
            isConfigured
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Spell>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Spell>>({
            name: "Spells",
            characterData,
            pickerModel: spellsModel,
            dataSelector: (data) => data.SpellSelection,
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
            stringPreview(flattenAndCombineSelectionPackage(newValue, characterData).map(x => (x.Pronoun.name)? x.Pronoun.name : "An unknown god"));
        });

        const isConfigured = ko.observable(false);
        characterData.JobBackground.subscribe(() => isConfigured(false));
        characterData.Race.subscribe(() => isConfigured(false));

        const religionModel = new SelectionPackageConfigurationModel(
            "Religion",
            characterData,
            (data) => data.ReligionSelections,
            (item: Deity) => truncate(item.Pronoun.name ? `${item.Pronoun.name}: ${item.Description}` : "An unknown god"),
            (item: Deity) => `${item.Pronoun.name}: ${item.Description}`,
            isConfigured,
            undefined,
            NoteModel.bundle(ReligionExplanation)
        );
        return createGenericPicker<SelectionPackageConfigurationModel<Deity>, PreviewModel<StringListPreviewModel>, TaggedObservableSelectionPackage<Deity>>({
            name: "Religion",
            characterData,
            pickerModel: religionModel,
            dataSelector: (data) => data.ReligionSelections,
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

        const namePickerModel = new NamePickerModel(characterData, TaggedCharacterNameData, TaggedCharacterBynameData, TaggedCharacterEpithetsData);
        const modal = Utility.BundleViewAndModel(
            new CreateObjectModel(
                "Identity",
                namePickerModel,
                (data) => data.Name,
                tempPreview,
                () => { namePickerModel.Evaluate(); },
                characterData
            )
        )

        const NameObservable = ko.observable(NameUtility.determineIdentityPreview(characterData))
        characterData.Name.subscribe(() => NameObservable(NameUtility.determineIdentityPreview(characterData)))
        characterData.Gender.subscribe(() => NameObservable(NameUtility.determineIdentityPreview(characterData)))

        const isConfigured = ko.observable(false)
        characterData.JobBackground.subscribe(() => isConfigured(false))
        characterData.Race.subscribe(() => isConfigured(false))

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
