import { Ammo, Animals, Armor, ArmorType, BaseItem, Consumable, ContainerItem, DamageDieTypes, ItemTypes, MeleeWeapon, NonArmorWearables, RangeType, RangedWeapon, RationItem, RopeLikerItem, Tool, TransportEquipment, UncategorizedItem, WealthItem } from "../Contracts/TaggedData.js";

// Every factory takes the fields that define the item positionally and everything else — amount,
// description, value, encumbrance, notes — through one `options` bag. Encumbrance defaults to 0
// (the rules track it per-container, not per-item, for most starting gear).
type Options<ItemType extends BaseItem, Required extends keyof ItemType> =
  Partial<Omit<ItemType, Required | "Type">>

export function createBaseItem(
  name: string,
  options?: Options<BaseItem, "Name">
): UncategorizedItem {
  return {
    Name: name,
    Amount: options?.Amount ?? 1,
    Description: options?.Description,
    Value: options?.Value,
    Encumbrance: options?.Encumbrance ?? 0,
    Notes: options?.Notes,
  };
}

export function createMeleeWeapon(
  name: string,
  weaponType: string,
  damage: DamageDieTypes,
  options?: Options<MeleeWeapon, "Name" | "WeaponType" | "Damage">
): MeleeWeapon {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Melee,
    WeaponType: weaponType,
    Damage: damage,
    Range: options?.Range,
  };
}

export function createRangedWeapon(
  name: string,
  weaponType: string,
  damage: DamageDieTypes,
  range: RangeType,
  ammo: number,
  options?: Options<RangedWeapon, "Name" | "WeaponType" | "Damage" | "Range" | "Ammo">
): RangedWeapon {
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

export function createAmmoItem(
  name: string,
  forWeapon: string,
  damage: DamageDieTypes,
  options?: Options<Ammo, "Name" | "ForWeapon" | "Damage">
): Ammo {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Ammo,
    ForWeapon: forWeapon,
    Damage: damage,
  };
}

export function createArmorItem(
  name: string,
  armorType: ArmorType,
  options?: Options<Armor, "Name" | "ArmorType">
): Armor {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Armor,
    ArmorType: armorType,
    Defense: options?.Defense,
    UsageDie: options?.UsageDie,
    Limit: options?.Limit,
  };
}

export function createWearableItem(
  name: string,
  options?: Options<NonArmorWearables, "Name">
): NonArmorWearables {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.NonArmorWearables,
  };
}

export function createConsumableItem(
  name: string,
  options?: Options<Consumable, "Name">
): Consumable {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Consumable,
  };
}

export function createRationItem(
  name: string,
  servings: number,
  options?: Options<RationItem, "Name" | "Servings">
): RationItem {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Ration,
    Servings: servings,
  };
}

export function createWealthItem(
  name: string,
  wealthType: string,
  valuePerUnit: number,
  options?: Options<WealthItem, "Name" | "WealthType" | "ValuePerUnit">
): WealthItem {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Wealth,
    WealthType: wealthType,
    ValuePerUnit: valuePerUnit,
  };
}

export function createContainerItem(
  name: string,
  capacity: string[],
  options?: Options<ContainerItem, "Name" | "Capacity">
): ContainerItem {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Container,
    Capacity: capacity,
    CurrentItems: options?.CurrentItems ?? [],
  };
}

export function createRopeItem(
  name: string,
  length: number,
  options?: Options<RopeLikerItem, "Name" | "Length">
): RopeLikerItem {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Rope,
    Length: length,
  };
}

export function createTransportItem(
  name: string,
  options?: Options<TransportEquipment, "Name">
): TransportEquipment {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.TransportEquipment,
  };
}

export function createAnimalItem(
  name: string,
  options?: Options<Animals, "Name">
): Animals {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Animal,
  };
}

export function createToolItem(
  name: string,
  options?: Options<Tool, "Name">
): Tool {
  return {
    ...createBaseItem(name, options),
    Type: ItemTypes.Tool,
  };
}
