import { ko } from "../../../Framework/Knockout/ko.js";
import { Utility } from "../../../WebCore/Utility.js";
export class LockableObjectPickerModel {
    FriendlyName;
    UnselectedValues;
    GlobalCharacterData;
    DefaultValue;
    determineSelectionPreview;
    determineWidgetPreview;
    isRepeatable;
    ViewUrl = "PartialViews/CharacterCreation/LockableObjectPickerView.html";
    isLoading;
    widgetPreviewText;
    selectedUIValueObservable;
    chosenValue;
    isLocked;
    isUnlockableByUser;
    availableOptions;
    constructor(FriendlyName, UnselectedValues, GlobalCharacterData, DefaultValue, determineSelectionPreview, determineWidgetPreview, 
    // Values that stay in the shared pool after being picked, so sibling pickers can pick them
    // too (e.g. the "None" deity, which any number of slots may hold).
    isRepeatable) {
        this.FriendlyName = FriendlyName;
        this.UnselectedValues = UnselectedValues;
        this.GlobalCharacterData = GlobalCharacterData;
        this.DefaultValue = DefaultValue;
        this.determineSelectionPreview = determineSelectionPreview;
        this.determineWidgetPreview = determineWidgetPreview;
        this.isRepeatable = isRepeatable;
        this.selectedUIValueObservable = ko.observable(undefined);
        this.chosenValue = ko.observable(this.DefaultValue);
        this.isLocked = ko.observable(false); // This is necessary to avoid a cyclical dependency
        this.widgetPreviewText = ko.observable(this.determineWidgetPreview(this.chosenValue()));
        this.selectedUIValueObservable.subscribe((newValue) => {
            if (this.isLocked())
                return;
            if (newValue === undefined)
                return;
            if (!this.isRepeatable?.(newValue)) {
                const index = this.UnselectedValues().indexOf(newValue);
                if (index == -1)
                    return;
                this.UnselectedValues.splice(index, 1);
            }
            this.chosenValue(newValue);
            this.isLocked(true);
            this.widgetPreviewText(this.determineWidgetPreview(this.chosenValue()));
        });
        this.isLocked.subscribe((isLocked) => {
            if (isLocked)
                return;
            // Repeatable values were never taken out of the pool, so putting them back would duplicate them
            if (this.isRepeatable?.(this.chosenValue()))
                return;
            this.UnselectedValues.push(this.chosenValue());
        });
        this.isLoading = ko.observable(false);
        this.isUnlockableByUser = ko.observable(true);
        this.availableOptions = ko.computed(() => [...this.UnselectedValues()]);
    }
    isConfigured() {
        return this.isLocked();
    }
    unlock() {
        if (!this.isUnlockableByUser()) {
            console.warn("Locked by dev!");
            return;
        }
        this.isLocked(false);
    }
    clear() {
        this.unlock();
        this.selectedUIValueObservable(undefined);
    }
    Init(chosenValue) {
        if (chosenValue)
            this.selectedUIValueObservable(chosenValue);
        return Promise.resolve();
    }
    Randomize() {
        this.clear();
        // Prefer real options over sentinels like "None" so a randomized character gets real content
        const realOptions = this.UnselectedValues().filter((value) => !this.isRepeatable?.(value));
        const pool = realOptions.length > 0 ? realOptions : this.UnselectedValues();
        this.selectedUIValueObservable(Utility.RandomElement(pool));
        return this.chosenValue();
    }
    Evaluate() {
        return this.chosenValue();
    }
}
