import { Utility } from "../../../WebCore/Utility.js";
import { JobSubset, JobSubsetEnum, JobType, RaceType } from "../Contracts/StringTypes.js";
import { ChoiceGroup, GameItem, SelectionPackage } from "../Contracts/TaggedData.js";
import {
    createAmmoItem, createAnimalItem, createArmorItem, createBaseItem, createConsumableItem,
    createContainerItem, createMeleeWeapon, createRangedWeapon, createRationItem, createRopeItem,
    createToolItem, createTransportItem, createWealthItem, createWearableItem
} from "../Utility/BuildItems.js";
import { DiceRoll } from "../Utility/DiceRoll.js";

const genericCoinFactory = (amount : number, value? : number, Description? : string) : GameItem => {
    return createWealthItem(`${value} Coins from selling trinket`, "Coin", value ?? 0, {Amount: amount, Value: value, Description})
}


const TrinketToCoinFactory = (item : GameItem) : GameItem => {
    const amount = (item.Amount)? item.Amount : 0
    return genericCoinFactory(amount, item.Value, "Earned from selling " + item.Name)
}

export namespace ItemData {
    // --- Item Definitions ---
    // Items are grouped by what they *are* (their ItemTypes category), not by which race or job
    // hands them out — the selection packages below do the handing out. Anything that the rules
    // describe as several things ("crossbow and bolts", "toolbox containing…") is defined here as
    // several items and listed side by side in the package that grants it.

    // ── Melee weapons ─────────────────────────────────────────────────────────
    export const UtilityKnife = createMeleeWeapon("Knife", "Light", "1d2", {Range: "Nearby", Description: "Can be thrown."});
    export const Axe = createMeleeWeapon("Axe", "Simple", "1d6", {Range: "Nearby"});
    export const DaggerMelee = createMeleeWeapon("Dagger", "Light", "1d4", {Range: "Nearby"});
    export const HammerMelee = createMeleeWeapon("Hammer", "Simple", "1d6", {Range: "Nearby"});
    export const SpearMelee = createMeleeWeapon("Spear", "Simple", "1d6", {Range: "Nearby"});
    export const Staff = createMeleeWeapon("Staff", "Light", "1d4");
    export const Sword = createMeleeWeapon("Sword", "Simple", "1d6");
    export const SimpleSword = createMeleeWeapon("Sword", "Simple", "1d6");
    export const Warhammer = createMeleeWeapon("Warhammer", "Heavy", "1d8");
    export const BattleAxe = createMeleeWeapon("Battle Axe", "Heavy", "1d8");
    export const Dagger = createMeleeWeapon("Dagger", "Light", "1d4");
    export const SteelDagger = createMeleeWeapon("Steel Dagger", "Light", "1d4");
    export const NarrowDaggers = createMeleeWeapon("Narrow daggers", "Light", "1d4", {Amount: 2, Range: "Nearby", Description: "Concealed."});
    export const Hammer = createMeleeWeapon("Small Hammer", "Light", "1d4", {Value: 2, Description: "Worth 2 coins each"});
    export const MasonHammer = createMeleeWeapon("Hammer", "Light", "1d4");
    export const Mallet = createMeleeWeapon("Mallet", "Light", "1d4");
    export const Adze = createMeleeWeapon("Adze", "Light", "1d4");
    export const WideAx = createMeleeWeapon("Wide Bladed Ax", "Light", "1d4");
    export const WalkingStick = createMeleeWeapon("Walking stick", "Light", "1d4");
    export const YewStaff = createMeleeWeapon("Carved Yew Staff", "Simple", "1d4");
    export const BarbSword = createMeleeWeapon("Sword", "Simple", "1d6");
    export const BarbAxe = createMeleeWeapon("Axe", "Simple", "1d6");
    export const BarbMace = createMeleeWeapon("Mace or Hammer", "Simple", "1d6");
    export const BarbGreatSword = createMeleeWeapon("Great Sword", "Heavy", "1d6", {Description: "1d8 damage if you have Armaments"});
    export const SwordsmithWeapon = createMeleeWeapon("Simple or Heavy Melee Weapon", "Simple or Heavy", "1d6", {Description: "Typically a sword (1d6) or great sword (1d8 if proficient)"});
    export const BrassKnuckles = createMeleeWeapon("Brass Knuckles", "Light", "1d2", {Description: "+1 damage (1d4+1 with Brawler)"});
    export const Sap = createMeleeWeapon("Sap", "Simple", "1d4", {Description: "Potential for knockout."});
    export const JesterClub = createMeleeWeapon("Jester's club", "Light", "1d4", {Description: "Decorated with bells"});
    export const JugglingClubs = createMeleeWeapon("Juggling clubs", "Light", "1d4", {Amount: 5, Range: "Nearby"});
    export const SpikedMaceHoly = createMeleeWeapon("Spiked Mace", "Simple", "1d6", {Description: "Dispenses holy water (Ud4, 1d4 damage)."});
    export const SpearLance = createMeleeWeapon("Spear/Light Lance", "Light", "1d6");

