import { Observable } from "../../../Framework/Knockout/knockout.js";
import { ko } from "../../../Framework/Knockout/ko.js";
import { GameItem, MultiTaggedCharacterData } from "../Contracts/TaggedData.js";
import { createBaseItem } from "../Utility/BuildItems.js";

export class ItemCreationModel implements IWizardModel<void, GameItem, GameItem | undefined> {
    FriendlyName = "Items"
    ViewUrl = "PartialViews/CharacterCreation/ItemCreationView.html"
    isLoading: Observable<boolean>;
    
    chosenItem : Observable<MultiTaggedCharacterData<GameItem>>
    createdItemName : Observable<string>

    isCustom : Observable<boolean>

    constructor (public possibleItems : MultiTaggedCharacterData<GameItem>[]) {
        
        this.chosenItem = ko.observable<MultiTaggedCharacterData<GameItem>>(this.possibleItems[0])
        this.createdItemName = ko.observable("")

        this.isCustom = ko.observable(false)
        this.isLoading = ko.observable(false)
    }
    
    Init (chosenItem? : GameItem) {
        if (chosenItem === undefined) return Promise.resolve()

        const itemData = this.possibleItems.find((taggedItem)=>taggedItem.Payload.Name == chosenItem.Name)
        
        if (itemData === undefined) {
            this.chosenItem ({
                Tags:[{}],
                Payload:chosenItem
            })
            this.isCustom(true)
            return Promise.resolve()
        }

        this.chosenItem(itemData as MultiTaggedCharacterData<GameItem> )

        return Promise.resolve()
    }

    createItem() {
        const newItem : MultiTaggedCharacterData<GameItem> = {
            Tags:[{Source: "Custom"}],
            Payload: createBaseItem(this.createdItemName())
        }

        this.chosenItem(newItem)

        return newItem
    }
    
    Evaluate () {
        if (this.isCustom()) return this.createItem().Payload 

        return (this.chosenItem() as MultiTaggedCharacterData<GameItem>).Payload
    }
}