import { ko } from "../../../Framework/Knockout/ko.js";
import { JobSubsetEnum } from "../Contracts/StringTypes.js";
import { MaxAbility } from "../Contracts/Abilities.js";
import { ConfiguredModals } from "./ModalConfigurationModels/ConfiguredModals.js";
import { Utility } from "../../../WebCore/Utility.js";
import { Personalities } from "../Configuration/MoodData.js";
import { flattenAndCombineSelectionPackage } from "../Utility/UpdateUtility.js";
import { CharacterGeneratorIntroduction } from "../Configuration/ConceptIntroductions.js";
import { createPdf } from "../Utility/CreatePDF.js";
export class CharacterSheetModel {
    GlobalCharacterData;
    FriendlyName = "Character Sheet";
    ViewUrl = "PartialViews/CharacterCreation/CharacterSheetView.html";
    CharacterGenIntro = CharacterGeneratorIntroduction;
    isLoading;
    jsonText;
    showOutput;
    modalPickers;
    sectionHasContent;
    sectionUnlocked;
    sectionVisible;
    sectionStepNumberReferences;
    constructor(GlobalCharacterData) {
        this.GlobalCharacterData = GlobalCharacterData;
        this.modalPickers = [
            ConfiguredModals.createAncestryPickerModel(GlobalCharacterData),
            ConfiguredModals.createBackgroundPickerModel(GlobalCharacterData),
            ConfiguredModals.createAbilityScoresPickerModel(GlobalCharacterData),
            ConfiguredModals.createEntanglementPickerModel(GlobalCharacterData),
            ConfiguredModals.createEquipmentPickerModel(GlobalCharacterData),
            ConfiguredModals.createTrinketPickerModel(GlobalCharacterData),
            ConfiguredModals.createEdgesPickerModel(GlobalCharacterData),
            ConfiguredModals.createSkillsPickerModel(GlobalCharacterData),
            ConfiguredModals.createSpellPickerModel(GlobalCharacterData),
            ConfiguredModals.createDrawbackPickerModel(GlobalCharacterData),
            ConfiguredModals.createCorruptionPickerModel(GlobalCharacterData),
            ConfiguredModals.createLanguagePickerModel(GlobalCharacterData),
            ConfiguredModals.createDeityPickerModel(GlobalCharacterData),
            ConfiguredModals.createNamePickerModel(GlobalCharacterData),
        ];
        this.sectionHasContent = this.modalPickers.map(picker => picker.hasContent);
        this.sectionUnlocked = [];
        this.modalPickers.forEach((_, index) => {
            if (index === 0) {
                this.sectionUnlocked.push(ko.computed(() => true));
                return;
            }
            const prev = this.modalPickers[index - 1];
            const sectionUnlockedCompute = ko.computed(() => this.sectionUnlocked[index - 1]() &&
                (!prev.hasContent() || prev.Model.previewViewModel.Model.IsConfigured()));
            this.sectionUnlocked.push(sectionUnlockedCompute);
        });
        this.sectionVisible = this.modalPickers.map((picker, index) => ko.computed(() => this.sectionUnlocked[index]() && picker.hasContent()));
        this.sectionStepNumberReferences = this.modalPickers.map(x => extractStepObservable(x));
        this.sectionStepNumberReferences.forEach((stepNumberObservable, currentSectionIndex) => {
            stepNumberObservable(currentSectionIndex + 1);
            this.sectionVisible[currentSectionIndex].subscribe((isVisible) => {
                if (isVisible) {
                    let count = 0;
                    for (let i = 0; i < currentSectionIndex; i++) {
                        if (this.sectionVisible[i]())
                            count++;
                    }
                    stepNumberObservable(count + 1);
                }
            });
        });
        this.isLoading = ko.observable(true);
        this.jsonText = ko.observable("");
        this.showOutput = ko.observable(false);
    }
    exportAsPDF() {
        createPdf();
        // print()
    }
    talkToCharacter() {
        const npcName = `${this.GlobalCharacterData.Name().Bynames} ${this.GlobalCharacterData.Name().Name} ${this.GlobalCharacterData.Name().Epithets}`;
        const definingAttribute = MaxAbility(this.GlobalCharacterData.Abilities()).name;
        const personality = `a ${Utility.RandomElement(Personalities)} ${this.GlobalCharacterData.Race()} ${this.GlobalCharacterData.Job()} ${(this.GlobalCharacterData.JobSubset() !== JobSubsetEnum.None) ? this.GlobalCharacterData.Job() : ""} with great ${definingAttribute}`;
        const instructions = `Act as a D&D npc named ${npcName}, ${personality}. Greet the user as if they just walked by.`;
        const finalUrl = `https://chatgpt.com/?q=${encodeURIComponent(instructions)}`;
        window.location.href = finalUrl;
    }
    createAnCharacterImage() {
        const items = flattenAndCombineSelectionPackage(this.GlobalCharacterData.ItemSelections(), this.GlobalCharacterData).map(x => x.Name).join(" ");
        const scars = flattenAndCombineSelectionPackage(this.GlobalCharacterData.CorruptionSelection(), this.GlobalCharacterData).map(x => x.affliction.Effect + " ").join(" ");
        const instructions = `Create an image of my D&D character, a ${this.GlobalCharacterData.Job} ${this.GlobalCharacterData.Race()}. If possible, try to incorporate the equipment: ${items}. ${(scars.length > 0) ? "The character has deformities: " + scars : ""}`;
        const finalUrl = `https://chatgpt.com/?q=${encodeURIComponent(instructions)}`;
        window.location.href = finalUrl;
    }
    exportAsDocx() {
    }
    Init(data) {
        return Promise.all(this.modalPickers.map(x => x.Model.Init())).then(() => Promise.resolve());
    }
    Evaluate() { return; }
    Randomize() { return; }
}
function extractStepObservable(model) {
    return model.Model.previewViewModel.Model.StepNumber;
}