    // ── Ranged weapons ────────────────────────────────────────────────────────
    // A ChoiceGroup grants exactly one object, so "crossbow and bolts" is one ranged weapon
    // carrying its ammunition count rather than two separately selectable items.
    export const CrossbowWithBolts = createRangedWeapon("Crossbow", "Simple", "1d6", "Nearby", DiceRoll.eightSidedDieRoll(), {AmmoType: "bolts"});
    export const ShortBowWithArrows = createRangedWeapon("Short Bow", "Simple", "1d6", "Nearby", DiceRoll.eightSidedDieRoll(), {AmmoType: "arrows"});
    export const SlingWithStones = createRangedWeapon("Sling", "Light", "1d4", "Nearby", DiceRoll.eightSidedDieRoll(), {AmmoType: "stones"});
    export const Javelins = createRangedWeapon("Javelin", "Light", "1d4", "Nearby", 0, {Amount: DiceRoll.eightSidedDieRoll()});
    export const Crossbow = createRangedWeapon("Crossbow", "Simple", "1d6", "Nearby", 0);

    // ── Ammunition ────────────────────────────────────────────────────────────
    export const Bolts = createAmmoItem("Bolts", "Crossbow", "1d6", {Amount: DiceRoll.sixSidedDieRoll()});
    export const WagonBolts = createAmmoItem("Crossbow bolts", "Crossbow", "1d6", {Amount: DiceRoll.sixSidedDieRoll(), Description: "Usage Die: Ud6"});

    // ── Armor & shields ───────────────────────────────────────────────────────
    export const OrcArmor = createArmorItem("Light Armor", "Light Armor", {Description: "Made of hides and piecemeal metal and leather armor salvaged parts."});
    export const FurArmor = createArmorItem("Layers of smelly furs with sewn on bones", "Light Armor", {UsageDie: "Ud6"});
    export const LeatherArmorRoll = createArmorItem("Leather Armor", "Light Armor", {UsageDie: "Ud4", Amount: DiceRoll.fourSidedDieRoll()});
    export const ChainMailArmor = createArmorItem("Chain Mail or Scale Mail Armor", "Medium Armor", {UsageDie: "Ud6"});
    export const Gambeson = createArmorItem("Leather Gambeson", "Light Armor", {UsageDie: "Ud4"});
    export const SmallShield = createArmorItem("Small Shield", "Small Shield", {UsageDie: "Ud4", Limit: "1 attack/Round"});

    // ── Worn (non-armor) ──────────────────────────────────────────────────────
    export const TravelingClothes = createWearableItem("Traveling clothes", {Description: "1 pair of long pants, 1 shirt, and 1 undergarment"});
    export const LeatherBelt = createWearableItem("Leather belt", {Description: "Metal buckle"});
    export const LeatherBoots = createWearableItem("Leather boots", {Description: "Below the knee"});
    export const HoodedCloak = createWearableItem("Hooded cloak");
    export const CloakAndHat = createWearableItem("Cloak and Hat");
    export const Apron = createWearableItem("Sturdy leather work apron");
    export const LeatherGloves = createWearableItem("Pair of leather gloves");
    export const Handkerchief = createWearableItem("Pocket handkerchief");
    export const RaggedClothes = createWearableItem("Ragged and dirty shirt and pants");
    export const ScoundrelCloak = createWearableItem("Gray or neutral colored cloak", {Description: "Has long sleeves for concealing items."});
    export const CoarseRobe = createWearableItem("Coarse spun robe");
    export const RopeBelt = createWearableItem("Rope belt");
    export const Sandals = createWearableItem("Sandals");
    export const FancyClothes = createWearableItem("Set of fancy clothes");
    export const BlackClothing = createWearableItem("Set of black clothing");
    export const FormalWearOutfit = createWearableItem("Formal Wear Outfit", {Description: "Shirt, vest, trousers, stockings, hat, belt, and shoes"});
    export const PerformanceOutfit = createWearableItem("Performance outfit", {Description: "Bright and decorative with bells, sequins, or tassels"});
    export const InquisitorGarb = createWearableItem("Inquisitor Garb", {Description: "Special robe and exotic hat."});
    export const FlashyCape = createWearableItem("Flashy Cape");
    export const ThighBoots = createWearableItem("Thigh-high Leather Boots");
    export const SilkScarf = createWearableItem("Silk Scarf", {Description: "Protection from chemical inhalation."});
    export const EyeGoggles = createWearableItem("Glass-lensed Eye Goggles");

    // ── Provisions ────────────────────────────────────────────────────────────
    export const StandardRations = createRationItem("Rations", DiceRoll.fourSidedDieRoll());
    export const ElfRations = createRationItem("Rations", 1, {Description: "Bread and wax wrapped honeycomb (replaces standard rations)"});
    export const Cheese = createRationItem("Hard cheese", 1);
    export const Bread = createRationItem("Bread", 2);
    export const DriedMeat = createRationItem("Dried meat", 1);
    export const Water = createConsumableItem("Wineskin", {Amount: DiceRoll.fourSidedDieRoll(), Description: "Filled with water"});
    export const Wine = createConsumableItem("Flask of Wine");
    export const WateredWine = createConsumableItem("Flask of watered down wine");
    export const Whiskey = createConsumableItem("Flask of whiskey");
    export const BerryWine = createConsumableItem("Flask of berry wine");
    export const DarkBeer = createConsumableItem("Flask of Dark Beer");
    export const Mushrooms = createConsumableItem("Mushrooms", {Amount: DiceRoll.sixSidedDieRoll(), Description: "Mind altering substance for Berserk Frenzy"});
    export const SpecialLeaves = createConsumableItem("Special leaves", {Amount: DiceRoll.sixSidedDieRoll(), Description: "Mind altering substance for Berserk Frenzy"});
    export const Grain = createConsumableItem("Sack of grain", {Amount: DiceRoll.fourSidedDieRoll()});
    export const FamiliarFeed = createConsumableItem("Small sack of feed", {Amount: DiceRoll.sixSidedDieRoll()});
    export const Candles = createConsumableItem("Candles", {Amount: DiceRoll.sixSidedDieRoll(), Description: "Usage Die: Ud6"});
    export const FlashPowder = createConsumableItem("Flash Powder", {Description: "Usage Die: Ud4."});
    export const TestingAgents = createConsumableItem("Testing agents", {Description: "Usage Die: Ud8."});

