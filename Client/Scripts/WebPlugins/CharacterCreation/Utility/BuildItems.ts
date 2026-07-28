import { Ammo, Animals, Armor, ArmorType, BaseItem, ContainerItem, DiceRollTypes, ItemTypes, MeleeWeapon, NonArmorWearables, RangeType, RangedWeapon, RationItem, RopeLikerItem, Tool, TransportEquipment, WealthItem } from "../Contracts/TaggedData";

export function createBaseItem(
  name: string,
  encumbrance: number,
  options?: Partial<Omit<BaseItem, "Name" | "Encumbrance">>
): BaseItem {
  return {
    Name: name,
    Encumbrance: encumbrance,
    Amount: options?.Amount ?? 1,
    Description: options?.Description,
    Value: options?.Value,
    Notes: options?.Notes,
  };
}

export function createMeleeWeapon(
  name: string,
  weaponType: string,
  damage: DiceRollTypes,
  encumbrance: number,
  options?: Partial<Omit<MeleeWeapon, "Name" | "WeaponType" | "Damage" | "Encumbrance" | "Type">>
): MeleeWeapon {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Melee,
    WeaponType: weaponType,
    Damage: damage,
  };
}

export function createRangedWeapon(
  name: string,
  weaponType: string,
  damage: DiceRollTypes,
  range: RangeType,
  ammo: number,
  encumbrance: number,
  options?: Partial<Omit<RangedWeapon, "Name" | "WeaponType" | "Damage" | "Range" | "Ammo" | "Encumbrance" | "Type">>
): RangedWeapon {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Ranged,
    WeaponType: weaponType,
    Damage: damage,
    Range: range,
    Ammo: ammo,
  };
}

export function createAmmoItem(
  name: string,
  forWeapon: string,
  damage: DiceRollTypes,
  encumbrance: number,
  options?: Partial<Omit<Ammo, "Name" | "ForWeapon" | "Damage" | "Encumbrance" | "Type">>
): Ammo {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Ammo,
    ForWeapon: forWeapon,
    Damage: damage,
  };
}

export function createArmorItem(
  name: string,
  armorType: ArmorType,
  defense: number,
  encumbrance: number,
  options?: Partial<Omit<Armor, "Name" | "ArmorType" | "Defense" | "Encumbrance" | "Type">>
): Armor {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Armor,
    ArmorType: armorType,
    Defense: defense,
    Limit: options?.Limit,
  };
}

export function createWearableItem(
  name: string,
  encumbrance: number,
  options?: Partial<Omit<NonArmorWearables, "Name" | "Encumbrance" | "Type">>
): NonArmorWearables {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.NonArmorWearables,
  };
}

export function createRationItem(
  name: string,
  servings: number,
  encumbrance: number,
  options?: Partial<Omit<RationItem, "Name" | "Servings" | "Encumbrance" | "Type">>
): RationItem {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Ration,
    Servings: servings,
  };
}

export function createWealthItem(
  name: string,
  wealthType: string,
  valuePerUnit: number,
  encumbrance: number,
  options?: Partial<Omit<WealthItem, "Name" | "WealthType" | "ValuePerUnit" | "Encumbrance" | "Type">>
): WealthItem {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Wealth,
    WealthType: wealthType,
    ValuePerUnit: valuePerUnit,
  };
}

export function createContainerItem(
  name: string,
  capacity: string[],
  encumbrance: number,
  options?: Partial<Omit<ContainerItem, "Name" | "Capacity" | "Encumbrance" | "Type">>
): ContainerItem {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Container,
    Capacity: capacity,
    CurrentItems: options?.CurrentItems ?? [],
  };
}

export function createRopeItem(
  name: string,
  length: number,
  encumbrance: number,
  options?: Partial<Omit<RopeLikerItem, "Name" | "Length" | "Encumbrance" | "Type">>
): RopeLikerItem {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Rope,
    Length: length,
  };
}

export function createTransportItem(
  name: string,
  encumbrance: number,
  options?: Partial<Omit<TransportEquipment, "Name" | "Encumbrance" | "Type">>
): TransportEquipment {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.TransportEquipment,
  };
}

export function createAnimalItem(
  name: string,
  encumbrance: number,
  options?: Partial<Omit<Animals, "Name" | "Encumbrance" | "Type">>
): Animals {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Animal,
  };
}

export function createToolItem(
  name: string,
  encumbrance: number,
  options?: Partial<Omit<Tool, "Name" | "Encumbrance" | "Type">>
): Tool {
  return {
    ...createBaseItem(name, encumbrance, options),
    Type: ItemTypes.Tool,
  };
}