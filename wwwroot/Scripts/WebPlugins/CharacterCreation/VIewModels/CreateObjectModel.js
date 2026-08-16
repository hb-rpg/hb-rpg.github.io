import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";
import { ModalFrameModel } from "../../../WebCore/ViewModels/ModalFrameModel.js";
import { logAllSelectionOptions, snapshotSelectionOptions } from "../Utility/DebugSelectionOptions.js";
export class CreateObjectModel {
    FriendlyName;
    itemConstructionModel;
    dataSelector;
    previewViewModel;
    onUpdate;
    GlobalCharacterData;
    isConfigured;
    ViewUrl = "PartialViews/CharacterCreation/CreateObjectView.html";
    isLoading;
    modal;
    constructor(FriendlyName, itemConstructionModel, dataSelector, previewViewModel, onUpdate, GlobalCharacterData, isConfigured) {
        this.FriendlyName = FriendlyName;
        this.itemConstructionModel = itemConstructionModel;
        this.dataSelector = dataSelector;
        this.previewViewModel = previewViewModel;
        this.onUpdate = onUpdate;
        this.GlobalCharacterData = GlobalCharacterData;
        this.isConfigured = isConfigured;
        const a = Utility.BundleViewAndModel(itemConstructionModel);
        const b = new ModalFrameModel(FriendlyName, a, () => {
            const configured = itemConstructionModel.isConfigured?.() ?? true;
            if (!configured)
                itemConstructionModel.onValidationFailed?.();
            else
                itemConstructionModel.errorMessage?.("");
            return configured;
        });
        this.modal = Utility.BundleViewAndModel(b);
        this.isLoading = ko.observable(true);
    }
    Init() {
        return Promise.resolve();
    }
    EditItem() {
        this.modal.Model.Init(this.dataSelector(this.GlobalCharacterData)()).then(() => this.modal.Model.Open());
        const subscription = this.modal.Model.isVisible.subscribe((isVisible) => {
            if (isVisible)
                return;
            subscription.dispose();
            if (!this.modal.Model.wasCancelled) {
                // Snapshot first, log after, so the debug tree can expand exactly the packages this
                // save's update* cascade moved and leave the rest collapsed.
                const before = snapshotSelectionOptions(this.GlobalCharacterData);
                this.onUpdate(this.GlobalCharacterData);
                logAllSelectionOptions(this.GlobalCharacterData, this.FriendlyName, before);
                // After onUpdate: the Ancestry/Background updates write Race/JobBackground, whose
                // subscriptions reset the *downstream* steps' flags. Ours is set once that settles.
                this.isConfigured(true);
            }
        });
    }
    Evaluate() { }
    Randomize() {
        this.itemConstructionModel.Randomize();
        this.onUpdate(this.GlobalCharacterData);
        this.isConfigured(true);
    }
}
