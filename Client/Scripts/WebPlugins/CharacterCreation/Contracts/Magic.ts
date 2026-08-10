/**
 * Vocabularies for magic. These are string-valued enums so the displayed text can be
 * changed in one place without touching every spell definition in SpellsData.
 */

/** The eight schools of magic. Ritual and Theurgic are NOT schools — see IsRitual/Tradition on Spell. */
export enum MagicSchool {
    Abjuration = "Abjuration",
    Conjuration = "Conjuration",
    Divination = "Divination",
    Enchantment = "Enchantment",
    Evocation = "Evocation",
    Illusion = "Illusion",
    Necromancy = "Necromancy",
    Transmutation = "Transmutation"
}

/** Where the magic comes from. Mirrors the Theurgy/Arcane split in the job spell choices. */
export enum MagicTradition {
    Arcane = "Arcane",
    Theurgic = "Theurgic"
}

export enum CastingTime {
    Instantaneous = "Instantaneous",
    OneTurn = "1 Turn",
    OneRound = "1 Round",
    OneMinute = "1 Minute",
    OneHour = "1 Hour"
}

export enum SpellRange {
    Self = "Self",
    Touch = "Touch",
    Close = "Close",
    Nearby = "Nearby",
    FarAway = "Far Away",
    Distant = "Distant",
    LineOfSight = "Line of Sight"
}

export enum SpellDuration {
    Instantaneous = "Instantaneous",
    OneRound = "1 Round",
    OneMinute = "1 Minute",
    FiveMinutes = "5 Minutes",
    OneHour = "1 Hour",
    UpToOneHour = "Up to 1 Hour",
    OneDay = "1 Day",
    Encounter = "Encounter",
    Permanent = "Permanent",
    UntilDispelled = "Until dispelled or destroyed"
}

/** How far each range reaches. Kept beside the enum so the distances stay in sync with the names. */
export const SpellRangeDistance: Record<SpellRange, string> = {
    [SpellRange.Self]: "",
    [SpellRange.Touch]: "",
    [SpellRange.Close]: "5'",
    [SpellRange.Nearby]: "30'",
    [SpellRange.FarAway]: "60'",
    [SpellRange.Distant]: "120'",
    [SpellRange.LineOfSight]: ""
}

/** Short forms for the narrow SCHOOL column on the character sheet. */
export const MagicSchoolAbbreviation: Record<MagicSchool, string> = {
    [MagicSchool.Abjuration]: MagicSchool.Abjuration,
    [MagicSchool.Conjuration]: MagicSchool.Conjuration,
    [MagicSchool.Divination]: MagicSchool.Divination,
    [MagicSchool.Enchantment]: MagicSchool.Enchantment,
    [MagicSchool.Evocation]: MagicSchool.Evocation,
    [MagicSchool.Illusion]: MagicSchool.Illusion,
    [MagicSchool.Necromancy]: MagicSchool.Necromancy,
    [MagicSchool.Transmutation]: MagicSchool.Transmutation
}
