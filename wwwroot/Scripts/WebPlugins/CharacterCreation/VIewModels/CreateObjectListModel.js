import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";
import { ModalFrameModel } from "../../../WebCore/ViewModels/ModalFrameModel.js";
export class CreateObjectListModel {
    FriendlyName;
    itemConstructionModel;
    dataSelector;
    determineName;
    initializationCallback;
    GlobalCharacterData;
    subheading;
    ViewUrl = "PartialViews/CharacterCreation/CreateObjectListView.html";
    isLoading;
    itemList;
    modal;
    constructor(FriendlyName, itemConstructionModel, dataSelector, determineName, initializationCallback, GlobalCharacterData, subheading = false) {
        this.FriendlyName = FriendlyName;
        this.itemConstructionModel = itemConstructionModel;
        this.dataSelector = dataSelector;
        this.determineName = determineName;
        this.initializationCallback = initializationCallback;
        this.GlobalCharacterData = GlobalCharacterData;
        this.subheading = subheading;
        this.itemList = ko.observableArray([]);
        const a = Utility.BundleViewAndModel(itemConstructionModel);
        const b = new ModalFrameModel(FriendlyName, a, () => true);
        this.modal = Utility.BundleViewAndModel(b);
        this.isLoading = ko.observable(true);
    }
    Init() {
        this.itemList(this.dataSelector(this.GlobalCharacterData)().map(x => ko.observable(x)));
        this.initializationCallback(this.GlobalCharacterData);
        return Promise.resolve();
    }
    EditItem(index) {
        this.modal.Model.Init(this.itemList()[index()]()).then(() => this.modal.Model.Open());
        const subscription = this.modal.Model.isVisible.subscribe((isVisible) => {
            if (isVisible)
                return;
            subscription.dispose();
            this.itemList()[index()](this.modal.Model.Evaluate());
        });
    }
    CreateItem() {
        this.modal.Model.Open();
        const subscription = this.modal.Model.isVisible.subscribe((isVisible) => {
            if (isVisible)
                return;
            subscription.dispose();
            this.itemList.push(ko.observable(this.modal.Model.Evaluate()));
        });
    }
    Evaluate() {
        this.dataSelector(this.GlobalCharacterData)(this.itemList().map(x => x()));
    }
    Randomize() { }
}
