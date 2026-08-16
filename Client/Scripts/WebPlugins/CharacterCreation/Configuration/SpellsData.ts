import { AbilityNames } from "../Contracts/Abilities.js";
import { Edges } from "../Contracts/Edges.js";
import { CastingTime, MagicSchool, MagicTradition, SpellDuration, SpellRange } from "../Contracts/Magic.js";
import { Spell } from "../Contracts/Spell.js";
import { JobSubset, JobSubsetEnum, JobType } from "../Contracts/StringTypes.js";
import { ChoiceGroup, SelectionPackage } from "../Contracts/TaggedData.js";
import { EdgesData } from "./EdgesData.js";

export namespace SpellData {

    // ─── Level 0 ─────────────────────────────────────────────────────────────
    const ArcaneMark = new Spell({
        Name: "Arcane Mark",
        Description: "You can leave visible or invisible, short, written messages on any surface. If invisible it can only be seen with Detect Magic.",
        Level: 0,
        School: [MagicSchool.Evocation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Permanent,
        Test: []
    });

    // Source text gives no casting block for this spell — only the summary line.
    const BladeWard = new Spell({
        Name: "Blade Ward",
        Description: "You take less damage from melee attacks.",
        Level: 0
    });

    const ChangeSelf = new Spell({
        Name: "Change Self",
        Description: "You can magically disguise your possessions and yourself as another sex, and/or race of similar size.",
        Level: 0,
        School: [MagicSchool.Illusion],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneHour,
        Test: [AbilityNames.Intelligence]
    });

    // Source text gives no casting block for this spell — only the summary line.
    const ChillTouch = new Spell({
        Name: "Chill Touch",
        Description: "A target takes necrotic damage and cannot heal.",
        Level: 0
    });

    const DancingLights = new Spell({
        Name: "Dancing Lights",
        Description: "You can create up to 4 lights that can move within the spell's range.",
        Level: 0,
        School: [MagicSchool.Evocation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.LineOfSight,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const Daze = new Spell({
        Name: "Daze",
        Description: "If the target fails their save, they can only perform a Standard Move or a Standard Action on their turn.",
        Level: 0,
        School: [MagicSchool.Enchantment],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneRound,
        Test: [AbilityNames.Wisdom]
    });

    const DetectMagic = new Spell({
        Name: "Detect Magic",
        Description: "When you concentrate and focus on an area or item you can sense the presence of magic and its relative strength. Some materials like lead may block detection.",
        Level: 0,
        School: [MagicSchool.Divination],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneMinute,
        Range: SpellRange.FarAway,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const DetectPoison = new Spell({
        Name: "Detect Poison",
        Description: "You can detect if an item is poison or poisoned and whether an individual has been poisoned. With a successful INT Test, you can discern its relative strength, type, and potential antidotes.",
        Level: 0,
        School: [MagicSchool.Divination],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.FarAway,
        Duration: SpellDuration.OneHour,
        Test: []
    });

    const EndureElements = new Spell({
        Name: "Endure Elements",
        Description: "You are immune to harsh and intense weather conditions. If cast at 1st level, the Range is Touch and the spell can be cast on someone other than the caster.",
        Level: 0,
        School: [MagicSchool.Abjuration],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Self,
        Duration: SpellDuration.OneDay,
        Test: []
    });

    // Source text gives no casting block for this spell — only the summary line.
    const Infestation = new Spell({
        Name: "Infestation",
        Description: "You can create a swarm of parasites or pests to harass and attack a target.",
        Level: 0
    });

    // Was "Light/Darkness". The source splits this into Light (0) and Darkness/Daylight (2).
    const Light = new Spell({
        Name: "Light",
        Description: "You can select an object and it will illuminate all that is Nearby it. Light can be cast on an unwilling target's possessions; a WIS Test negates. The reverse of this spell is Create Dark.",
        Level: 0,
        School: [MagicSchool.Evocation],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Encounter,
        Test: [AbilityNames.Wisdom]
    });

    const MageHand = new Spell({
        Name: "Mage Hand",
        Description: "You can lift an object up to 5 pounds and move it anywhere within range.",
        Level: 0,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const Mending = new Spell({
        Name: "Mending",
        Description: "You are able to fix non-magical, broken items. Complex objects or those with multiple moving parts will take multiple applications of the spell.",
        Level: 0,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Close,
        Duration: SpellDuration.Permanent,
        Test: []
    });

    const Message = new Spell({
        Name: "Message",
        Description: "If you can see the target and they are in range, you whisper in their ear.",
        Level: 0,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.FarAway,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    // Combines the old Minor Illusion and Ghost Sound. Source omits the school line; Illusion is implied by the name.
    const MinorIllusion = new Spell({
        Name: "Minor Illusion",
        Description: "You create a sound or an image of an object within range that lasts for the duration, ending early if you dismiss it or cast this spell again. A sound can range from a whisper to a scream and may be continuous or made at discrete times, but its basic character is fixed when cast. An image must be no larger than a 5-foot cube and creates no sound, light, or smell — physical interaction reveals it as an illusion. A creature that uses its action to examine the illusion identifies it with a successful INT Test.",
        Level: 0,
        School: [MagicSchool.Illusion],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const Prestidigitation = new Spell({
        Name: "Prestidigitation",
        Description: "You can do minor magical tricks: light or snuff out a candle, torch, or small campfire; clean or soil an object no larger than 1 cubic foot; chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour; make a color, small mark, or symbol appear on an object or surface for 1 hour; or create a non-magical trinket or illusory image that fits in your hand and lasts until the end of your next turn.",
        Level: 0,
        School: [MagicSchool.Transmutation],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.UpToOneHour,
        Test: []
    });

    const RayOfFrost = new Spell({
        Name: "Ray of Frost",
        Description: "A successful attack will cause 1d6 damage. The target loses their next Move action if they fail their DEX Test.",
        Level: 0,
        School: [MagicSchool.Evocation],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Instantaneous,
        Test: [AbilityNames.Dexterity]
    });

    // ─── Level 1 ─────────────────────────────────────────────────────────────
    const AlterSelf = new Spell({
        Name: "Alter Self",
        Description: "You can transform into another humanoid and gain their natural abilities such as Darkvision, waterbreathing, or natural attacks.",
        Level: 1,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Self,
        Duration: SpellDuration.OneHour,
        Test: []
    });

    const ArcaneLock = new Spell({
        Name: "Arcane Lock",
        Description: "The target door or chest can only be opened by a Knock spell or by being battered open.",
        Level: 1,
        School: [MagicSchool.Abjuration],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.UntilDispelled,
        Test: []
    });

    const BurningHands = new Spell({
        Name: "Burning Hands",
        Description: "You create a cone of flame causing 1d6 damage. Until they take a turn to extinguish themselves with a successful DEX Test, targets take an additional 1d4 on each of their turns.",
        Level: 1,
        School: [MagicSchool.Evocation],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    const CharmPerson = new Spell({
        Name: "Charm Person",
        Description: "If the target fails their WIS or CHA Test, they will view you as one of their closest friends and assist you in any way they can without directly harming themselves or someone they love. The Ability Check is made with Advantage if you have already been fighting the target.",
        Level: 1,
        School: [MagicSchool.Enchantment],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.OneHour,
        Test: [AbilityNames.Wisdom, AbilityNames.Charisma]
    });

    // Source annotates this as a possible level 0 spell; kept at 1 as written.
    const ComprehendLanguages = new Spell({
        Name: "Comprehend Languages",
        Description: "You can read, speak, and write a language for the duration of the spell.",
        Level: 1,
        School: [MagicSchool.Divination],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Self,
        Duration: SpellDuration.OneHour,
        Test: []
    });

    const FeatherFall = new Spell({
        Name: "Feather Fall",
        Description: "You and those Close can fall up to 300' and take no falling damage.",
        Level: 1,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.Instantaneous,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const FloatingDisk = new Spell({
        Name: "Floating Disk",
        Description: "Your invisible disk can carry 36 items or approximately 500 lbs just above the ground and travels Close to you as you move.",
        Level: 1,
        School: [MagicSchool.Evocation],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneHour,
        Test: []
    });

    const Identify = new Spell({
        Name: "Identify",
        Description: "You learn how a magic item functions or which spell is affecting a target. You can determine one function, use, and means of operation of an item each time you cast this spell.",
        Level: 1,
        School: [MagicSchool.Divination],
        IsRitual: true,
        CastingTime: CastingTime.OneMinute,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    const Jump = new Spell({
        Name: "Jump",
        Description: "You or your target can jump to a location Nearby on each full Turn Move.",
        Level: 1,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const MagicMissile = new Spell({
        Name: "Magic Missile",
        Description: "You create three energy darts that cause 1d4+1 damage. No attack roll is required and you may choose more than one target. You can create 2 additional darts for each level higher that you cast the spell.",
        Level: 1,
        School: [MagicSchool.Evocation],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Distant,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    const ObscuringMist = new Spell({
        Name: "Obscuring Mist",
        Description: "A stationary, magical mist obscures you and everything Nearby you from all but magic vision. A strong wind will disperse the mist. Melee attacks against those obscured by the mist are at Disadvantage, as are all missile attacks and damage against them.",
        Level: 1,
        School: [MagicSchool.Conjuration],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const ProtectionFromProfaneDivine = new Spell({
        Name: "Protection From Profane/Divine",
        Description: "You can touch someone and they receive Advantage on Ability Tests against undead and extraplanar profane or divine creatures, including against any fear causing or coercive/charm/possession abilities used against them. Those creatures have Disadvantage on Attacks against those protected.",
        Level: 1,
        School: [MagicSchool.Abjuration],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    const Shield = new Spell({
        Name: "Shield",
        Description: "All missile attack and damage rolls against you are at Disadvantage. You are immune to Magic Missile.",
        Level: 1,
        School: [MagicSchool.Abjuration],
        IsRitual: true,
        CastingTime: CastingTime.Instantaneous,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const ShockingGrasp = new Spell({
        Name: "Shocking Grasp",
        Description: "You cause 1d8 plus your level in damage and the target loses their next move action.",
        Level: 1,
        School: [MagicSchool.Evocation],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    const Sleep = new Spell({
        Name: "Sleep",
        Description: "You cause 2d4 HD of creatures in range to fall asleep, starting with those closest to you. Individuals of 5HD or more are not affected.",
        Level: 1,
        School: [MagicSchool.Enchantment],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    // Source reads "Self or Touch"; Range holds a single value, so the broader reach is recorded.
    const SpiderClimb = new Spell({
        Name: "Spider Climb",
        Description: "You or your target can climb like a spider along walls and ceilings as a normal move action. Can be cast on Self or by Touch.",
        Level: 1,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.OneHour,
        Test: []
    });

    const Summon = new Spell({
        Name: "Summon",
        Description: "You conjure a creature between the size of a large dog and a human whose appearance you choose. It has 1HD and can attack for 1d8 damage.",
        Level: 1,
        School: [MagicSchool.Conjuration],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.OneRound,
        Test: []
    });

    // ─── Level 2 ─────────────────────────────────────────────────────────────
    const AcidArrow = new Spell({
        Name: "Acid Arrow",
        Description: "With a successful attack, you strike a target with an acid arrow that causes 2d4 damage. Until they pass a CON Test or the acid is neutralized, they take an additional 2d4 damage on each of their turns.",
        Level: 2,
        School: [MagicSchool.Conjuration],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Distant,
        Duration: SpellDuration.Instantaneous,
        Test: [AbilityNames.Constitution]
    });

    // Source reads "Self or Touch"; Range holds a single value, so the broader reach is recorded.
    const Blur = new Spell({
        Name: "Blur",
        Description: "Your form is blurred and all melee and missile attacks and damage against you are at Disadvantage. Can be cast on Self or by Touch.",
        Level: 2,
        School: [MagicSchool.Illusion],
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const Darkness = new Spell({
        Name: "Darkness",
        Description: "All nearby is in darkness and light spells of equal or lower level are cancelled out. Special sight abilities cannot see through this darkness. Darkness can be cast on an unwilling target's possessions; a WIS Test negates. The reverse of this spell is Daylight.",
        Level: 2,
        School: [MagicSchool.Evocation],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Instantaneous,
        Test: [AbilityNames.Wisdom]
    });

    const Daylight = new Spell({
        Name: "Daylight",
        Description: "Brightly illuminates and cancels out darkness spells of equal or lower level. Daylight can be cast on an unwilling target's possessions; a WIS Test negates. The reverse of this spell is Darkness. Sight is hindered for those with Darkvision.",
        Level: 2,
        School: [MagicSchool.Evocation],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Instantaneous,
        Test: [AbilityNames.Wisdom]
    });

    const DetectThoughts = new Spell({
        Name: "Detect Thoughts",
        Description: "When you concentrate and focus on an area you can sense if it contains creatures with conscious thoughts. In the second minute you can discern the number of minds and their relative intelligence. In the third and subsequent minutes you can attempt to detect surface thoughts if the targets fail a WIS Test.",
        Level: 2,
        School: [MagicSchool.Divination],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.FarAway,
        Duration: SpellDuration.FiveMinutes,
        Test: []
    });

    // Source lists the Test as "Ability Weakened", which is a condition rather than an attribute.
    const EnhanceAbility = new Spell({
        Name: "Enhance Ability",
        Description: "Your target receives +4 (18 maximum) to an ability score of your choice for the spell's duration. This spell can be reversed as Weaken Attribute (-4, minimum 3) if the target fails the Test for the Ability Weakened.",
        Level: 2,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    const Invisibility = new Spell({
        Name: "Invisibility",
        Description: "You are invisible until the duration ends or you attack. Attacks and damage from those who detect you are at Disadvantage. See Common Conditions - Invisible.",
        Level: 2,
        School: [MagicSchool.Illusion],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    const Knock = new Spell({
        Name: "Knock",
        Description: "This spell opens locks on doors, chests, manacles, etc. and suppresses Arcane Lock for an Encounter. This spell's opposite is Arcane Lock.",
        Level: 2,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    const Levitate = new Spell({
        Name: "Levitate",
        Description: "You or your target are able to float up or down vertically as a normal move for the spell's duration.",
        Level: 2,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    // Source range is 500', which exceeds every SpellRange member; Line of Sight is the closest fit.
    const LocateObject = new Spell({
        Name: "Locate Object",
        Description: "You can sense the direction of an object you have seen before, out to 500'. It can be general in nature such as stairs or gold. Some materials like lead may block detection.",
        Level: 2,
        School: [MagicSchool.Divination],
        Tradition: [MagicTradition.Theurgic],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.LineOfSight,
        Duration: SpellDuration.OneMinute,
        Test: []
    });

    const MagicMouth = new Spell({
        Name: "Magic Mouth",
        Description: "A magical mouth that can speak up to 30 words when triggered.",
        Level: 2,
        School: [MagicSchool.Illusion],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Close,
        Duration: SpellDuration.Permanent,
        Test: []
    });

    const MirrorImage = new Spell({
        Name: "Mirror Image",
        Description: "You create 1d4+1 visual duplicates around you and choose which one is you. Each attack is against a random one of your group, and each mirrored image disappears when it is attacked.",
        Level: 2,
        School: [MagicSchool.Illusion],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Close,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    const ProtectionFromArrows = new Spell({
        Name: "Protection from Arrows",
        Description: "Target can ignore 6 points of damage from each successful ranged missile attack for the duration of the spell.",
        Level: 2,
        School: [MagicSchool.Abjuration],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    const RopeTrick = new Spell({
        Name: "Rope Trick",
        Description: "A rope rises into the air and up to three can climb up into a small safe pocket dimension, then pull the rope up behind them.",
        Level: 2,
        School: [MagicSchool.Transmutation],
        IsRitual: true,
        CastingTime: CastingTime.OneRound,
        Range: SpellRange.Touch,
        Duration: SpellDuration.OneHour,
        Test: []
    });

    const Scare = new Spell({
        Name: "Scare",
        Description: "Creatures with less than 5HD must successfully pass their WIS Test (adding your HD to the roll). Banished creatures must do Full Turn Movement away from you for their next 1d6 Turns. With a Critical Failure, they will flee not to return for at least one day.",
        Level: 2,
        School: [MagicSchool.Enchantment, MagicSchool.Necromancy],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.FarAway,
        Duration: SpellDuration.Instantaneous,
        Test: [AbilityNames.Wisdom]
    });

    const SeeInvisibility = new Spell({
        Name: "See Invisibility",
        Description: "You can see creatures or objects that are invisible.",
        Level: 2,
        School: [MagicSchool.Divination],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Touch,
        Duration: SpellDuration.Encounter,
        Test: []
    });

    const Shatter = new Spell({
        Name: "Shatter",
        Description: "All glass and brittle objects within a 25 ft radius shatter. Glass, crystal, and stone creatures take 2d6 damage.",
        Level: 2,
        School: [MagicSchool.Evocation],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.Nearby,
        Duration: SpellDuration.Instantaneous,
        Test: []
    });

    const Web = new Spell({
        Name: "Web",
        Description: "You create a 20'x20' area of sticky webbing within the spell's range. Any moving through or within the web must pass a DEX Test each Turn or lose their move. A critical failure indicates they have fallen and lose both move and attack.",
        Level: 2,
        School: [MagicSchool.Conjuration],
        IsRitual: true,
        CastingTime: CastingTime.OneTurn,
        Range: SpellRange.FarAway,
        Duration: SpellDuration.Encounter,
        Test: [AbilityNames.Dexterity]
    });

    // ─── Unlevelled ──────────────────────────────────────────────────────────
    // These are granted by backgrounds but do not appear in the Sorcery spell list, so
    // they have no level, school, or casting block yet. Do not delete them — the Job and
    // JobSubset records below are exhaustive and reference them by name.
    const TaintFoodAndDrink = new Spell({ Name: "Taint Food and Drink", Description: "Your touch can spoil food and beverages." });
    const DetectProfaneDivine = new Spell({ Name: "Detect Profane/Divine", Description: "You can sense creatures that are undead or of extraplanar origin." });
    const HealingHand = new Spell({ Name: "Healing Hand", Description: "Your touch can heal minor wounds." });
    const HarmingHand = new Spell({ Name: "Harming Hand", Description: "Your touch can cause minor wounds." });
    const Guidance = new Spell({ Name: "Guidance", Description: "You can perform an action in a way you know is more likely to be successful." });
    const Augury = new Spell({ Name: "Augury", Description: "You can see potential outcomes and events in the near future." });
    const CreateWater = new Spell({ Name: "Create Water", Description: "You can manifest clear, clean drinking water." });
    const PurifyFoodAndDrink = new Spell({ Name: "Purify Food and Drink", Description: "Your blessing can restore spoiled food and beverages." });
    const CureWounds = new Spell({ Name: "Cure Wounds", Description: "Your touch can heal serious wounds." });
    const SpeakWithDead = new Spell({ Name: "Speak with Dead", Description: "You can compel a corpse or skeleton to answer questions." });
    const DetectWater = new Spell({ Name: "Detect Water", Description: "You can detect water and its quality (safe, brackish, etc)." });
    const FireBolt = new Spell({ Name: "Fire Bolt", Description: "You can shoot a ball of fire from your hands or eyes." });

    /** Every spell in the catalog, ordered by level then name. */
    export const AllSpells: Spell[] = [
        // Level 0
        ArcaneMark, BladeWard, ChangeSelf, ChillTouch, DancingLights, Daze, DetectMagic, DetectPoison,
        EndureElements, Infestation, Light, MageHand, Mending, Message, MinorIllusion, Prestidigitation, RayOfFrost,
        // Level 1
        AlterSelf, ArcaneLock, BurningHands, CharmPerson, ComprehendLanguages, FeatherFall, FloatingDisk,
        Identify, Jump, MagicMissile, ObscuringMist, ProtectionFromProfaneDivine, Shield, ShockingGrasp,
        Sleep, SpiderClimb, Summon,
        // Level 2
        AcidArrow, Blur, Darkness, Daylight, DetectThoughts, EnhanceAbility, Invisibility, Knock, Levitate,
        LocateObject, MagicMouth, MirrorImage, ProtectionFromArrows, RopeTrick, Scare, SeeInvisibility, Shatter, Web,
        // Unlevelled
        Augury, CreateWater, CureWounds, DetectProfaneDivine, DetectWater, FireBolt, Guidance, HarmingHand,
        HealingHand, PurifyFoodAndDrink, SpeakWithDead, TaintFoodAndDrink
    ];

    const none = new SelectionPackage<Spell>([], [], []);

    export const JobToSpellsRecord : Record<JobType, SelectionPackage<Spell>> = {
        "Apprentice Artisan": none,
        "Apprentice Bureaucrat": none, // Managed via Subset (Scrivener)
        "Free Laborer": none,
        "Apprentice Crafter": none,
        "Apprentice Mercantiler": none,
        "Escaped Peasant/Thrall": none,
        Acrobat: none,
        Contortionist: none,
        Jester: none,
        Minstrel: none,
        Scholar: new SelectionPackage<Spell>([ComprehendLanguages], [], []),
        "Storyteller/Thespian": none,
        Accursed: new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [DetectMagic, EndureElements, TaintFoodAndDrink], []), // Theurgy choice
            new ChoiceGroup(1, [ChangeSelf, MageHand, Mending], []) // Arcane choice
        ], []),
        Acolyte: new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [DetectProfaneDivine, HealingHand, Light], [])
        ], []),
        Cultist: new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [DetectProfaneDivine, HarmingHand, Light], [])
        ], []),
        Inquisitor: new SelectionPackage<Spell>([DetectProfaneDivine], [], []),
        Pariah: new SelectionPackage<Spell>([Guidance, Augury], [], []),
        "Touched/Anchorite": new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [CreateWater, HealingHand, PurifyFoodAndDrink], [])
        ], []),
        Armiger: none,
        Barbarian: none,
        "Mercenary/Hedge": none,
        Prizefighter: none,
        "Ruffian/Enforcer": none,
        "Woodard/Warden": none,
        "Adept/Arcane Apprentice": new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [DetectMagic, Light, Prestidigitation, MageHand], []), // Lvl 0
            new ChoiceGroup(1, [CharmPerson, MagicMissile, Summon, FloatingDisk], []) // Lvl 1
        ], []),
        "Alchemy Apprentice": new SelectionPackage<Spell>([Identify], [
            new ChoiceGroup(1, [DetectPoison, EndureElements, Mending], [])
        ], []),
        "Arcane Researcher": new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [ArcaneMark, MageHand, Mending], []),
            new ChoiceGroup(1, [ChangeSelf, Daze, DetectMagic], [])
        ], []),
        Charlatan: new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [Augury, CharmPerson, CureWounds, DetectThoughts, Invisibility, Levitate, LocateObject, RopeTrick, Sleep, SpeakWithDead], []), // Ritual choice
            new ChoiceGroup(1, [ChangeSelf, Message, MinorIllusion], []), // Choice 1
            new ChoiceGroup(1, [Daze, DancingLights, MageHand], []) // Choice 2
        ], []),
        Dowser: new SelectionPackage<Spell>([DetectWater], [
            new ChoiceGroup(1, [DetectMagic, DetectPoison], [])
        ], []),
        Warlock: new SelectionPackage<Spell>([], [
            new ChoiceGroup(1, [DetectMagic, Light, Prestidigitation, MageHand], []), // Lvl 0
            new ChoiceGroup(1, [CharmPerson, MagicMissile, Summon, FloatingDisk], []) // Lvl 1
        ], []),
        Fence: none,
        Gambler: none,
        Scoundrel: none,
        Sharp: none,
        Spy: none,
        "Street Urchin": none
    }

    export const JobSubsetToSpellsRecord : Record<JobSubset, SelectionPackage<Spell>> = {
        [JobSubsetEnum.None]: none,
        [JobSubsetEnum.Jeweler]: none,
        [JobSubsetEnum.Arbalist]: none,
        [JobSubsetEnum.Scrivener]: new SelectionPackage<Spell>([ComprehendLanguages], [], []),
        [JobSubsetEnum.Advocate]: none,
        [JobSubsetEnum.Cartographer]: none,
        [JobSubsetEnum.Inspector]: none,
        [JobSubsetEnum.Interpreter]: none,
        [JobSubsetEnum.RatCatcher]: none,
        [JobSubsetEnum.Smith]: none,
        [JobSubsetEnum.Carpenter]: none,
        [JobSubsetEnum.MoneyChanger]: none,
        [JobSubsetEnum.Ambler]: none,
        [JobSubsetEnum.Chef]: none,
        [JobSubsetEnum.HouseServant]: none,
        [JobSubsetEnum.Farmhand]: none,
        [JobSubsetEnum.Laborer]: none,
        [JobSubsetEnum.Sailor]: none,
        [JobSubsetEnum.Brewer]: none,
        [JobSubsetEnum.Farmer]: none,
        [JobSubsetEnum.Herder]: none,
        [JobSubsetEnum.Oratory]: none,
        [JobSubsetEnum.Theology]: none,
        [JobSubsetEnum.Vintner]: none,
        [JobSubsetEnum.Esoterica]: none,
        [JobSubsetEnum.ActiveService]: none,
        [JobSubsetEnum.Freelance]: none,
        [JobSubsetEnum.LordSlain]: none,
        [JobSubsetEnum.Disgraced]: none,
        [JobSubsetEnum.HedgeKnight]: none,
        [JobSubsetEnum.Mercenary]: none,
        [JobSubsetEnum.Bandit]: none,
        [JobSubsetEnum.Discharged]: none,
        [JobSubsetEnum.IxianRaver]: none,
        [JobSubsetEnum.IxianArchon]: none,
        [JobSubsetEnum.Dragon]: none,
        [JobSubsetEnum.Lich]: none,
        [JobSubsetEnum.Wizard]: none,
        [JobSubsetEnum.ElderGod]: none,
        [JobSubsetEnum.Moloch]: none,
        [JobSubsetEnum.Kain]: none,
        [JobSubsetEnum.ThreeTrinketRandom]: none,
        [JobSubsetEnum.OneTrinketChoice]: none,
        [JobSubsetEnum.DisguiseSpecialist]: none,
        [JobSubsetEnum.BurglarSpecialist]:  none,
        [JobSubsetEnum.Armorer]:            none,
        [JobSubsetEnum.Bowyer]:             none,
        [JobSubsetEnum.Fletcher]:           none,
        [JobSubsetEnum.Tailor]:             none,
        [JobSubsetEnum.Locksmith]:          none,
        [JobSubsetEnum.Cooper]:             none,
        [JobSubsetEnum.Leatherworker]:      none,
        [JobSubsetEnum.Mason]:              none,
        [JobSubsetEnum.Swordsmith]:         none,
        [JobSubsetEnum.Assayer]:            none,
        [JobSubsetEnum.Herbalist]:          none,
        [JobSubsetEnum.Peddler]:            none,
        [JobSubsetEnum.Fisher]:             none,
        [JobSubsetEnum.Wagoner]:            none,
    }

    export const EdgeToSpellRecord : Map<Edges, SelectionPackage<Spell>> = new Map()
    EdgeToSpellRecord.set(EdgesData.StandardSpell, new SelectionPackage<Spell>([], [new ChoiceGroup(1, [ChangeSelf, FireBolt, Darkness], [])], []))

}
