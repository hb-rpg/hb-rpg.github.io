import { BasePreviewModel } from "./BasePreviewModel.js";
export class SimplePreviewModel extends BasePreviewModel {
    ConfigurationPreview;
    constructor(friendlyName, ConfigurationPreview, isConfigured, randomize, edit) {
        super(friendlyName, isConfigured, randomize, edit);
        this.ConfigurationPreview = ConfigurationPreview;
    }
    contentViewUrl = "PartialViews/CharacterCreation/Preview/SimpleContentView.html";
}
