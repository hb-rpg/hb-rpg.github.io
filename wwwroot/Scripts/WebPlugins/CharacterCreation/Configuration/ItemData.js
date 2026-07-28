import { Utility } from "../../../WebCore/Utility.js";
import { JobSubsetEnum } from "../Contracts/StringTypes.js";
import { ChoiceGroup, SelectionPackage } from "../Contracts/TaggedData.js";
import { createAmmoItem, createAnimalItem, createArmorItem, createBaseItem, createConsumableItem, createContainerItem, createMeleeWeapon, createRangedWeapon, createRationItem, createRopeItem, createToolItem, createTransportItem, createWealthItem, createWearableItem } from "../Utility/BuildItems.js";
import { DiceRoll } from "../Utility/DiceRoll.js";
const genericCoinFactory = (amount, value, Description) => {
    return createWealthItem(`${value} Coins from selling trinket`, "Coin", value ?? 0, { Amount: amount, Value: value, Description });
};
const TrinketToCoinFactory = (item) => {
    const amount = (item.Amount) ? item.Amount : 0;
    return genericCoinFactory(amount, item.Value, "Earned from selling " + item.Name);
};
export var ItemData;
(function (ItemData) {
    // --- Item Definitions ---
    // Items are grouped by what they *are* (their ItemTypes category), not by which race or job
    // hands them out — the selection packages below do the handing out. Anything that the rules
    // describe as several things ("crossbow and bolts", "toolbox containing…") is defined here as
    // several items and listed side by side in the package that grants it.
    // ── Melee weapons ─────────────────────────────────────────────────────────
    ItemData.UtilityKnife = createMeleeWeapon("Knife", "Light", "1d2", { Range: "Nearby", Description: "Can be thrown." });
    ItemData.Axe = createMeleeWeapon("Axe", "Simple", "1d6", { Range: "Nearby" });
    ItemData.DaggerMelee = createMeleeWeapon("Dagger", "Light", "1d4", { Range: "Nearby" });
    ItemData.HammerMelee = createMeleeWeapon("Hammer", "Simple", "1d6", { Range: "Nearby" });
    ItemData.SpearMelee = createMeleeWeapon("Spear", "Simple", "1d6", { Range: "Nearby" });
    ItemData.Staff = createMeleeWeapon("Staff", "Light", "1d4");
    ItemData.Sword = createMeleeWeapon("Sword", "Simple", "1d6");
    ItemData.SimpleSword = createMeleeWeapon("Sword", "Simple", "1d6");
    ItemData.Warhammer = createMeleeWeapon("Warhammer", "Heavy", "1d8");
    ItemData.BattleAxe = createMeleeWeapon("Battle Axe", "Heavy", "1d8");
    ItemData.Dagger = createMeleeWeapon("Dagger", "Light", "1d4");
    ItemData.SteelDagger = createMeleeWeapon("Steel Dagger", "Light", "1d4");
    ItemData.NarrowDaggers = createMeleeWeapon("Narrow daggers", "Light", "1d4", { Amount: 2, Range: "Nearby", Description: "Concealed." });
    ItemData.Hammer = createMeleeWeapon("Small Hammer", "Light", "1d4", { Value: 2, Description: "Worth 2 coins each" });
    ItemData.MasonHammer = createMeleeWeapon("Hammer", "Light", "1d4");
    ItemData.Mallet = createMeleeWeapon("Mallet", "Light", "1d4");
    ItemData.Adze = createMeleeWeapon("Adze", "Light", "1d4");
    ItemData.WideAx = createMeleeWeapon("Wide Bladed Ax", "Light", "1d4");
    ItemData.WalkingStick = createMeleeWeapon("Walking stick", "Light", "1d4");
    ItemData.YewStaff = createMeleeWeapon("Carved Yew Staff", "Simple", "1d4");
    ItemData.BarbSword = createMeleeWeapon("Sword", "Simple", "1d6");
    ItemData.BarbAxe = createMeleeWeapon("Axe", "Simple", "1d6");
    ItemData.BarbMace = createMeleeWeapon("Mace or Hammer", "Simple", "1d6");
    ItemData.BarbGreatSword = createMeleeWeapon("Great Sword", "Heavy", "1d6", { Description: "1d8 damage if you have Armaments" });
    ItemData.SwordsmithWeapon = createMeleeWeapon("Simple or Heavy Melee Weapon", "Simple or Heavy", "1d6", { Description: "Typically a sword (1d6) or great sword (1d8 if proficient)" });
    ItemData.BrassKnuckles = createMeleeWeapon("Brass Knuckles", "Light", "1d2", { Description: "+1 damage (1d4+1 with Brawler)" });
    ItemData.Sap = createMeleeWeapon("Sap", "Simple", "1d4", { Description: "Potential for knockout." });
    ItemData.JesterClub = createMeleeWeapon("Jester's club", "Light", "1d4", { Description: "Decorated with bells" });
    ItemData.JugglingClubs = createMeleeWeapon("Juggling clubs", "Light", "1d4", { Amount: 5, Range: "Nearby" });
    ItemData.SpikedMaceHoly = createMeleeWeapon("Spiked Mace", "Simple", "1d6", { Description: "Dispenses holy water (Ud4, 1d4 damage)." });
    ItemData.SpearLance = createMeleeWeapon("Spear/Light Lance", "Light", "1d6");
    // ── Ranged weapons ────────────────────────────────────────────────────────
    // A ChoiceGroup grants exactly one object, so "crossbow and bolts" is one ranged weapon
    // carrying its ammunition count rather than two separately selectable items.
    ItemData.CrossbowWithBolts = createRangedWeapon("Crossbow", "Simple", "1d6", "Nearby", DiceRoll.eightSidedDieRoll(), { AmmoType: "bolts" });
    ItemData.ShortBowWithArrows = createRangedWeapon("Short Bow", "Simple", "1d6", "Nearby", DiceRoll.eightSidedDieRoll(), { AmmoType: "arrows" });
    ItemData.SlingWithStones = createRangedWeapon("Sling", "Light", "1d4", "Nearby", DiceRoll.eightSidedDieRoll(), { AmmoType: "stones" });
    ItemData.Javelins = createRangedWeapon("Javelin", "Light", "1d4", "Nearby", 0, { Amount: DiceRoll.eightSidedDieRoll() });
    ItemData.Crossbow = createRangedWeapon("Crossbow", "Simple", "1d6", "Nearby", 0);
    // ── Ammunition ────────────────────────────────────────────────────────────
    ItemData.Bolts = createAmmoItem("Bolts", "Crossbow", "1d6", { Amount: DiceRoll.sixSidedDieRoll() });
    ItemData.WagonBolts = createAmmoItem("Crossbow bolts", "Crossbow", "1d6", { Amount: DiceRoll.sixSidedDieRoll(), Description: "Usage Die: Ud6" });
    // ── Armor & shields ───────────────────────────────────────────────────────
    ItemData.OrcArmor = createArmorItem("Light Armor", "Light Armor", { Description: "Made of hides and piecemeal metal and leather armor salvaged parts." });
    ItemData.FurArmor = createArmorItem("Layers of smelly furs with sewn on bones", "Light Armor", { UsageDie: "Ud6" });
    ItemData.LeatherArmorRoll = createArmorItem("Leather Armor", "Light Armor", { UsageDie: "Ud4", Amount: DiceRoll.fourSidedDieRoll() });
    ItemData.ChainMailArmor = createArmorItem("Chain Mail or Scale Mail Armor", "Medium Armor", { UsageDie: "Ud6" });
    ItemData.Gambeson = createArmorItem("Leather Gambeson", "Light Armor", { UsageDie: "Ud4" });
    ItemData.SmallShield = createArmorItem("Small Shield", "Small Shield", { UsageDie: "Ud4", Limit: "1 attack/Round" });
    // ── Worn (non-armor) ──────────────────────────────────────────────────────
    ItemData.TravelingClothes = createWearableItem("Traveling clothes", { Description: "1 pair of long pants, 1 shirt, and 1 undergarment" });
    ItemData.LeatherBelt = createWearableItem("Leather belt", { Description: "Metal buckle" });
    ItemData.LeatherBoots = createWearableItem("Leather boots", { Description: "Below the knee" });
    ItemData.HoodedCloak = createWearableItem("Hooded cloak");
    ItemData.CloakAndHat = createWearableItem("Cloak and Hat");
    ItemData.Apron = createWearableItem("Sturdy leather work apron");
    ItemData.LeatherGloves = createWearableItem("Pair of leather gloves");
    ItemData.Handkerchief = createWearableItem("Pocket handkerchief");
    ItemData.RaggedClothes = createWearableItem("Ragged and dirty shirt and pants");
    ItemData.ScoundrelCloak = createWearableItem("Gray or neutral colored cloak", { Description: "Has long sleeves for concealing items." });
    ItemData.CoarseRobe = createWearableItem("Coarse spun robe");
    ItemData.RopeBelt = createWearableItem("Rope belt");
    ItemData.Sandals = createWearableItem("Sandals");
    ItemData.FancyClothes = createWearableItem("Set of fancy clothes");
    ItemData.BlackClothing = createWearableItem("Set of black clothing");
    ItemData.FormalWearOutfit = createWearableItem("Formal Wear Outfit", { Description: "Shirt, vest, trousers, stockings, hat, belt, and shoes" });
    ItemData.PerformanceOutfit = createWearableItem("Performance outfit", { Description: "Bright and decorative with bells, sequins, or tassels" });
    ItemData.InquisitorGarb = createWearableItem("Inquisitor Garb", { Description: "Special robe and exotic hat." });
    ItemData.FlashyCape = createWearableItem("Flashy Cape");
    ItemData.ThighBoots = createWearableItem("Thigh-high Leather Boots");
    ItemData.SilkScarf = createWearableItem("Silk Scarf", { Description: "Protection from chemical inhalation." });
    ItemData.EyeGoggles = createWearableItem("Glass-lensed Eye Goggles");
    // ── Provisions ────────────────────────────────────────────────────────────
    ItemData.StandardRations = createRationItem("Rations", DiceRoll.fourSidedDieRoll());
    ItemData.ElfRations = createRationItem("Rations", 1, { Description: "Bread and wax wrapped honeycomb (replaces standard rations)" });
    ItemData.Cheese = createRationItem("Hard cheese", 1);
    ItemData.Bread = createRationItem("Bread", 2);
    ItemData.DriedMeat = createRationItem("Dried meat", 1);
    ItemData.Water = createConsumableItem("Wineskin", { Amount: DiceRoll.fourSidedDieRoll(), Description: "Filled with water" });
    ItemData.Wine = createConsumableItem("Flask of Wine");
    ItemData.WateredWine = createConsumableItem("Flask of watered down wine");
    ItemData.Whiskey = createConsumableItem("Flask of whiskey");
    ItemData.BerryWine = createConsumableItem("Flask of berry wine");
    ItemData.DarkBeer = createConsumableItem("Flask of Dark Beer");
    ItemData.Mushrooms = createConsumableItem("Mushrooms", { Amount: DiceRoll.sixSidedDieRoll(), Description: "Mind altering substance for Berserk Frenzy" });
    ItemData.SpecialLeaves = createConsumableItem("Special leaves", { Amount: DiceRoll.sixSidedDieRoll(), Description: "Mind altering substance for Berserk Frenzy" });
    ItemData.Grain = createConsumableItem("Sack of grain", { Amount: DiceRoll.fourSidedDieRoll() });
    ItemData.FamiliarFeed = createConsumableItem("Small sack of feed", { Amount: DiceRoll.sixSidedDieRoll() });
    ItemData.Candles = createConsumableItem("Candles", { Amount: DiceRoll.sixSidedDieRoll(), Description: "Usage Die: Ud6" });
    ItemData.FlashPowder = createConsumableItem("Flash Powder", { Description: "Usage Die: Ud4." });
    ItemData.TestingAgents = createConsumableItem("Testing agents", { Description: "Usage Die: Ud8." });
    // ── Wealth ────────────────────────────────────────────────────────────────
    ItemData.Coins = createWealthItem("Coins", "Coin", 1, { Amount: 3 * DiceRoll.sixSidedDieRoll(), Description: "Coins in leather belt pouch, holding a max of 80 coins (4 lbs)" });
    ItemData.Gems = createWealthItem("Gems", "Gem", 2, { Amount: DiceRoll.sixSidedDieRoll() });
    ItemData.Teeth = createWealthItem("Teeth (Orcish currency)", "Tooth", 0.5, { Amount: 4 * DiceRoll.sixSidedDieRoll(), Description: "Equivalent to 1 coin per 2 teeth" });
    ItemData.Ring = createWealthItem("Ring", "Jewelry", 10);
    ItemData.Bracelet = createWealthItem("Bracelet", "Jewelry", 10);
    ItemData.Necklace = createWealthItem("Chain necklace", "Jewelry", 10);
    ItemData.Pendant = createWealthItem("Pendant", "Jewelry", 10);
    ItemData.Baubles = createWealthItem("Baubles and miscellaneous small equipment", "Bauble", 1, { Amount: 40 });
    ItemData.EmergencyFund = createWealthItem("Emergency Fund", "Coin", 1, { Amount: 20, Description: "20 additional starting coins." });
    // ── Containers ────────────────────────────────────────────────────────────
    ItemData.Sack = createContainerItem("Sack", ["15 lbs", "300 coins"]);
    ItemData.BeltPouch = createContainerItem("Large leather belt pouch", []);
    ItemData.LinenHaversack = createContainerItem("Woven linen haversack", []);
    ItemData.LeatherHaversack = createContainerItem("Leather haversack", []);
    ItemData.CourierSatchel = createContainerItem("Fine tooled leather courier satchel", []);
    ItemData.Satchel = createContainerItem("Satchel", []);
    ItemData.InstrumentCase = createContainerItem("Leather instrument case", []);
    ItemData.MerchantBackpack = createContainerItem("Double capacity backpack", ["60 lbs", "1200 coins"]);
    ItemData.ToolChest = createContainerItem("Small tool chest", []);
    ItemData.BowfletToolChest = createContainerItem("Small tool chest", []);
    ItemData.SmithToolbox = createContainerItem("Wooden Toolbox", []);
    ItemData.LeatherKit = createContainerItem("Small leather working tool kit", []);
    ItemData.LabGlassware = createContainerItem("Wooden Case of Lab Glassware", []);
    ItemData.ResearchTrunk = createContainerItem("Trunk of Research", [], { Description: "Contains books and notes." });
    ItemData.PortableKennel = createContainerItem("Small portable kennel", [], { Description: "Suitable for your familiar" });
    ItemData.Cage = createContainerItem("Cage", []);
    ItemData.ShelterSack = createContainerItem("Large sack", []);
    ItemData.DisguiseKit = createContainerItem("Disguise Kit", [], { Description: "Small chest with clothes, jewelry, wigs, and makeup" });
    // ── Rope & cordage ────────────────────────────────────────────────────────
    ItemData.HempTwine = createRopeItem("Hemp twine", 10);
    ItemData.Twine = createRopeItem("Twine", 3, { Description: "To keep your pants up." });
    ItemData.FishingString = createRopeItem("Fine, strong string", 20);
    ItemData.ShelterRope = createRopeItem("Rope", 20);
    ItemData.GrapplingRope = createRopeItem("Light rope", 50);
    // ── Animals ───────────────────────────────────────────────────────────────
    ItemData.RidingHorse = createAnimalItem("Riding Horse", { Description: "Quiet/mild-tempered or hot-blooded/aggressive" });
    ItemData.Mule = createAnimalItem("Old Gentle Mule");
    ItemData.Ponies = createAnimalItem("Mild tempered pony", { Amount: 2 });
    ItemData.ViciousDog = createAnimalItem("Small, Vicious Dog", { Description: "Obeys simple, one word commands." });
    ItemData.HerderDog = createAnimalItem("Small, loyal dog", { Description: "Obeys one word commands." });
    ItemData.Familiars = [
        createAnimalItem("Familiar: Bat"), createAnimalItem("Familiar: Black Cat"),
        createAnimalItem("Familiar: Rat"), createAnimalItem("Familiar: Raven"),
        createAnimalItem("Familiar: Snake"), createAnimalItem("Familiar: Large Spider")
    ];
    // ── Transport ─────────────────────────────────────────────────────────────
    ItemData.Saddle = createTransportItem("Saddle");
    ItemData.Bridle = createTransportItem("Bridle");
    ItemData.Saddlebags = createTransportItem("Saddlebags");
    ItemData.Cart = createTransportItem("Rickety, two wheeled cart");
    ItemData.OpenWagon = createTransportItem("Open Wagon");
    ItemData.SmallVessel = createTransportItem("Small fishing vessel", { Description: "Suitable for rivers and coasts" });
    // ── Tools & kit ───────────────────────────────────────────────────────────
    ItemData.Whetstone = createToolItem("Whetstone");
    ItemData.Nails = createToolItem("Iron nails", { Amount: 48 });
    ItemData.IronSpikes = createToolItem("Iron Spikes", { Amount: DiceRoll.eightSidedDieRoll() });
    ItemData.Files = createToolItem("Small files");
    ItemData.Saw = createToolItem("Jeweler's saw");
    ItemData.Loupe = createToolItem("Jeweler's loupe");
    ItemData.Pliers = createToolItem("Pliers");
    ItemData.FineWoodShavers = createToolItem("Fine wood shavers");
    ItemData.HideGlue = createToolItem("Hide glue");
    ItemData.Chisels = createToolItem("Chisels");
    ItemData.Tongs = createToolItem("Tongs");
    ItemData.WoodPlaner = createToolItem("Wood Planer");
    ItemData.DrawKnife = createToolItem("Draw Knife");
    ItemData.Dividers = createToolItem("Adjustable Dividers");
    ItemData.Level = createToolItem("Level");
    ItemData.Trowel = createToolItem("Trowel");
    ItemData.MasonTrowel = createToolItem("Mason's trowel");
    ItemData.Scissors = createToolItem("Scissors");
    ItemData.Padlock = createToolItem("Padlock with key");
    ItemData.LockPicks = createToolItem("Lock Picks");
    ItemData.Crowbar = createToolItem("Crowbar");
    ItemData.GrapplingHook = createToolItem("Grappling Hook", { Description: "Includes 50' of light rope." });
    ItemData.Punches = createToolItem("Leather punches");
    ItemData.Awls = createToolItem("Awls");
    ItemData.Cutters = createToolItem("Cutters");
    ItemData.TannedLeather = createToolItem("Roll of tanned leather");
    ItemData.Stakes = createToolItem("Stakes", { Amount: 12 });
    ItemData.Canvas = createToolItem("Water resistant canvas", { Description: "15' x 15'" });
    ItemData.Kettles = createToolItem("Brewing kettles");
    ItemData.FermentationJars = createToolItem("Fermentation jars");
    ItemData.VintnerTools = createToolItem("Winemaking equipment");
    ItemData.HerbalistKit = createToolItem("Herbalist kit", { Description: "Pouches and shears for harvesting" });
    ItemData.ChefKnives = createToolItem("Set of knives");
    ItemData.CuttingBoard = createToolItem("Cutting board");
    ItemData.MortarPestle = createToolItem("Mortar & Pestle");
    ItemData.Reagents = createToolItem("Small kit of reagents");
    ItemData.BrassHooks = createToolItem("Brass hooks", { Amount: DiceRoll.sixSidedDieRoll() });
    ItemData.RatTraps = createToolItem("Rat Traps");
    ItemData.Abacus = createToolItem("Abacus");
    ItemData.LeadStylus = createToolItem("Lead stylus");
    ItemData.Ledger = createToolItem("Bound ledger");
    ItemData.Ink = createToolItem("Bottle of ink");
    ItemData.Quill = createToolItem("Quill");
    ItemData.Paper = createToolItem("Paper");
    ItemData.AlchemyJournal = createToolItem("Leather-bound Alchemical Journal", { Description: "Partially filled with formulae." });
    ItemData.ArcaneResearchBook = createToolItem("Arcane Research Book");
    ItemData.PsalmBook = createToolItem("Book of psalms/prayers");
    ItemData.ForbiddenBook = createToolItem("Forbidden book of profane prayers");
    ItemData.StrangeBooks = createToolItem("Books of strange theories");
    ItemData.ArcaneTrinkets = createToolItem("Collection of arcane trinkets");
    ItemData.PrayerMat = createToolItem("Prayer mat");
    ItemData.PrayerBeads = createToolItem("Prayer Beads");
    ItemData.HolySymbol = createToolItem("Holy Symbol");
    ItemData.VariantHolySymbol = createToolItem("Variant Holy Symbol", { Description: "An older or sectarian version of a holy symbol." });
    ItemData.UnholySymbol = createToolItem("Unholy symbol");
    ItemData.DivinationKit = createToolItem("Divination Kit", { Description: "Dice, cards, small bones, or sticks." });
    ItemData.DivinationCards = createToolItem("Divination Cards");
    ItemData.DecoratedWand = createToolItem("Decorated Wand");
    ItemData.CopperDowsingRods = createToolItem("Copper Dowsing Rods");
    ItemData.BadgeOfOffice = createToolItem("Badge of Office");
    ItemData.Banner = createToolItem("Detachable banner");
    ItemData.FacePaint = createToolItem("Face paint");
    ItemData.SharpStones = createToolItem("Sharp stones");
    ItemData.ClayPipe = createToolItem("Clay pipe");
    ItemData.TobaccoPouch = createToolItem("Tobacco pouch");
    ItemData.Shackles = createToolItem("Open wooden pillory or pair of iron shackles with chain", { Description: "About 12 inches of chain." });
    ItemData.Dice = createToolItem("Dice");
    ItemData.PlayingCards = createToolItem("Deck of cards");
    ItemData.ThimblerigSet = createToolItem("Thimblerig set");
    // ── Trinkets ──────────────────────────────────────────────────────────────
    // Trinkets keep their `Value`: a character may sell one for that many coins instead of
    // taking it (see getTrinketPackage / TrinketToCoinFactory).
    ItemData.BlackArrow = createAmmoItem("Arrow, Black", "Bow", "1d6", { Value: 5, Description: "At the end of the Encounter, you can always find it within 1d6 turns if you search." });
    ItemData.LuckyCopperCoin = createBaseItem("Coin, Lucky Copper", { Value: 5, Description: "It always lands on your mental choice of heads or tails." });
    ItemData.GlowingCrystal = createBaseItem("Crystal, glowing", { Value: 20, Description: "This palm sized crystal emits a bluish light continually and can illuminate an area Close when uncovered. The light it emits is unaffected by the Darkness spell." });
    ItemData.CurvedDagger = createMeleeWeapon("Dagger, curved", "Light", "1d4", { Value: 40, Description: "It has 4 gems worth 10 coins each. If removed, a new gem will take its place after one week." });
    ItemData.BountifulFlask = createConsumableItem("Flask, Bountiful", { Value: 15, Description: "This copper flask continually refills and always has enough water for two people per day. If a bottle of wine is added it will refill with wine for a week." });
    ItemData.GlassMarbles = createBaseItem("Glass Marbles, dozen", { Value: 5, Description: "You can cast marbles as a Standard Action to an area Close. Creatures that move through them must pass a DEX Test or be Down. Marbles Nearby return to their pouch if you hold it open on the ground and concentrate for one minute." });
    ItemData.SilentHammer = createMeleeWeapon("Silent Hammer", "Simple", "1d6", { Value: 10, Range: "Nearby", Description: "This work hammer has a head made of an unusual, dark black metal. It makes no sound when hammering nails, spikes, or chisels." });
    ItemData.SkeletonKey = createToolItem("Key, Skeleton", { Value: 20, Description: "This key has a 1 in 4 chance to work on any mundane lock. A failed attempt can be tried again on the same lock the following day." });
    ItemData.FoldingKnife = createMeleeWeapon("Knife with folding blade", "Light", "1d2", { Value: 10, Range: "Nearby", Description: "This knife is small and easy to conceal. The blade never dulls and will not break with a Critical Failure. Can also be thrown." });
    ItemData.FishCharmNecklace = createWearableItem("Leather Necklace with Lucky Fish Charm", { Value: 5, Description: "This charm gives you Advantage on your INT Test when fishing or Foraging at a shoreline to increase your rations." });
    ItemData.LuckyDice = createBaseItem("Lucky Dice, pair", { Value: 5, Description: "In dice games, once per day you can reroll and take the better result." });
    ItemData.Lodestone = createBaseItem("Lodestone on a leather thong", { Value: 10, Description: "The lodestone points north by default but can be attuned to another target you can touch and concentrate on for one minute." });
    ItemData.FloralPerfume = createConsumableItem("Perfume, Floral (Ud4)", { Value: 5, Description: "When perfume from this vial is applied, you have Advantage on CHA Tests when seeking information or asking for favors. Each application lasts 1 hour." });
    ItemData.InsectRing = createWearableItem("Ring, silver with insect motif", { Value: 10, Description: "When you wear this ring, insects avoid you. Any insect type creature must pass a WIS Test to attack you." });
    ItemData.SpiderSilkRope = createRopeItem("Rope, spider silk rope", 100, { Value: 15, Description: "This thin rope can hold the weight of approximately six human-sized beings (1200 lbs). It also never tangles. It takes 8 hp of damage to break/sever." });
    ItemData.RosewoodFlute = createBaseItem("Rosewood flute", { Value: 10, Description: "Once per day, when you play this flute as a Standard Action, the GM will reroll on the NPC Reaction Table if you ask." });
    ItemData.MagicSatchel = createContainerItem("Satchel, tooled leather with shoulder strap and silver buckle", ["60 lbs", "1200 coins"], { Value: 20, Description: "This small satchel has twice the capacity of a backpack but never weighs more than 10 pounds. What is put in the satchel is limited by the size of its mouth (12\" diameter). Living creatures cannot survive in the satchel over 24 hours if it is closed." });
    ItemData.SneezingPowder = createConsumableItem("Sneezing powder, packets (Ud6)", { Value: 10, Description: "As a Reaction to an opponent being Close, you can blow this powder in their face. If the target fails a CON Ability Test, they will sneeze uncontrollably and have Disadvantage on any Actions until the beginning of your next turn. The powder cannot be used in windy conditions." });
    ItemData.SpringBladeStaff = createMeleeWeapon("Staff, Walking with concealed spring blade", "Simple", "1d6", { Value: 10, Range: "Nearby", Description: "This walking staff has a concealed spring blade allowing it to be used as a spear." });
    ItemData.JadeMonkeyStatuette = createBaseItem("Lucky Statuette Jade Monkey", { Value: 10, Description: "While held, this palm sized statuette gives you Advantage on one INT Ability Test per day." });
    ItemData.basicTrinketSection = [
        ItemData.BlackArrow, ItemData.LuckyCopperCoin, ItemData.GlowingCrystal, ItemData.CurvedDagger, ItemData.BountifulFlask,
        ItemData.GlassMarbles, ItemData.SilentHammer, ItemData.SkeletonKey, ItemData.FoldingKnife, ItemData.FishCharmNecklace,
        ItemData.LuckyDice, ItemData.Lodestone, ItemData.FloralPerfume, ItemData.InsectRing, ItemData.SpiderSilkRope,
        ItemData.RosewoodFlute, ItemData.MagicSatchel, ItemData.SneezingPowder, ItemData.SpringBladeStaff, ItemData.JadeMonkeyStatuette
    ];
    const none = new SelectionPackage([], [], []);
    // --- Selection Packages ---
    ItemData.DwarfItemSelection = new SelectionPackage([ItemData.Apron, ItemData.Nails, ItemData.Hammer, ItemData.Whiskey, ItemData.Gems], [], []);
    ItemData.ElfItemSelection = new SelectionPackage([ItemData.LinenHaversack, ItemData.ElfRations, ItemData.Wine], [], [ItemData.StandardRations, ItemData.Water]);
    ItemData.HumanItemSelection = new SelectionPackage([ItemData.LinenHaversack, ItemData.WateredWine], [], [ItemData.Water]);
    ItemData.HalflingItemSelection = new SelectionPackage([ItemData.ClayPipe, ItemData.TobaccoPouch, ItemData.WalkingStick, ItemData.Handkerchief, ItemData.Cheese, ItemData.Bread, ItemData.DriedMeat], [new ChoiceGroup(1, [ItemData.BerryWine, ItemData.DarkBeer], [])], [ItemData.StandardRations, ItemData.Water]);
    ItemData.OrcItemSelection = new SelectionPackage([ItemData.OrcArmor, ItemData.Dagger, ItemData.BeltPouch, ItemData.Whetstone, ItemData.Teeth], [], []);
    ItemData.IxianItemSelection = new SelectionPackage([ItemData.LeatherHaversack, ItemData.LeatherGloves], [], []);
    ItemData.JewelerItemSelection = new SelectionPackage([ItemData.Satchel, ItemData.Loupe, ItemData.Files, ItemData.Saw], [new ChoiceGroup(1, [ItemData.Ring, ItemData.Bracelet, ItemData.Necklace, ItemData.Pendant], [])], []);
    ItemData.BarbarianItemSelection = new SelectionPackage([ItemData.FurArmor, ItemData.BeltPouch, ItemData.FacePaint, ItemData.SharpStones], [
        new ChoiceGroup(1, [ItemData.Mushrooms, ItemData.SpecialLeaves], []),
        new ChoiceGroup(1, [ItemData.BarbSword, ItemData.BarbAxe, ItemData.BarbMace, ItemData.BarbGreatSword], [])
    ], []);
    // The smith's toolbox and its contents, granted together wherever a smithing kit is issued.
    const smithKit = [ItemData.SmithToolbox, ItemData.MasonHammer, ItemData.Chisels, ItemData.Files, ItemData.Tongs, ItemData.LeatherGloves, ItemData.Apron];
    // --- The Starting Selection Package ---
    // This represents the "Universal" gear every character starts with
    ItemData.UniversalStartingGear = new SelectionPackage([
        ItemData.TravelingClothes,
        ItemData.LeatherBelt,
        ItemData.LeatherBoots,
        ItemData.UtilityKnife,
        ItemData.Sack,
        ItemData.HempTwine,
        ItemData.Coins,
        ItemData.StandardRations,
        ItemData.Water
    ], [
        // Choice 1: The Cloak Style
        new ChoiceGroup(1, [ItemData.HoodedCloak, ItemData.CloakAndHat], []),
        // Choice 2: The Weapon Category (Melee vs Ranged)
        // Note: Since ChoiceGroup usually picks from a flat list,
        // you might handle the 1-3 vs 4-6 roll in your logic
        // by presenting this group:
        new ChoiceGroup(1, [
            // Melee Sub-options
            ItemData.Axe, ItemData.DaggerMelee, ItemData.HammerMelee, ItemData.SpearMelee, ItemData.Staff, ItemData.Sword,
            // Ranged Sub-options
            ItemData.CrossbowWithBolts, ItemData.Javelins, ItemData.ShortBowWithArrows, ItemData.SlingWithStones
        ], [])
    ], []);
    // --- Trinket Selection Package ---
    function getTrinketPackage(race, job, jobSubset) {
        const shuffled = Utility.shuffle(ItemData.basicTrinketSection.map(x => x));
        const isHuman = race === "Human";
        if (jobSubset === JobSubsetEnum.ThreeTrinketRandom) {
            return new SelectionPackage([], [
                new ChoiceGroup(1, isHuman
                    ? [shuffled[0], shuffled[3], TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(shuffled[3])]
                    : [shuffled[0], TrinketToCoinFactory(shuffled[0])], []),
                new ChoiceGroup(1, isHuman
                    ? [shuffled[1], shuffled[4], TrinketToCoinFactory(shuffled[1]), TrinketToCoinFactory(shuffled[4])]
                    : [shuffled[1], TrinketToCoinFactory(shuffled[1])], []),
                new ChoiceGroup(1, isHuman
                    ? [shuffled[2], shuffled[5], TrinketToCoinFactory(shuffled[2]), TrinketToCoinFactory(shuffled[5])]
                    : [shuffled[2], TrinketToCoinFactory(shuffled[2])], []),
            ], []);
        }
        if (jobSubset === JobSubsetEnum.OneTrinketChoice) {
            return new SelectionPackage([], [
                new ChoiceGroup(1, ItemData.basicTrinketSection, [])
            ], []);
        }
        if (job === "Dowser") {
            return new SelectionPackage([], [
                new ChoiceGroup(1, isHuman
                    ? [shuffled[0], shuffled[1], ItemData.Lodestone, TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(shuffled[1]), TrinketToCoinFactory(ItemData.Lodestone)]
                    : [shuffled[0], ItemData.Lodestone, TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(ItemData.Lodestone)], [])
            ], []);
        }
        if (isHuman) {
            return new SelectionPackage([], [
                new ChoiceGroup(1, [shuffled[0], shuffled[1], TrinketToCoinFactory(shuffled[0]), TrinketToCoinFactory(shuffled[1])], [])
            ], []);
        }
        return new SelectionPackage([], [
            new ChoiceGroup(1, [shuffled[0], TrinketToCoinFactory(shuffled[0])], [])
        ], []);
    }
    ItemData.getTrinketPackage = getTrinketPackage;
    // --- Records ---
    ItemData.RaceRecord = {
        Dwarf: ItemData.DwarfItemSelection,
        Elf: ItemData.ElfItemSelection,
        Orc: ItemData.OrcItemSelection,
        Ixian: ItemData.IxianItemSelection,
        Human: ItemData.HumanItemSelection,
        Halfling: ItemData.HalflingItemSelection
    };
    ItemData.JobTypeToItem = {
        "Apprentice Artisan": none,
        "Apprentice Bureaucrat": new SelectionPackage([ItemData.Ink, ItemData.Quill, ItemData.Paper, ItemData.CourierSatchel], [], []),
        "Free Laborer": new SelectionPackage([ItemData.RidingHorse, ItemData.Saddle, ItemData.Bridle, ItemData.Saddlebags, ItemData.Grain], [], []),
        "Apprentice Crafter": new SelectionPackage([...smithKit, ItemData.SteelDagger], [], []),
        "Apprentice Mercantiler": new SelectionPackage([ItemData.FancyClothes, ItemData.Satchel, ItemData.Abacus, ItemData.LeadStylus, ItemData.Ledger], [], []),
        "Escaped Peasant/Thrall": new SelectionPackage([ItemData.RaggedClothes, ItemData.Twine, ItemData.Shackles], [], [ItemData.TravelingClothes, ItemData.LeatherBelt, ItemData.LeatherBoots, ItemData.UtilityKnife, ItemData.Sack, ItemData.HempTwine, ItemData.Coins, ItemData.StandardRations, ItemData.Water, ItemData.HoodedCloak, ItemData.CloakAndHat]),
        Acrobat: new SelectionPackage([ItemData.PerformanceOutfit, ItemData.JugglingClubs], [], []),
        Contortionist: new SelectionPackage([ItemData.PerformanceOutfit, ItemData.JugglingClubs], [], []),
        Jester: new SelectionPackage([ItemData.PerformanceOutfit, ItemData.JesterClub], [], []),
        Minstrel: new SelectionPackage([ItemData.PerformanceOutfit, ItemData.InstrumentCase], [new ChoiceGroup(1, [ItemData.RosewoodFlute], [])], []),
        "Storyteller/Thespian": new SelectionPackage([ItemData.PerformanceOutfit], [new ChoiceGroup(1, [ItemData.DisguiseKit], [])], []),
        Accursed: new SelectionPackage([ItemData.ArcaneTrinkets, ItemData.StrangeBooks], [], []),
        Acolyte: new SelectionPackage([ItemData.PrayerMat, ItemData.Candles, ItemData.PsalmBook, ItemData.CoarseRobe, ItemData.RopeBelt, ItemData.Sandals], [], [ItemData.TravelingClothes, ItemData.LeatherBelt, ItemData.LeatherBoots]),
        Cultist: new SelectionPackage([ItemData.PrayerMat, ItemData.Candles, ItemData.ForbiddenBook, ItemData.UnholySymbol, ItemData.CoarseRobe, ItemData.RopeBelt, ItemData.Sandals], [], [ItemData.TravelingClothes, ItemData.LeatherBelt, ItemData.LeatherBoots]),
        Inquisitor: new SelectionPackage([ItemData.InquisitorGarb, ItemData.HolySymbol, ItemData.SpikedMaceHoly], [], []),
        Pariah: new SelectionPackage([ItemData.PrayerMat, ItemData.Candles, ItemData.HolySymbol, ItemData.PsalmBook, ItemData.DivinationKit], [], [ItemData.TravelingClothes, ItemData.LeatherBelt, ItemData.LeatherBoots]),
        "Touched/Anchorite": new SelectionPackage([ItemData.PrayerMat, ItemData.Candles, ItemData.HolySymbol, ItemData.PrayerBeads], [], [ItemData.TravelingClothes, ItemData.LeatherBelt, ItemData.LeatherBoots]),
        Armiger: new SelectionPackage([ItemData.RidingHorse, ItemData.Saddle, ItemData.Saddlebags, ItemData.Grain, ItemData.SpearLance, ItemData.Banner], [
            new ChoiceGroup(1, [ItemData.Gambeson, ItemData.SmallShield], []),
            new ChoiceGroup(1, [ItemData.Sword, ItemData.Axe, ItemData.BarbMace, ItemData.BarbGreatSword, ItemData.Warhammer, ItemData.BattleAxe], [])
        ], []),
        Barbarian: ItemData.BarbarianItemSelection,
        "Mercenary/Hedge": new SelectionPackage([], [
            new ChoiceGroup(1, [ItemData.Gambeson, ItemData.SmallShield], []),
            new ChoiceGroup(1, [ItemData.Sword, ItemData.Axe, ItemData.BarbMace, ItemData.BarbGreatSword, ItemData.Warhammer, ItemData.BattleAxe], [])
        ], []),
        Prizefighter: new SelectionPackage([ItemData.BrassKnuckles], [], []),
        "Ruffian/Enforcer": new SelectionPackage([], [new ChoiceGroup(1, [ItemData.BrassKnuckles, ItemData.Sap], [])], []),
        "Woodard/Warden": new SelectionPackage([ItemData.ShelterSack, ItemData.ShelterRope, ItemData.Stakes, ItemData.Canvas], [], []),
        "Adept/Arcane Apprentice": new SelectionPackage([ItemData.ResearchTrunk, ItemData.YewStaff], [], []),
        "Alchemy Apprentice": new SelectionPackage([ItemData.Ink, ItemData.Quill, ItemData.AlchemyJournal, ItemData.EyeGoggles, ItemData.SilkScarf, ItemData.LabGlassware, ItemData.TestingAgents], [], []),
        "Arcane Researcher": new SelectionPackage([ItemData.Ink, ItemData.Quill, ItemData.ArcaneResearchBook], [], []),
        Charlatan: new SelectionPackage([ItemData.FlashyCape, ItemData.ThighBoots, ItemData.DecoratedWand, ItemData.DivinationCards, ItemData.FlashPowder], [], []),
        Dowser: new SelectionPackage([ItemData.CopperDowsingRods], [], []),
        Warlock: new SelectionPackage([ItemData.BlackClothing, ItemData.PortableKennel, ItemData.FamiliarFeed], [new ChoiceGroup(1, ItemData.Familiars, [])], []),
        Fence: new SelectionPackage([ItemData.Satchel, ItemData.Abacus, ItemData.LeadStylus, ItemData.Ledger, ItemData.EmergencyFund], [], []),
        Gambler: new SelectionPackage([ItemData.Dice, ItemData.PlayingCards, ItemData.ThimblerigSet], [], []),
        Scoundrel: new SelectionPackage([ItemData.ScoundrelCloak, ItemData.NarrowDaggers], [], []),
        Sharp: new SelectionPackage([ItemData.TravelingClothes, ItemData.NarrowDaggers], [], []),
        Spy: new SelectionPackage([ItemData.HoodedCloak], [new ChoiceGroup(1, [ItemData.DisguiseKit, ItemData.LockPicks, ItemData.Crowbar, ItemData.GrapplingHook], [])], []),
        "Street Urchin": new SelectionPackage([], [], [ItemData.LeatherBoots, ItemData.HoodedCloak, ItemData.CloakAndHat, ItemData.Coins]),
        Scholar: new SelectionPackage([ItemData.Ink, ItemData.Quill, ItemData.Paper, ItemData.CourierSatchel], [], [])
    };
    ItemData.JobSubsetToItem = {
        [JobSubsetEnum.None]: none,
        [JobSubsetEnum.Jeweler]: ItemData.JewelerItemSelection,
        [JobSubsetEnum.Arbalist]: new SelectionPackage([ItemData.ToolChest, ItemData.Pliers, ItemData.Files, ItemData.FineWoodShavers, ItemData.Crossbow, ItemData.Bolts], [], []),
        [JobSubsetEnum.Scrivener]: new SelectionPackage([ItemData.Ink, ItemData.Quill, ItemData.Paper, ItemData.CourierSatchel], [], []),
        [JobSubsetEnum.Advocate]: none,
        [JobSubsetEnum.Cartographer]: none,
        [JobSubsetEnum.Inspector]: new SelectionPackage([ItemData.SimpleSword, ItemData.BadgeOfOffice], [], []),
        [JobSubsetEnum.Interpreter]: none,
        [JobSubsetEnum.Smith]: new SelectionPackage([...smithKit, ItemData.SteelDagger], [], []),
        [JobSubsetEnum.Carpenter]: new SelectionPackage([ItemData.Mallet, ItemData.Adze, ItemData.WoodPlaner, ItemData.Level], [], []),
        [JobSubsetEnum.MoneyChanger]: new SelectionPackage([ItemData.FancyClothes, ItemData.Abacus, ItemData.LeadStylus, ItemData.Ledger], [], []),
        [JobSubsetEnum.Ambler]: new SelectionPackage([ItemData.RidingHorse, ItemData.Saddle, ItemData.Bridle, ItemData.Saddlebags, ItemData.Grain], [], []),
        [JobSubsetEnum.Chef]: new SelectionPackage([ItemData.ChefKnives, ItemData.CuttingBoard, ItemData.MortarPestle], [], []),
        // Laborer & Service Subsets
        [JobSubsetEnum.HouseServant]: none,
        [JobSubsetEnum.Farmhand]: none,
        [JobSubsetEnum.Laborer]: none,
        [JobSubsetEnum.Sailor]: none,
        [JobSubsetEnum.Brewer]: new SelectionPackage([ItemData.Kettles, ItemData.FermentationJars], [], []),
        [JobSubsetEnum.Farmer]: none, // Description mentions knowledge/skills but no specific gear
        [JobSubsetEnum.Herder]: new SelectionPackage([ItemData.HerderDog], [], []),
        [JobSubsetEnum.Vintner]: new SelectionPackage([ItemData.VintnerTools], [], []),
        [JobSubsetEnum.Oratory]: none,
        [JobSubsetEnum.Theology]: new SelectionPackage([ItemData.PsalmBook], [], []),
        [JobSubsetEnum.Esoterica]: new SelectionPackage([ItemData.ArcaneTrinkets, ItemData.StrangeBooks], [], []),
        // Martial & Backstory Subsets
        [JobSubsetEnum.ActiveService]: none,
        [JobSubsetEnum.Freelance]: none,
        [JobSubsetEnum.LordSlain]: none,
        [JobSubsetEnum.Disgraced]: none,
        [JobSubsetEnum.HedgeKnight]: new SelectionPackage([ItemData.Gambeson, ItemData.SmallShield, ItemData.Sword], [], []),
        [JobSubsetEnum.Mercenary]: new SelectionPackage([ItemData.Gambeson, ItemData.Sword], [], []),
        [JobSubsetEnum.Bandit]: new SelectionPackage([ItemData.Gambeson, ItemData.Sword], [], []),
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
        [JobSubsetEnum.DisguiseSpecialist]: new SelectionPackage([ItemData.DisguiseKit], [], []),
        [JobSubsetEnum.BurglarSpecialist]: new SelectionPackage([ItemData.LockPicks, ItemData.Crowbar, ItemData.GrapplingHook, ItemData.GrapplingRope], [], []),
        [JobSubsetEnum.ThreeTrinketRandom]: none,
        [JobSubsetEnum.OneTrinketChoice]: none,
        // Additional Artisan subsets
        [JobSubsetEnum.Armorer]: new SelectionPackage([...smithKit, ItemData.ChainMailArmor], [], []),
        [JobSubsetEnum.Bowyer]: new SelectionPackage([ItemData.BowfletToolChest, ItemData.Files, ItemData.FineWoodShavers, ItemData.HideGlue, ItemData.ShortBowWithArrows], [], []),
        [JobSubsetEnum.Fletcher]: new SelectionPackage([ItemData.BowfletToolChest, ItemData.Files, ItemData.FineWoodShavers, ItemData.HideGlue, ItemData.ShortBowWithArrows], [], []),
        [JobSubsetEnum.Tailor]: new SelectionPackage([ItemData.Apron, ItemData.Scissors, ItemData.FormalWearOutfit], [], []),
        [JobSubsetEnum.Locksmith]: new SelectionPackage([ItemData.Files, ItemData.Saw, ItemData.MasonHammer, ItemData.Padlock, ItemData.LockPicks], [], []),
        // Additional Crafter subsets
        [JobSubsetEnum.Cooper]: new SelectionPackage([ItemData.Mallet, ItemData.WideAx, ItemData.DrawKnife, ItemData.Dividers, ItemData.WoodPlaner, ItemData.Cart, ItemData.Mule], [], []),
        [JobSubsetEnum.Leatherworker]: new SelectionPackage([ItemData.LeatherKit, ItemData.Punches, ItemData.Awls, ItemData.Cutters, ItemData.TannedLeather, ItemData.LeatherArmorRoll], [], []),
        [JobSubsetEnum.Mason]: new SelectionPackage([ItemData.MasonHammer, ItemData.IronSpikes, ItemData.MasonTrowel, ItemData.Level], [], []),
        [JobSubsetEnum.Swordsmith]: new SelectionPackage([ItemData.SwordsmithWeapon], [], []),
        // Additional Mercantiler subsets
        [JobSubsetEnum.Assayer]: new SelectionPackage([ItemData.MortarPestle, ItemData.Reagents], [], []),
        [JobSubsetEnum.Herbalist]: new SelectionPackage([ItemData.HerbalistKit], [], []),
        [JobSubsetEnum.Peddler]: new SelectionPackage([ItemData.MerchantBackpack, ItemData.Baubles], [], []),
        // Additional Laborer subsets
        [JobSubsetEnum.Fisher]: new SelectionPackage([ItemData.FishingString, ItemData.BrassHooks], [], []),
        [JobSubsetEnum.Wagoner]: new SelectionPackage([ItemData.OpenWagon, ItemData.Ponies, ItemData.Crossbow, ItemData.WagonBolts], [], []),
    };
})(ItemData || (ItemData = {}));
