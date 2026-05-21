import { BasePreviewModel } from "./BasePreviewModel.js";
export class LanguagePreviewModel extends BasePreviewModel {
    previewList;
    constructor(friendlyName, previewList, isConfigured, randomize, edit) {
        super(friendlyName, isConfigured, randomize, edit);
        this.previewList = previewList;
    }
    contentViewUrl = "PartialViews/CharacterCreation/Preview/LanguageContentView.html";
}