    // ── Wealth ────────────────────────────────────────────────────────────────
    export const Coins = createWealthItem("Coins", "Coin", 1, {Amount: 3 * DiceRoll.sixSidedDieRoll(), Description: "Coins in leather belt pouch, holding a max of 80 coins (4 lbs)"});
    export const Gems = createWealthItem("Gems", "Gem", 2, {Amount: DiceRoll.sixSidedDieRoll()});
    export const Teeth = createWealthItem("Teeth (Orcish currency)", "Tooth", 0.5, {Amount: 4 * DiceRoll.sixSidedDieRoll(), Description: "Equivalent to 1 coin per 2 teeth"});
    export const Ring = createWealthItem("Ring", "Jewelry", 10);
    export const Bracelet = createWealthItem("Bracelet", "Jewelry", 10);
    export const Necklace = createWealthItem("Chain necklace", "Jewelry", 10);
    export const Pendant = createWealthItem("Pendant", "Jewelry", 10);
    export const Baubles = createWealthItem("Baubles and miscellaneous small equipment", "Bauble", 1, {Amount: 40});
    export const EmergencyFund = createWealthItem("Emergency Fund", "Coin", 1, {Amount: 20, Description: "20 additional starting coins."});

    // ── Containers ────────────────────────────────────────────────────────────
    export const Sack = createContainerItem("Sack", ["15 lbs", "300 coins"]);
    export const BeltPouch = createContainerItem("Large leather belt pouch", []);
    export const LinenHaversack = createContainerItem("Woven linen haversack", []);
    export const LeatherHaversack = createContainerItem("Leather haversack", []);
    export const CourierSatchel = createContainerItem("Fine tooled leather courier satchel", []);
    export const Satchel = createContainerItem("Satchel", []);
    export const InstrumentCase = createContainerItem("Leather instrument case", []);
    export const MerchantBackpack = createContainerItem("Double capacity backpack", ["60 lbs", "1200 coins"]);
    export const ToolChest = createContainerItem("Small tool chest", []);
    export const BowfletToolChest = createContainerItem("Small tool chest", []);
    export const SmithToolbox = createContainerItem("Wooden Toolbox", []);
    export const LeatherKit = createContainerItem("Small leather working tool kit", []);
    export const LabGlassware = createContainerItem("Wooden Case of Lab Glassware", []);
    export const ResearchTrunk = createContainerItem("Trunk of Research", [], {Description: "Contains books and notes."});
    export const PortableKennel = createContainerItem("Small portable kennel", [], {Description: "Suitable for your familiar"});
    export const Cage = createContainerItem("Cage", []);
    export const ShelterSack = createContainerItem("Large sack", []);
    export const DisguiseKit = createContainerItem("Disguise Kit", [], {Description: "Small chest with clothes, jewelry, wigs, and makeup"});

    // ── Rope & cordage ────────────────────────────────────────────────────────
    export const HempTwine = createRopeItem("Hemp twine", 10);
    export const Twine = createRopeItem("Twine", 3, {Description: "To keep your pants up."});
    export const FishingString = createRopeItem("Fine, strong string", 20);
    export const ShelterRope = createRopeItem("Rope", 20);
    export const GrapplingRope = createRopeItem("Light rope", 50);

    // ── Animals ───────────────────────────────────────────────────────────────
    export const RidingHorse = createAnimalItem("Riding Horse", {Description: "Quiet/mild-tempered or hot-blooded/aggressive"});
    export const Mule = createAnimalItem("Old Gentle Mule");
    export const Ponies = createAnimalItem("Mild tempered pony", {Amount: 2});
    export const ViciousDog = createAnimalItem("Small, Vicious Dog", {Description: "Obeys simple, one word commands."});
    export const HerderDog = createAnimalItem("Small, loyal dog", {Description: "Obeys one word commands."});
    export const Familiars = [
        createAnimalItem("Familiar: Bat"), createAnimalItem("Familiar: Black Cat"),
        createAnimalItem("Familiar: Rat"), createAnimalItem("Familiar: Raven"),
        createAnimalItem("Familiar: Snake"), createAnimalItem("Familiar: Large Spider")
    ];

    // ── Transport ─────────────────────────────────────────────────────────────
    export const Saddle = createTransportItem("Saddle");
    export const Bridle = createTransportItem("Bridle");
    export const Saddlebags = createTransportItem("Saddlebags");
    export const Cart = createTransportItem("Rickety, two wheeled cart");
    export const OpenWagon = createTransportItem("Open Wagon");
    export const SmallVessel = createTransportItem("Small fishing vessel", {Description: "Suitable for rivers and coasts"});

