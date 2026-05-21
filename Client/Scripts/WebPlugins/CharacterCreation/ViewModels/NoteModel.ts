import { Observable } from "../../../Framework/Knockout/knockout.js";
import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";

export class NoteModel implements IHTMLInjectable<void> {
    readonly ViewUrl = "PartialViews/CharacterCreation/NoteView.html"
    isLoading: Observable<boolean>

    constructor(public content: string) {
        this.isLoading = ko.observable(false)
    }

    Init() { return Promise.resolve() }

    static bundle(content: string): IPartialViewModel<NoteModel> {
        return Utility.BundleViewAndModel(new NoteModel(content))
    }
}
