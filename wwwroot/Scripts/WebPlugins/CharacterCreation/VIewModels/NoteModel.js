import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";
export class NoteModel {
    content;
    ViewUrl = "PartialViews/CharacterCreation/NoteView.html";
    isLoading;
    constructor(content) {
        this.content = content;
        this.isLoading = ko.observable(false);
    }
    Init() { return Promise.resolve(); }
    static bundle(content) {
        return Utility.BundleViewAndModel(new NoteModel(content));
    }
}
