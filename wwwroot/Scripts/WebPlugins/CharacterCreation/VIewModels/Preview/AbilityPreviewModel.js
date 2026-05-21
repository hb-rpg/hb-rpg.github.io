import { BasePreviewModel } from "./BasePreviewModel.js";
export class AbilityPreviewModel extends BasePreviewModel {
    Ability;
    constructor(friendlyName, Ability, isConfigured, randomize, edit) {
        super(friendlyName, isConfigured, randomize, edit);
        this.Ability = Ability;
    }
    contentViewUrl = "PartialViews/CharacterCreation/Preview/AbilityContentView.html";
}
