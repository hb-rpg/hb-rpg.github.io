import { Observable, ObservableArray } from "../../../Framework/Knockout/knockout.js";
import { ConfiguredCharacterData } from "../Configuration/CharacterWizardData.js";
import { ICharacterWizardViewModel } from "../Contracts/CharacterWizardViewModels.js";
import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";

export class LockableObjectPickerModel<ObjectSelectionType> implements ICharacterWizardViewModel<void, ObjectSelectionType> {
    ViewUrl = "PartialViews/CharacterCreation/LockableObjectPickerView.html"
    isLoading: Observable<boolean>;

    widgetPreviewText : Observable<string>

    selectedUIValueObservable : ko.Observable<ObjectSelectionType | undefined>
    chosenValue : ko.Observable<ObjectSelectionType>

    isLocked : ko.Observable<boolean>
    isUnlockableByUser : Observable<boolean>
    availableOptions : ko.Computed<ObjectSelectionType[]>

    constructor (
        public FriendlyName : string, 
        public UnselectedValues : ObservableArray<ObjectSelectionType>, 
        public GlobalCharacterData : ConfiguredCharacterData, 
        public DefaultValue : ObjectSelectionType,
        public determineSelectionPreview : (selectedValue : ObjectSelectionType) => string,
        public determineWidgetPreview : (selectedValue : ObjectSelectionType) => string,
        // Values that stay in the shared pool after being picked, so sibling pickers can pick them
        // too (e.g. the "None" deity, which any number of slots may hold).
        public isRepeatable? : (value : ObjectSelectionType) => boolean,
    ) {
        this.selectedUIValueObservable = ko.observable<ObjectSelectionType | undefined>(undefined);
        this.chosenValue = ko.observable<ObjectSelectionType>(this.DefaultValue);
        this.isLocked = ko.observable(false) // This is necessary to avoid a cyclical dependency
        this.widgetPreviewText = ko.observable(this.determineWidgetPreview(this.chosenValue()))

        this.selectedUIValueObservable.subscribe((newValue)=>{
            if (this.isLocked()) return
            if (newValue === undefined) return

            if (!this.isRepeatable?.(newValue)) {
                const index = this.UnselectedValues().indexOf(newValue)
                if (index == -1) return

                this.UnselectedValues.splice(index, 1)
            }

            this.chosenValue(newValue)
            this.isLocked(true)
            this.widgetPreviewText(this.determineWidgetPreview(this.chosenValue()))
        })

        this.isLocked.subscribe((isLocked)=>{
            if (isLocked) return
            // Repeatable values were never taken out of the pool, so putting them back would duplicate them
            if (this.isRepeatable?.(this.chosenValue())) return
            this.UnselectedValues.push(this.chosenValue() as ObjectSelectionType)
        })

        this.isLoading = ko.observable(false)
        this.isUnlockableByUser = ko.observable(true)

        this.availableOptions = ko.computed(() => [...this.UnselectedValues()])
    }

    isConfigured() {
        return this.isLocked()
    }

    unlock() {
        if (!this.isUnlockableByUser()) {console.warn("Locked by dev!"); return}
        this.isLocked(false)
    }

    clear() {
        this.unlock()
        this.selectedUIValueObservable(undefined)
    }
    
    Init (chosenValue? : ObjectSelectionType) {
        if (chosenValue) this.selectedUIValueObservable(chosenValue) 
        return Promise.resolve()
    }
    
    Randomize () {
        this.clear()
        // Prefer real options over sentinels like "None" so a randomized character gets real content
        const realOptions = this.UnselectedValues().filter((value)=>!this.isRepeatable?.(value))
        const pool = realOptions.length > 0 ? realOptions : this.UnselectedValues()
        this.selectedUIValueObservable(Utility.RandomElement(pool))
        return this.chosenValue()
    }
    Evaluate () {
        return this.chosenValue()
    }
}