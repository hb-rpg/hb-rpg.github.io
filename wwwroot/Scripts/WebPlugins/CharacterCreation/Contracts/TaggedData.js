export class SelectionPackage {
    FixedSelection;
    ChoiceSelection;
    OverrideSelection;
    OverridePossibleChoiceSelection;
    constructor(FixedSelection, // e.g. Items every Dwarf gets automatically
    ChoiceSelection, // Groups of items they must choose between
    OverrideSelection, OverridePossibleChoiceSelection) {
        this.FixedSelection = FixedSelection;
        this.ChoiceSelection = ChoiceSelection;
        this.OverrideSelection = OverrideSelection;
        this.OverridePossibleChoiceSelection = OverridePossibleChoiceSelection;
    }
}
export class ChoiceGroup {
    pickCount;
    options;
    selectedValues;
    constructor(pickCount, // How many can they choose?
    options, // The items themselves
    selectedValues) {
        this.pickCount = pickCount;
        this.options = options;
        this.selectedValues = selectedValues;
    }
}
export class TaggedObservableSelectionPackage {
    FixedSelection;
    ChoiceSelection;
    OverridePossibleSelection;
    OverridePossibleChoiceSelection;
    constructor(FixedSelection, // e.g. Items every Dwarf gets automatically
    ChoiceSelection, // Groups of items they must choose between
    OverridePossibleSelection, // e.g. Items that every STREET URCHIN cannot have
    OverridePossibleChoiceSelection) {
        this.FixedSelection = FixedSelection;
        this.ChoiceSelection = ChoiceSelection;
        this.OverridePossibleSelection = OverridePossibleSelection;
        this.OverridePossibleChoiceSelection = OverridePossibleChoiceSelection;
    }
}
export var ItemTypes;
(function (ItemTypes) {
    ItemTypes[ItemTypes["Armor"] = 0] = "Armor";
    ItemTypes[ItemTypes["Container"] = 1] = "Container";
    ItemTypes[ItemTypes["Melee"] = 2] = "Melee";
    ItemTypes[ItemTypes["Ranged"] = 3] = "Ranged";
    ItemTypes[ItemTypes["Ration"] = 4] = "Ration";
    ItemTypes[ItemTypes["Wealth"] = 5] = "Wealth";
    ItemTypes[ItemTypes["NonArmorWearables"] = 6] = "NonArmorWearables";
    ItemTypes[ItemTypes["Rope"] = 7] = "Rope";
    ItemTypes[ItemTypes["Animal"] = 8] = "Animal";
    ItemTypes[ItemTypes["TransportEquipment"] = 9] = "TransportEquipment";
    ItemTypes[ItemTypes["Consumable"] = 10] = "Consumable";
    ItemTypes[ItemTypes["Tool"] = 11] = "Tool";
    ItemTypes[ItemTypes["Ammo"] = 12] = "Ammo";
})(ItemTypes || (ItemTypes = {}));
