import { ko } from "../../../Framework/Knockout/ko.js";
import { createBaseItem } from "../Utility/BuildItems.js";
export class ItemCreationModel {
    possibleItems;
    FriendlyName = "Items";
    ViewUrl = "PartialViews/CharacterCreation/ItemCreationView.html";
    isLoading;
    chosenItem;
    createdItemName;
    isCustom;
    constructor(possibleItems) {
        this.possibleItems = possibleItems;
        this.chosenItem = ko.observable(this.possibleItems[0]);
        this.createdItemName = ko.observable("");
        this.isCustom = ko.observable(false);
        this.isLoading = ko.observable(false);
    }
    Init(chosenItem) {
        if (chosenItem === undefined)
            return Promise.resolve();
        const itemData = this.possibleItems.find((taggedItem) => taggedItem.Payload.Name == chosenItem.Name);
        if (itemData === undefined) {
            this.chosenItem({
                Tags: [{}],
                Payload: chosenItem
            });
            this.isCustom(true);
            return Promise.resolve();
        }
        this.chosenItem(itemData);
        return Promise.resolve();
    }
    createItem() {
        const newItem = {
            Tags: [{ Source: "Custom" }],
            Payload: createBaseItem(this.createdItemName())
        };
        this.chosenItem(newItem);
        return newItem;
    }
    Evaluate() {
        if (this.isCustom())
            return this.createItem().Payload;
        return this.chosenItem().Payload;
    }
}
