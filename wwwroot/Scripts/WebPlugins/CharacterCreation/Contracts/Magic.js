/**
 * Vocabularies for magic. These are string-valued enums so the displayed text can be
 * changed in one place without touching every spell definition in SpellsData.
 */
/** The eight schools of magic. Ritual and Theurgic are NOT schools — see IsRitual/Tradition on Spell. */
export var MagicSchool;
(function (MagicSchool) {
    MagicSchool["Abjuration"] = "Abjuration";
    MagicSchool["Conjuration"] = "Conjuration";
    MagicSchool["Divination"] = "Divination";
    MagicSchool["Enchantment"] = "Enchantment";
    MagicSchool["Evocation"] = "Evocation";
    MagicSchool["Illusion"] = "Illusion";
    MagicSchool["Necromancy"] = "Necromancy";
    MagicSchool["Transmutation"] = "Transmutation";
})(MagicSchool || (MagicSchool = {}));
/** Where the magic comes from. Mirrors the Theurgy/Arcane split in the job spell choices. */
export var MagicTradition;
(function (MagicTradition) {
    MagicTradition["Arcane"] = "Arcane";
    MagicTradition["Theurgic"] = "Theurgic";
})(MagicTradition || (MagicTradition = {}));
export var CastingTime;
(function (CastingTime) {
    CastingTime["Instantaneous"] = "Instantaneous";
    CastingTime["OneTurn"] = "1 Turn";
    CastingTime["OneRound"] = "1 Round";
    CastingTime["OneMinute"] = "1 Minute";
    CastingTime["OneHour"] = "1 Hour";
})(CastingTime || (CastingTime = {}));
export var SpellRange;
(function (SpellRange) {
    SpellRange["Self"] = "Self";
    SpellRange["Touch"] = "Touch";
    SpellRange["Close"] = "Close";
    SpellRange["Nearby"] = "Nearby";
    SpellRange["FarAway"] = "Far Away";
    SpellRange["Distant"] = "Distant";
    SpellRange["LineOfSight"] = "Line of Sight";
})(SpellRange || (SpellRange = {}));
export var SpellDuration;
(function (SpellDuration) {
    SpellDuration["Instantaneous"] = "Instantaneous";
    SpellDuration["OneRound"] = "1 Round";
    SpellDuration["OneMinute"] = "1 Minute";
    SpellDuration["FiveMinutes"] = "5 Minutes";
    SpellDuration["OneHour"] = "1 Hour";
    SpellDuration["UpToOneHour"] = "Up to 1 Hour";
    SpellDuration["OneDay"] = "1 Day";
    SpellDuration["Encounter"] = "Encounter";
    SpellDuration["Permanent"] = "Permanent";
    SpellDuration["UntilDispelled"] = "Until dispelled or destroyed";
})(SpellDuration || (SpellDuration = {}));
/** How far each range reaches. Kept beside the enum so the distances stay in sync with the names. */
export const SpellRangeDistance = {
    [SpellRange.Self]: "",
    [SpellRange.Touch]: "",
    [SpellRange.Close]: "5'",
    [SpellRange.Nearby]: "30'",
    [SpellRange.FarAway]: "60'",
    [SpellRange.Distant]: "120'",
    [SpellRange.LineOfSight]: ""
};
/** Short forms for the narrow SCHOOL column on the character sheet. */
export const MagicSchoolAbbreviation = {
    [MagicSchool.Abjuration]: MagicSchool.Abjuration,
    [MagicSchool.Conjuration]: MagicSchool.Conjuration,
    [MagicSchool.Divination]: MagicSchool.Divination,
    [MagicSchool.Enchantment]: MagicSchool.Enchantment,
    [MagicSchool.Evocation]: MagicSchool.Evocation,
    [MagicSchool.Illusion]: MagicSchool.Illusion,
    [MagicSchool.Necromancy]: MagicSchool.Necromancy,
    [MagicSchool.Transmutation]: MagicSchool.Transmutation
};
