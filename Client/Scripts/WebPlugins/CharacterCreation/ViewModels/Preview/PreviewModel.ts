import { Observable, ObservableArray } from "../../../../Framework/Knockout/knockout.js";
import { ko } from "../../../../Framework/Knockout/ko.js";
import { IConfigurableViewModel } from "../../Contracts/CharacterWizardViewModels.js";
import { Abilities } from "../../Contracts/Abilities.js";
import { LearnedLanguage } from "../../Contracts/Language.js";
import { EntanglementPreview } from "../../Contracts/EntanglementPreviewModel.js";

export const PreviewContentViews = {
    Simple:       "PartialViews/CharacterCreation/Preview/SimpleContentView.html",
    StringList:   "PartialViews/CharacterCreation/Preview/StringListContentView.html",
    Language:     "PartialViews/CharacterCreation/Preview/LanguageContentView.html",
    Ability:      "PartialViews/CharacterCreation/Preview/AbilityContentView.html",
    Entanglement: "PartialViews/CharacterCreation/Preview/EntanglementPreviewView.html",
} as const;

export class StringPreviewModel implements IHTMLInjectable<void, void> {
    isLoading: Observable<boolean> = ko.observable(false);
    Init = () => Promise.resolve();
    readonly ViewUrl = PreviewContentViews.Simple;

    constructor(public data: Observable<string>) {}
}

export class StringListPreviewModel implements IHTMLInjectable<void, void> {
    isLoading: Observable<boolean> = ko.observable(false);
    Init = () => Promise.resolve();
    readonly ViewUrl = PreviewContentViews.StringList;

    constructor(public data: ObservableArray<string>) {}
}

export class LanguagePreviewModel implements IHTMLInjectable<void, void> {
    isLoading: Observable<boolean> = ko.observable(false);
    Init = () => Promise.resolve();
    readonly ViewUrl = PreviewContentViews.Language;

    constructor(public data: ObservableArray<LearnedLanguage>) {}
}

export class AbilityPreviewModel implements IHTMLInjectable<void, void> {
    isLoading: Observable<boolean> = ko.observable(false);
    Init = () => Promise.resolve();
    readonly ViewUrl = PreviewContentViews.Ability;

    constructor(public data: Observable<Abilities>) {}
}

export class EntanglementPreviewContainerModel implements IHTMLInjectable<void, void> {
    isLoading: Observable<boolean> = ko.observable(false);
    Init = () => Promise.resolve();
    readonly ViewUrl = PreviewContentViews.Entanglement;

    constructor(public data: ObservableArray<EntanglementPreview>) {}
}

export class PreviewModel<T extends IHTMLInjectable<void, void>> implements IConfigurableViewModel {
    isLoading: Observable<boolean> = ko.observable(false);
    Init = () => Promise.resolve();
    readonly ViewUrl = "PartialViews/CharacterCreation/Preview/PreviewShellView.html";
    readonly contentViewModel: IPartialViewModel<T>;
    Edit: Function;
    Randomize: Function;

    constructor(
        public FriendlyName: string,
        public StepNumber : Observable<number>,
        public data: T,
        public IsConfigured: Observable<boolean>,
        randomize: Function,
        edit: Function
    ) {
        this.Randomize = () => { this.IsConfigured(true); randomize(); };
        this.Edit = () => { this.IsConfigured(true); edit(); };
        this.contentViewModel = { ViewUrl: data.ViewUrl, Model: data };
    }
}