    // ── Tools & kit ───────────────────────────────────────────────────────────
    export const Whetstone = createToolItem("Whetstone");
    export const Nails = createToolItem("Iron nails", {Amount: 48});
    export const IronSpikes = createToolItem("Iron Spikes", {Amount: DiceRoll.eightSidedDieRoll()});
    export const Files = createToolItem("Small files");
    export const Saw = createToolItem("Jeweler's saw");
    export const Loupe = createToolItem("Jeweler's loupe");
    export const Pliers = createToolItem("Pliers");
    export const FineWoodShavers = createToolItem("Fine wood shavers");
    export const HideGlue = createToolItem("Hide glue");
    export const Chisels = createToolItem("Chisels");
    export const Tongs = createToolItem("Tongs");
    export const WoodPlaner = createToolItem("Wood Planer");
    export const DrawKnife = createToolItem("Draw Knife");
    export const Dividers = createToolItem("Adjustable Dividers");
    export const Level = createToolItem("Level");
    export const Trowel = createToolItem("Trowel");
    export const MasonTrowel = createToolItem("Mason's trowel");
    export const Scissors = createToolItem("Scissors");
    export const Padlock = createToolItem("Padlock with key");
    export const LockPicks = createToolItem("Lock Picks");
    export const Crowbar = createToolItem("Crowbar");
    export const GrapplingHook = createToolItem("Grappling Hook", {Description: "Includes 50' of light rope."});
    export const Punches = createToolItem("Leather punches");
    export const Awls = createToolItem("Awls");
    export const Cutters = createToolItem("Cutters");
    export const TannedLeather = createToolItem("Roll of tanned leather");
    export const Stakes = createToolItem("Stakes", {Amount: 12});
    export const Canvas = createToolItem("Water resistant canvas", {Description: "15' x 15'"});
    export const Kettles = createToolItem("Brewing kettles");
    export const FermentationJars = createToolItem("Fermentation jars");
    export const VintnerTools = createToolItem("Winemaking equipment");
    export const HerbalistKit = createToolItem("Herbalist kit", {Description: "Pouches and shears for harvesting"});
    export const ChefKnives = createToolItem("Set of knives");
    export const CuttingBoard = createToolItem("Cutting board");
    export const MortarPestle = createToolItem("Mortar & Pestle");
    export const Reagents = createToolItem("Small kit of reagents");
    export const BrassHooks = createToolItem("Brass hooks", {Amount: DiceRoll.sixSidedDieRoll()});
    export const RatTraps = createToolItem("Rat Traps");
    export const Abacus = createToolItem("Abacus");
    export const LeadStylus = createToolItem("Lead stylus");
    export const Ledger = createToolItem("Bound ledger");
    export const Ink = createToolItem("Bottle of ink");
    export const Quill = createToolItem("Quill");
    export const Paper = createToolItem("Paper");
    export const AlchemyJournal = createToolItem("Leather-bound Alchemical Journal", {Description: "Partially filled with formulae."});
    export const ArcaneResearchBook = createToolItem("Arcane Research Book");
    export const PsalmBook = createToolItem("Book of psalms/prayers");
    export const ForbiddenBook = createToolItem("Forbidden book of profane prayers");
    export const StrangeBooks = createToolItem("Books of strange theories");
    export const ArcaneTrinkets = createToolItem("Collection of arcane trinkets");
    export const PrayerMat = createToolItem("Prayer mat");
    export const PrayerBeads = createToolItem("Prayer Beads");
    export const HolySymbol = createToolItem("Holy Symbol");
    export const VariantHolySymbol = createToolItem("Variant Holy Symbol", {Description: "An older or sectarian version of a holy symbol."});
    export const UnholySymbol = createToolItem("Unholy symbol");
    export const DivinationKit = createToolItem("Divination Kit", {Description: "Dice, cards, small bones, or sticks."});
    export const DivinationCards = createToolItem("Divination Cards");
    export const DecoratedWand = createToolItem("Decorated Wand");
    export const CopperDowsingRods = createToolItem("Copper Dowsing Rods");
    export const BadgeOfOffice = createToolItem("Badge of Office");
    export const Banner = createToolItem("Detachable banner");
    export const FacePaint = createToolItem("Face paint");
    export const SharpStones = createToolItem("Sharp stones");
    export const ClayPipe = createToolItem("Clay pipe");
    export const TobaccoPouch = createToolItem("Tobacco pouch");
    export const Shackles = createToolItem("Open wooden pillory or pair of iron shackles with chain", {Description: "About 12 inches of chain."});
    export const Dice = createToolItem("Dice");
    export const PlayingCards = createToolItem("Deck of cards");
    export const ThimblerigSet = createToolItem("Thimblerig set");

