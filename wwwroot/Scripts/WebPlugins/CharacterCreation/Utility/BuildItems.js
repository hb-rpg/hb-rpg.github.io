import { ItemTypes } from "../Contracts/TaggedData.js";
export function createBaseItem(name, options) {
    return {
        Name: name,
        Amount: options?.Amount ?? 1,
        Description: options?.Description,
        Value: options?.Value,
        Encumbrance: options?.Encumbrance ?? 0,
        Notes: options?.Notes,
    };
}
export function createMeleeWeapon(name, weaponType, damage, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Melee,
        WeaponType: weaponType,
        Damage: damage,
        Range: options?.Range,
    };
}
export function createRangedWeapon(name, weaponType, damage, range, ammo, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Ranged,
        WeaponType: weaponType,
        Damage: damage,
        Range: range,
        Ammo: ammo,
        AmmoType: options?.AmmoType,
    };
}
export function createAmmoItem(name, forWeapon, damage, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Ammo,
        ForWeapon: forWeapon,
        Damage: damage,
    };
}
export function createArmorItem(name, armorType, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Armor,
        ArmorType: armorType,
        Defense: options?.Defense,
        UsageDie: options?.UsageDie,
        Limit: options?.Limit,
    };
}
export function createWearableItem(name, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.NonArmorWearables,
    };
}
export function createConsumableItem(name, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Consumable,
    };
}
export function createRationItem(name, servings, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Ration,
        Servings: servings,
    };
}
export function createWealthItem(name, wealthType, valuePerUnit, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Wealth,
        WealthType: wealthType,
        ValuePerUnit: valuePerUnit,
    };
}
export function createContainerItem(name, capacity, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Container,
        Capacity: capacity,
        CurrentItems: options?.CurrentItems ?? [],
    };
}
export function createRopeItem(name, length, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Rope,
        Length: length,
    };
}
export function createTransportItem(name, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.TransportEquipment,
    };
}
export function createAnimalItem(name, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Animal,
    };
}
export function createToolItem(name, options) {
    return {
        ...createBaseItem(name, options),
        Type: ItemTypes.Tool,
    };
}
