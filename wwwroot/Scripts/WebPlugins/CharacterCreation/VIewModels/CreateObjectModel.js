import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";
import { ModalFrameModel } from "../../../WebCore/ViewModels/ModalFrameModel.js";
export class CreateObjectModel {
    FriendlyName;
    itemConstructionModel;
    dataSelector;
    previewViewModel;
    onUpdate;
    GlobalCharacterData;
    ViewUrl = "PartialViews/CharacterCreation/CreateObjectView.html";
    isLoading;
    modal;
    constructor(FriendlyName, itemConstructionModel, dataSelector, previewViewModel, onUpdate, GlobalCharacterData) {
        this.FriendlyName = FriendlyName;
        this.itemConstructionModel = itemConstructionModel;
        this.dataSelector = dataSelector;
        this.previewViewModel = previewViewModel;
        this.onUpdate = onUpdate;
        this.GlobalCharacterData = GlobalCharacterData;
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
            if (!this.modal.Model.wasCancelled)
                this.onUpdate(this.GlobalCharacterData);
        });
    }
    Evaluate() { }
    Randomize() {
        this.itemConstructionModel.Randomize();
        this.onUpdate(this.GlobalCharacterData);
    }
}
