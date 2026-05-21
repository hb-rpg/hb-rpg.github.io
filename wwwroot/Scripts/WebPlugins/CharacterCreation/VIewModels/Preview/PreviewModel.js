import { ko } from "../../../../Framework/Knockout/ko.js";
export const PreviewContentViews = {
    Simple: "PartialViews/CharacterCreation/Preview/SimpleContentView.html",
    StringList: "PartialViews/CharacterCreation/Preview/StringListContentView.html",
    Language: "PartialViews/CharacterCreation/Preview/LanguageContentView.html",
    Ability: "PartialViews/CharacterCreation/Preview/AbilityContentView.html",
    Entanglement: "PartialViews/CharacterCreation/Preview/EntanglementPreviewView.html",
};
export class StringPreviewModel {
    data;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = PreviewContentViews.Simple;
    constructor(data) {
        this.data = data;
    }
}
export class StringListPreviewModel {
    data;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = PreviewContentViews.StringList;
    constructor(data) {
        this.data = data;
    }
}
export class LanguagePreviewModel {
    data;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = PreviewContentViews.Language;
    constructor(data) {
        this.data = data;
    }
}
export class AbilityPreviewModel {
    data;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = PreviewContentViews.Ability;
    constructor(data) {
        this.data = data;
    }
}
export class EntanglementPreviewContainerModel {
    data;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = PreviewContentViews.Entanglement;
    constructor(data) {
        this.data = data;
    }
}
export class PreviewModel {
    FriendlyName;
    StepNumber;
    data;
    IsConfigured;
    isLoading = ko.observable(false);
    Init = () => Promise.resolve();
    ViewUrl = "PartialViews/CharacterCreation/Preview/PreviewShellView.html";
    contentViewModel;
    Edit;
    Randomize;
    constructor(FriendlyName, StepNumber, data, IsConfigured, randomize, edit) {
        this.FriendlyName = FriendlyName;
        this.StepNumber = StepNumber;
        this.data = data;
        this.IsConfigured = IsConfigured;
        this.Randomize = () => { this.IsConfigured(true); randomize(); };
        this.Edit = () => { this.IsConfigured(true); edit(); };
        this.contentViewModel = { ViewUrl: data.ViewUrl, Model: data };
    }
}
