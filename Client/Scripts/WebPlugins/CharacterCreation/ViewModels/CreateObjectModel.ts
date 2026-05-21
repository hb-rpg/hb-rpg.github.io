import { Observable } from "../../../Framework/Knockout/knockout.js";
import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";
import { ModalFrameModel } from "../../../WebCore/ViewModels/ModalFrameModel.js";
import { ConfiguredCharacterData } from "../Configuration/CharacterWizardData.js";
import { ICharacterWizardViewModel } from "../Contracts/CharacterWizardViewModels.js";

export class CreateObjectModel<ItemToConfigureDataType, PreviewModelType> implements ICharacterWizardViewModel<void, void> {
    readonly ViewUrl = "PartialViews/CharacterCreation/CreateObjectView.html"
    isLoading: Observable<boolean>;
    modal : IPartialViewModel<ModalFrameModel<void, ItemToConfigureDataType, ItemToConfigureDataType, IWizardModel<void, ItemToConfigureDataType, ItemToConfigureDataType>>>

    constructor (
        public FriendlyName : string,
        public itemConstructionModel : IWizardModel<void, ItemToConfigureDataType, ItemToConfigureDataType> & {Randomize : Function} & Partial<IValidatable>,
        public dataSelector : (characterData : ConfiguredCharacterData) => Observable<ItemToConfigureDataType>,
        public previewViewModel : IPartialViewModel<PreviewModelType>,
        public onUpdate : (characterData : ConfiguredCharacterData) => void,
        public GlobalCharacterData : ConfiguredCharacterData,
    ) {
        const a = Utility.BundleViewAndModel(itemConstructionModel)
        const b = new ModalFrameModel<void, ItemToConfigureDataType, ItemToConfigureDataType, IWizardModel<void, ItemToConfigureDataType, ItemToConfigureDataType>>(FriendlyName, a, () => {
            const configured = itemConstructionModel.isConfigured?.() ?? true
            if (!configured) itemConstructionModel.onValidationFailed?.()
            else itemConstructionModel.errorMessage?.("")
            return configured
        })
        this.modal = Utility.BundleViewAndModel<void, ModalFrameModel<void, ItemToConfigureDataType, ItemToConfigureDataType, IWizardModel<void, ItemToConfigureDataType, ItemToConfigureDataType>>, ItemToConfigureDataType>(b)

        this.isLoading = ko.observable(true)
    }

    Init() {
        return Promise.resolve()
    }

    EditItem() {
        this.modal.Model.Init(this.dataSelector(this.GlobalCharacterData)()).then(() => this.modal.Model.Open())

        const subscription = this.modal.Model.isVisible.subscribe((isVisible : boolean) => {
            if (isVisible) return
            subscription.dispose()
            if (!this.modal.Model.wasCancelled)
                this.onUpdate(this.GlobalCharacterData)
        })
    }

    Evaluate () {}
    Randomize () {
        this.itemConstructionModel.Randomize()
        this.onUpdate(this.GlobalCharacterData)
    }
}