    // ── Trinkets ──────────────────────────────────────────────────────────────
    // Trinkets keep their `Value`: a character may sell one for that many coins instead of
    // taking it (see getTrinketPackage / TrinketToCoinFactory).
    export const BlackArrow = createAmmoItem("Arrow, Black", "Bow", "1d6", {Value: 5, Description: "At the end of the Encounter, you can always find it within 1d6 turns if you search."});
    export const LuckyCopperCoin = createBaseItem("Coin, Lucky Copper", {Value: 5, Description: "It always lands on your mental choice of heads or tails."});
    export const GlowingCrystal = createBaseItem("Crystal, glowing", {Value: 20, Description: "This palm sized crystal emits a bluish light continually and can illuminate an area Close when uncovered. The light it emits is unaffected by the Darkness spell."});
    export const CurvedDagger = createMeleeWeapon("Dagger, curved", "Light", "1d4", {Value: 40, Description: "It has 4 gems worth 10 coins each. If removed, a new gem will take its place after one week."});
    export const BountifulFlask = createConsumableItem("Flask, Bountiful", {Value: 15, Description: "This copper flask continually refills and always has enough water for two people per day. If a bottle of wine is added it will refill with wine for a week."});
    export const GlassMarbles = createBaseItem("Glass Marbles, dozen", {Value: 5, Description: "You can cast marbles as a Standard Action to an area Close. Creatures that move through them must pass a DEX Test or be Down. Marbles Nearby return to their pouch if you hold it open on the ground and concentrate for one minute."});
    export const SilentHammer = createMeleeWeapon("Silent Hammer", "Simple", "1d6", {Value: 10, Range: "Nearby", Description: "This work hammer has a head made of an unusual, dark black metal. It makes no sound when hammering nails, spikes, or chisels."});
    export const SkeletonKey = createToolItem("Key, Skeleton", {Value: 20, Description: "This key has a 1 in 4 chance to work on any mundane lock. A failed attempt can be tried again on the same lock the following day."});
    export const FoldingKnife = createMeleeWeapon("Knife with folding blade", "Light", "1d2", {Value: 10, Range: "Nearby", Description: "This knife is small and easy to conceal. The blade never dulls and will not break with a Critical Failure. Can also be thrown."});
    export const FishCharmNecklace = createWearableItem("Leather Necklace with Lucky Fish Charm", {Value: 5, Description: "This charm gives you Advantage on your INT Test when fishing or Foraging at a shoreline to increase your rations."});
    export const LuckyDice = createBaseItem("Lucky Dice, pair", {Value: 5, Description: "In dice games, once per day you can reroll and take the better result."});
    export const Lodestone = createBaseItem("Lodestone on a leather thong", {Value: 10, Description: "The lodestone points north by default but can be attuned to another target you can touch and concentrate on for one minute."});
    export const FloralPerfume = createConsumableItem("Perfume, Floral (Ud4)", {Value: 5, Description: "When perfume from this vial is applied, you have Advantage on CHA Tests when seeking information or asking for favors. Each application lasts 1 hour."});
    export const InsectRing = createWearableItem("Ring, silver with insect motif", {Value: 10, Description: "When you wear this ring, insects avoid you. Any insect type creature must pass a WIS Test to attack you."});
    export const SpiderSilkRope = createRopeItem("Rope, spider silk rope", 100, {Value: 15, Description: "This thin rope can hold the weight of approximately six human-sized beings (1200 lbs). It also never tangles. It takes 8 hp of damage to break/sever."});
    export const RosewoodFlute = createBaseItem("Rosewood flute", {Value: 10, Description: "Once per day, when you play this flute as a Standard Action, the GM will reroll on the NPC Reaction Table if you ask."});
    export const MagicSatchel = createContainerItem("Satchel, tooled leather with shoulder strap and silver buckle", ["60 lbs", "1200 coins"], {Value: 20, Description: "This small satchel has twice the capacity of a backpack but never weighs more than 10 pounds. What is put in the satchel is limited by the size of its mouth (12\" diameter). Living creatures cannot survive in the satchel over 24 hours if it is closed."});
    export const SneezingPowder = createConsumableItem("Sneezing powder, packets (Ud6)", {Value: 10, Description: "As a Reaction to an opponent being Close, you can blow this powder in their face. If the target fails a CON Ability Test, they will sneeze uncontrollably and have Disadvantage on any Actions until the beginning of your next turn. The powder cannot be used in windy conditions."});
    export const SpringBladeStaff = createMeleeWeapon("Staff, Walking with concealed spring blade", "Simple", "1d6", {Value: 10, Range: "Nearby", Description: "This walking staff has a concealed spring blade allowing it to be used as a spear."});
    export const JadeMonkeyStatuette = createBaseItem("Lucky Statuette Jade Monkey", {Value: 10, Description: "While held, this palm sized statuette gives you Advantage on one INT Ability Test per day."});

    export const basicTrinketSection : GameItem[] = [
        BlackArrow, LuckyCopperCoin, GlowingCrystal, CurvedDagger, BountifulFlask,
        GlassMarbles, SilentHammer, SkeletonKey, FoldingKnife, FishCharmNecklace,
        LuckyDice, Lodestone, FloralPerfume, InsectRing, SpiderSilkRope,
        RosewoodFlute, MagicSatchel, SneezingPowder, SpringBladeStaff, JadeMonkeyStatuette
    ]

    const none = new SelectionPackage<GameItem>([], [], [])


    // --- Selection Packages ---

    export const DwarfItemSelection = new SelectionPackage<GameItem>(
        [Apron, Nails, Hammer, Whiskey, Gems], [],
        []
    );

    export const ElfItemSelection = new SelectionPackage<GameItem>(
        [LinenHaversack, ElfRations, Wine], [],
        [StandardRations, Water]
    );

    export const HumanItemSelection = new SelectionPackage<GameItem>(
        [LinenHaversack, WateredWine], [],
        [Water]
    );

    export const HalflingItemSelection = new SelectionPackage<GameItem>(
        [ClayPipe, TobaccoPouch, WalkingStick, Handkerchief, Cheese, Bread, DriedMeat], [new ChoiceGroup(1, [BerryWine, DarkBeer], [])],
        [StandardRations, Water]
    );

    export const OrcItemSelection = new SelectionPackage<GameItem>(
        [OrcArmor, Dagger, BeltPouch, Whetstone, Teeth], [],
        []
    );

    export const IxianItemSelection = new SelectionPackage<GameItem>(
        [LeatherHaversack, LeatherGloves], [],
        []
    );

    export const JewelerItemSelection = new SelectionPackage<GameItem>(
        [Satchel, Loupe, Files, Saw],
        [new ChoiceGroup(1, [Ring, Bracelet, Necklace, Pendant], [])],
        []
    );

