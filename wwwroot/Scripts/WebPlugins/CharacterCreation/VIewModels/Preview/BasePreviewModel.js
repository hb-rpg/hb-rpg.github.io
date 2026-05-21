import { ko } from "../../../../Framework/Knockout/ko.js";
export class BasePreviewModel {
    FriendlyName;
    IsConfigured;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = "PartialViews/CharacterCreation/Preview/PreviewShellView.html";
    Edit;
    Randomize;
    constructor(FriendlyName, IsConfigured, randomize, edit) {
        this.FriendlyName = FriendlyName;
        this.IsConfigured = IsConfigured;
        this.Randomize = () => { this.IsConfigured(true); randomize(); };
        this.Edit = () => { this.IsConfigured(true); edit(); };
    }
}