    export const BarbarianItemSelection = new SelectionPackage<GameItem>(
        [FurArmor, BeltPouch, FacePaint, SharpStones],
        [
            new ChoiceGroup(1, [Mushrooms, SpecialLeaves], []),
            new ChoiceGroup(1, [BarbSword, BarbAxe, BarbMace, BarbGreatSword], [])
        ],
        []
    );

    // The smith's toolbox and its contents, granted together wherever a smithing kit is issued.
    const smithKit = [SmithToolbox, MasonHammer, Chisels, Files, Tongs, LeatherGloves, Apron]

    // --- The Starting Selection Package ---
    // This represents the "Universal" gear every character starts with
    export const UniversalStartingGear = new SelectionPackage<GameItem>(
        [
            TravelingClothes,
            LeatherBelt,
            LeatherBoots,
            UtilityKnife,
            Sack,
            HempTwine,
            Coins,
            StandardRations,
            Water
        ],
        [
            // Choice 1: The Cloak Style
            new ChoiceGroup(1, [HoodedCloak, CloakAndHat], []),

            // Choice 2: The Weapon Category (Melee vs Ranged)
            // Note: Since ChoiceGroup usually picks from a flat list,
            // you might handle the 1-3 vs 4-6 roll in your logic
            // by presenting this group:
            new ChoiceGroup(1, [
                // Melee Sub-options
                Axe, DaggerMelee, HammerMelee, SpearMelee, Staff, Sword,
                // Ranged Sub-options
                CrossbowWithBolts, Javelins, ShortBowWithArrows, SlingWithStones
            ], [])
        ],
        []
    );

    // --- Trinket Selection Package ---
    export function getTrinketPackage(race: RaceType, job: JobType, jobSubset: JobSubset): SelectionPackage<GameItem> {
        const shuffled = Utility.shuffle(basicTrinketSection.map(x => x))
        const isHuman = race === "Human"

        if (jobSubset === JobSubsetEnum.ThreeTrinketRandom) {
            return new SelectionPackage<GameItem>([], [
                new ChoiceGroup(1, isHuman
                    ? [shuffled[0], shuffled[3], TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(shuffled[3])]
                    : [shuffled[0], TrinketToCoinFactory(shuffled[0])], []),
                new ChoiceGroup(1, isHuman
                    ? [shuffled[1], shuffled[4], TrinketToCoinFactory(shuffled[1]), TrinketToCoinFactory(shuffled[4])]
                    : [shuffled[1], TrinketToCoinFactory(shuffled[1])], []),
                new ChoiceGroup(1, isHuman
                    ? [shuffled[2], shuffled[5], TrinketToCoinFactory(shuffled[2]), TrinketToCoinFactory(shuffled[5])]
                    : [shuffled[2], TrinketToCoinFactory(shuffled[2])], []),
            ], [])
        }

        if (jobSubset === JobSubsetEnum.OneTrinketChoice) {
            return new SelectionPackage<GameItem>([], [
                new ChoiceGroup(1, basicTrinketSection, [])
            ], [])
        }

        if (job === "Dowser") {
            return new SelectionPackage<GameItem>([], [
                new ChoiceGroup(1, isHuman
                    ? [shuffled[0], shuffled[1], Lodestone, TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(shuffled[1]), TrinketToCoinFactory(Lodestone)]
                    : [shuffled[0], Lodestone, TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(Lodestone)], [])
            ], [])
        }

        if (isHuman) {
            return new SelectionPackage<GameItem>([], [
                new ChoiceGroup(1, [shuffled[0], shuffled[1], TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(shuffled[1])], [])
            ], [])
        }

        return new SelectionPackage<GameItem>([], [
            new ChoiceGroup(1, [shuffled[0], TrinketToCoinFactory(shuffled[0])], [])
        ], [])
    }

    // --- Records ---

    export const RaceRecord : Record<RaceType, SelectionPackage<GameItem>> = {
        Dwarf: DwarfItemSelection,
        Elf: ElfItemSelection,
        Orc: OrcItemSelection,
        Ixian: IxianItemSelection,
        Human: HumanItemSelection,
        Halfling: HalflingItemSelection
    };

    export const JobTypeToItem : Record<JobType, SelectionPackage<GameItem>> = {
        "Apprentice Artisan": none,
        "Apprentice Bureaucrat": new SelectionPackage<GameItem>([Ink, Quill, Paper, CourierSatchel], [], []),
        "Free Laborer": new SelectionPackage<GameItem>([RidingHorse, Saddle, Bridle, Saddlebags, Grain], [], []),
        "Apprentice Crafter": new SelectionPackage<GameItem>([...smithKit, SteelDagger], [], []),
        "Apprentice Mercantiler": new SelectionPackage<GameItem>([FancyClothes, Satchel, Abacus, LeadStylus, Ledger], [], []),
        "Escaped Peasant/Thrall": new SelectionPackage<GameItem>([RaggedClothes, Twine, Shackles], [], [TravelingClothes, LeatherBelt, LeatherBoots, UtilityKnife, Sack, HempTwine, Coins, StandardRations, Water, HoodedCloak, CloakAndHat]),
        Acrobat: new SelectionPackage<GameItem>([PerformanceOutfit, JugglingClubs], [], []),
        Contortionist: new SelectionPackage<GameItem>([PerformanceOutfit, JugglingClubs], [], []),
        Jester: new SelectionPackage<GameItem>([PerformanceOutfit, JesterClub], [], []),
        Minstrel: new SelectionPackage<GameItem>([PerformanceOutfit, InstrumentCase], [new ChoiceGroup(1, [RosewoodFlute], [])], []),
        "Storyteller/Thespian": new SelectionPackage<GameItem>([PerformanceOutfit], [new ChoiceGroup(1, [DisguiseKit], [])], []),
        Accursed: new SelectionPackage<GameItem>([ArcaneTrinkets, StrangeBooks], [], []),
        Acolyte: new SelectionPackage<GameItem>([PrayerMat, Candles, PsalmBook, CoarseRobe, RopeBelt, Sandals], [],
            [TravelingClothes, LeatherBelt, LeatherBoots]),
        Cultist: new SelectionPackage<GameItem>([PrayerMat, Candles, ForbiddenBook, UnholySymbol, CoarseRobe, RopeBelt, Sandals], [],
            [TravelingClothes, LeatherBelt, LeatherBoots]),
        Inquisitor: new SelectionPackage<GameItem>([InquisitorGarb, HolySymbol, SpikedMaceHoly], [], []),

        Pariah: new SelectionPackage<GameItem>([PrayerMat, Candles, HolySymbol, PsalmBook, DivinationKit], [],
            [TravelingClothes, LeatherBelt, LeatherBoots]),

        "Touched/Anchorite": new SelectionPackage<GameItem>([PrayerMat, Candles, HolySymbol, PrayerBeads], [],
            [TravelingClothes, LeatherBelt, LeatherBoots]),

        Armiger: new SelectionPackage<GameItem>([RidingHorse, Saddle, Saddlebags, Grain, SpearLance, Banner],
            [
                new ChoiceGroup(1, [Gambeson, SmallShield], []),
                new ChoiceGroup(1, [Sword, Axe, BarbMace, BarbGreatSword, Warhammer, BattleAxe], [])
            ], []),

        Barbarian: BarbarianItemSelection,

        "Mercenary/Hedge": new SelectionPackage<GameItem>([],
            [
                new ChoiceGroup(1, [Gambeson, SmallShield], []),
                new ChoiceGroup(1, [Sword, Axe, BarbMace, BarbGreatSword, Warhammer, BattleAxe], [])
            ], []),

        Prizefighter: new SelectionPackage<GameItem>([BrassKnuckles], [], []),

        "Ruffian/Enforcer": new SelectionPackage<GameItem>([], [new ChoiceGroup(1, [BrassKnuckles, Sap], [])], []),

        "Woodard/Warden": new SelectionPackage<GameItem>([ShelterSack, ShelterRope, Stakes, Canvas], [], []),

        "Adept/Arcane Apprentice": new SelectionPackage<GameItem>([ResearchTrunk, YewStaff], [], []),

        "Alchemy Apprentice": new SelectionPackage<GameItem>([Ink, Quill, AlchemyJournal, EyeGoggles, SilkScarf, LabGlassware, TestingAgents], [], []),

        "Arcane Researcher": new SelectionPackage<GameItem>([Ink, Quill, ArcaneResearchBook], [], []),

        Charlatan: new SelectionPackage<GameItem>([FlashyCape, ThighBoots, DecoratedWand, DivinationCards, FlashPowder], [], []),

        Dowser: new SelectionPackage<GameItem>([CopperDowsingRods], [], []),

        Warlock: new SelectionPackage<GameItem>([BlackClothing, PortableKennel, FamiliarFeed], [new ChoiceGroup(1, Familiars, [])], []),

        Fence: new SelectionPackage<GameItem>([Satchel, Abacus, LeadStylus, Ledger, EmergencyFund], [], []),

        Gambler: new SelectionPackage<GameItem>([Dice, PlayingCards, ThimblerigSet], [], []),

        Scoundrel: new SelectionPackage<GameItem>([ScoundrelCloak, NarrowDaggers], [], []),

        Sharp: new SelectionPackage<GameItem>([TravelingClothes, NarrowDaggers], [], []),

        Spy: new SelectionPackage<GameItem>([HoodedCloak], [new ChoiceGroup(1, [DisguiseKit, LockPicks, Crowbar, GrapplingHook], [])], []),

        "Street Urchin": new SelectionPackage<GameItem>([], [], [LeatherBoots, HoodedCloak, CloakAndHat, Coins]),

        Scholar: new SelectionPackage<GameItem>([Ink, Quill, Paper, CourierSatchel], [], [])
    }

    export const JobSubsetToItem : Record<JobSubsetEnum, SelectionPackage<GameItem>> = {
        [JobSubsetEnum.None]: none,
        [JobSubsetEnum.Jeweler]: JewelerItemSelection,
        [JobSubsetEnum.Arbalist]: new SelectionPackage<GameItem>([ToolChest, Pliers, Files, FineWoodShavers, Crossbow, Bolts], [], []),
        [JobSubsetEnum.Scrivener]: new SelectionPackage<GameItem>([Ink, Quill, Paper, CourierSatchel], [], []),
        [JobSubsetEnum.Advocate]: none,
        [JobSubsetEnum.Cartographer]: none,
        [JobSubsetEnum.Inspector]: new SelectionPackage<GameItem>([SimpleSword, BadgeOfOffice], [], []),
        [JobSubsetEnum.Interpreter]: none,
        [JobSubsetEnum.Smith]: new SelectionPackage<GameItem>([...smithKit, SteelDagger], [], []),
        [JobSubsetEnum.Carpenter]: new SelectionPackage<GameItem>([Mallet, Adze, WoodPlaner, Level], [], []),
        [JobSubsetEnum.MoneyChanger]: new SelectionPackage<GameItem>([FancyClothes, Abacus, LeadStylus, Ledger], [], []),
        [JobSubsetEnum.Ambler]: new SelectionPackage<GameItem>([RidingHorse, Saddle, Bridle, Saddlebags, Grain], [], []),
        [JobSubsetEnum.Chef]: new SelectionPackage<GameItem>([ChefKnives, CuttingBoard, MortarPestle], [], []),

        // Laborer & Service Subsets
        [JobSubsetEnum.HouseServant]: none,
        [JobSubsetEnum.Farmhand]: none,
        [JobSubsetEnum.Laborer]: none,
        [JobSubsetEnum.Sailor]: none,
        [JobSubsetEnum.Brewer]: new SelectionPackage<GameItem>([Kettles, FermentationJars], [], []),
        [JobSubsetEnum.Farmer]: none, // Description mentions knowledge/skills but no specific gear
        [JobSubsetEnum.Herder]: new SelectionPackage<GameItem>([HerderDog], [], []),
        [JobSubsetEnum.Vintner]: new SelectionPackage<GameItem>([VintnerTools], [], []),

        [JobSubsetEnum.Oratory]: none,
        [JobSubsetEnum.Theology]: new SelectionPackage<GameItem>([PsalmBook], [], []),
        [JobSubsetEnum.Esoterica]: new SelectionPackage<GameItem>([ArcaneTrinkets, StrangeBooks], [], []),

        // Martial & Backstory Subsets
        [JobSubsetEnum.ActiveService]: none,
        [JobSubsetEnum.Freelance]: none,
        [JobSubsetEnum.LordSlain]: none,
        [JobSubsetEnum.Disgraced]: none,
        [JobSubsetEnum.HedgeKnight]: new SelectionPackage<GameItem>([Gambeson, SmallShield, Sword], [], []),
        [JobSubsetEnum.Mercenary]: new SelectionPackage<GameItem>([Gambeson, Sword], [], []),
        [JobSubsetEnum.Bandit]: new SelectionPackage<GameItem>([Gambeson, Sword], [], []),
        [JobSubsetEnum.Discharged]: none,

        // High Arcane / Ixian Subsets (No gear specified in text)
        [JobSubsetEnum.IxianRaver]: none,
        [JobSubsetEnum.IxianArchon]: none,
        [JobSubsetEnum.Dragon]: none,
        [JobSubsetEnum.Lich]: none,
        [JobSubsetEnum.Wizard]: none,
        [JobSubsetEnum.ElderGod]: none,
        [JobSubsetEnum.Moloch]: none,
        [JobSubsetEnum.Kain]: none,

        // Rogue Specializations (Often conditional, but mapped to basic kits)
        [JobSubsetEnum.DisguiseSpecialist]: new SelectionPackage<GameItem>([DisguiseKit], [], []),
        [JobSubsetEnum.BurglarSpecialist]: new SelectionPackage<GameItem>([LockPicks, Crowbar, GrapplingHook, GrapplingRope], [], []),
        [JobSubsetEnum.ThreeTrinketRandom]: none,
        [JobSubsetEnum.OneTrinketChoice]: none,

        // Additional Artisan subsets
        [JobSubsetEnum.Armorer]:      new SelectionPackage<GameItem>([...smithKit, ChainMailArmor], [], []),
        [JobSubsetEnum.Bowyer]:       new SelectionPackage<GameItem>([BowfletToolChest, Files, FineWoodShavers, HideGlue, ShortBowWithArrows], [], []),
        [JobSubsetEnum.Fletcher]:     new SelectionPackage<GameItem>([BowfletToolChest, Files, FineWoodShavers, HideGlue, ShortBowWithArrows], [], []),
        [JobSubsetEnum.Tailor]:       new SelectionPackage<GameItem>([Apron, Scissors, FormalWearOutfit], [], []),
        [JobSubsetEnum.Locksmith]:    new SelectionPackage<GameItem>([Files, Saw, MasonHammer, Padlock, LockPicks], [], []),
        // Additional Crafter subsets
        [JobSubsetEnum.Cooper]:       new SelectionPackage<GameItem>([Mallet, WideAx, DrawKnife, Dividers, WoodPlaner, Cart, Mule], [], []),
        [JobSubsetEnum.Leatherworker]: new SelectionPackage<GameItem>([LeatherKit, Punches, Awls, Cutters, TannedLeather, LeatherArmorRoll], [], []),
        [JobSubsetEnum.Mason]:        new SelectionPackage<GameItem>([MasonHammer, IronSpikes, MasonTrowel, Level], [], []),
        [JobSubsetEnum.Swordsmith]:   new SelectionPackage<GameItem>([SwordsmithWeapon], [], []),
        // Additional Mercantiler subsets
        [JobSubsetEnum.Assayer]:      new SelectionPackage<GameItem>([MortarPestle, Reagents], [], []),
        [JobSubsetEnum.Herbalist]:    new SelectionPackage<GameItem>([HerbalistKit], [], []),
        [JobSubsetEnum.Peddler]:      new SelectionPackage<GameItem>([MerchantBackpack, Baubles], [], []),
        // Additional Laborer subsets
        [JobSubsetEnum.Fisher]:       new SelectionPackage<GameItem>([FishingString, BrassHooks], [], []),
        [JobSubsetEnum.Wagoner]:      new SelectionPackage<GameItem>([OpenWagon, Ponies, Crossbow, WagonBolts], [], []),
    };


}
