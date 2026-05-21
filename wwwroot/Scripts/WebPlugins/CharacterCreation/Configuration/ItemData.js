import { Utility } from "../../../WebCore/Utility.js";
import { JobSubsetEnum } from "../Contracts/StringTypes.js";
import { ChoiceGroup, Item, SelectionPackage } from "../Contracts/TaggedData.js";
import { DiceRoll } from "../Utility/DiceRoll.js";
const genericCoinFactory = (amount, value, Description) => {
    return new Item(`${value} Coins from selling trinket`, amount, Description, value);
};
const TrinketToCoinFactory = (item) => {
    const amount = (item.Amount) ? item.Amount : 0;
    return genericCoinFactory(amount, item.Value, "Earned from selling " + item.Name);
};
export var ItemData;
(function (ItemData) {
    // --- Item Definitions ---
    // --- Basic Clothing & Utility ---
    ItemData.TravelingClothes = new Item("Traveling clothes", 1, "1 pair of long pants, 1 shirt, and 1 undergarment");
    ItemData.LeatherBelt = new Item("Leather belt", 1, "Metal buckle");
    ItemData.LeatherBoots = new Item("Leather boots", 1, "Below the knee");
    ItemData.HoodedCloak = new Item("Hooded cloak");
    ItemData.CloakAndHat = new Item("Cloak and Hat");
    ItemData.UtilityKnife = new Item("Knife", 1, "Light Melee & Ranged, 1d2 damage, Range: Nearby. Can be thrown.");
    ItemData.Sack = new Item("Sack", 1, "Holds 15 lbs / 300 coins");
    ItemData.HempTwine = new Item("Hemp twine", 1, "10 feet");
    ItemData.Coins = new Item("Coins", 3 * DiceRoll.sixSidedDieRoll(), "Coins in leather belt pouch, holding a max of 80 coins (4 lbs)");
    ItemData.StandardRations = new Item("Rations", DiceRoll.fourSidedDieRoll());
    ItemData.Water = new Item("Wineskin", DiceRoll.fourSidedDieRoll(), "Filled with water");
    // --- Melee Weapon Options ---
    ItemData.Axe = new Item("Axe", 1, "Simple Melee & Ranged, 1d6 damage, Range: Nearby");
    ItemData.DaggerMelee = new Item("Dagger", 1, "Light Melee & Ranged, 1d4 damage, Range: Nearby");
    ItemData.HammerMelee = new Item("Hammer", 1, "Simple Melee & Ranged, 1d6 damage, Range: Nearby");
    ItemData.SpearMelee = new Item("Spear", 1, "Simple Melee and Ranged, 1d6 damage, Range: Nearby");
    ItemData.Staff = new Item("Staff", 1, "Light Melee, 1d4 damage");
    ItemData.Sword = new Item("Sword", 1, "Simple Melee, 1d6 damage");
    // --- Ranged Weapon Options ---
    ItemData.CrossbowWithBolts = new Item("Crossbow and bolts", DiceRoll.eightSidedDieRoll(), "Simple Ranged, 1d6 damage, Range: Nearby");
    ItemData.DaggerRanged = new Item("Dagger", 1, "Light Melee & Ranged, 1d4 damage, Range: Nearby");
    ItemData.Javelins = new Item("Javelins", DiceRoll.eightSidedDieRoll(), "Light Ranged, 1d4 damage, Range: Nearby");
    ItemData.ShortBowWithArrows = new Item("Short Bow and arrows", DiceRoll.eightSidedDieRoll(), "Simple Ranged, 1d6 damage, Range: Nearby");
    ItemData.SlingWithStones = new Item("Sling and stones", DiceRoll.eightSidedDieRoll(), "Light Ranged, 1d4 damage, Range: Nearby");
    ItemData.SpearRanged = new Item("Spear", 1, "Simple Melee & Ranged, 1d6 damage, Range: Nearby");
    // Dwarf
    ItemData.Apron = new Item("Sturdy leather work apron");
    ItemData.Nails = new Item("Iron nails", 48);
    ItemData.Hammer = new Item("Small Hammer", undefined, "Light Melee Weapon, 1d4 damage. Worth 2 coins each");
    ItemData.Whiskey = new Item("Flask of whiskey");
    ItemData.Gems = new Item("Gems", DiceRoll.sixSidedDieRoll(), "Worth 2 coins each");
    // Elf / Human / Ixian
    ItemData.LinenHaversack = new Item("Woven linen haversack");
    ItemData.ElfRations = new Item("Rations", undefined, "Bread and wax wrapped honeycomb (replaces standard rations)");
    ItemData.Wine = new Item("Flask of Wine");
    ItemData.WateredWine = new Item("Flask of watered down wine");
    ItemData.LeatherHaversack = new Item("Leather haversack");
    ItemData.LeatherGloves = new Item("Pair of leather gloves");
    // Halfling
    ItemData.ClayPipe = new Item("Clay pipe");
    ItemData.TobaccoPouch = new Item("Tobacco pouch");
    ItemData.WalkingStick = new Item("Walking stick", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.Handkerchief = new Item("Pocket handkerchief");
    ItemData.Cheese = new Item("Hard cheese", 1);
    ItemData.Bread = new Item("Bread", 2);
    ItemData.DriedMeat = new Item("Dried meat", 1);
    ItemData.BerryWine = new Item("Flask of berry wine");
    ItemData.DarkBeer = new Item("Flask of Dark Beer");
    // Orc
    ItemData.OrcArmor = new Item("Light Armor", undefined, "Made of hides and piecemeal metal and leather armor salvaged parts.");
    ItemData.Dagger = new Item("Dagger", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.BeltPouch = new Item("Large leather belt pouch");
    ItemData.Whetstone = new Item("Whetstone");
    ItemData.Teeth = new Item("Teeth (Orcish currency)", 4 * DiceRoll.sixSidedDieRoll(), "Equivalent to 1 coin per 2 teeth");
    // Jeweler
    ItemData.Satchel = new Item("Satchel with a loupe");
    ItemData.Files = new Item("Small files");
    ItemData.Saw = new Item("Jeweler\'s saw");
    ItemData.Ring = new Item("Ring", undefined, "Worth 10 coins");
    ItemData.Bracelet = new Item("Bracelet", undefined, "Worth 10 coins");
    ItemData.Necklace = new Item("Chain necklace", undefined, "Worth 10 coins");
    ItemData.Pendant = new Item("Pendant", undefined, "Worth 10 coins");
    // Arbalist
    ItemData.Crossbow = new Item("Crossbow", DiceRoll.sixSidedDieRoll(), "Simple Ranged Weapon, 1d6 damage, Range Nearby");
    ItemData.ToolChest = new Item("Small tool chest", undefined, "Contains pliers, files, and fine wood shavers");
    ItemData.Bolts = new Item("Bolts", DiceRoll.sixSidedDieRoll(), "Ammunition for Crossbow");
    // Barbarian
    ItemData.FurArmor = new Item("Layers of smelly furs with sewn on bones", DiceRoll.sixSidedDieRoll(), "Light Armor, Ud6");
    ItemData.FacePaint = new Item("Belt pouch with face paint and sharp stones");
    ItemData.Mushrooms = new Item("Mushrooms", DiceRoll.sixSidedDieRoll(), "Mind altering substance for Berserk Frenzy");
    ItemData.SpecialLeaves = new Item("Special leaves", DiceRoll.sixSidedDieRoll(), "Mind altering substance for Berserk Frenzy");
    ItemData.BarbSword = new Item("Sword", undefined, "Simple Melee Weapon 1d6 damage");
    ItemData.BarbAxe = new Item("Axe", undefined, "Simple Melee Weapon 1d6 damage");
    ItemData.BarbMace = new Item("Mace or Hammer", undefined, "Simple Melee Weapon 1d6 damage");
    ItemData.BarbGreatSword = new Item("Great Sword", undefined, "Heavy Melee Weapon 1d6, 1d8 damage if you have Armaments");
    // Scrivener / Scholar
    ItemData.Ink = new Item("Bottle of ink");
    ItemData.Quill = new Item("Quill");
    ItemData.Paper = new Item("Paper");
    ItemData.CourierSatchel = new Item("Fine tooled leather courier satchel");
    // Inspector
    ItemData.SimpleSword = new Item("Sword", undefined, "Simple Melee Weapon, 1d6 damage");
    ItemData.BadgeOfOffice = new Item("Badge of Office");
    // Rat Catcher
    ItemData.RatTraps = new Item("Rat Traps");
    ItemData.Cage = new Item("Cage");
    ItemData.ViciousDog = new Item("Small, Vicious Dog", undefined, "Obeys simple, one word commands.");
    // Smith & Variants
    ItemData.SmithTools = new Item("Wooden Toolbox", undefined, "Contains hammers, chisels, files, tongs, leather gloves, and an apron.");
    ItemData.SteelDagger = new Item("Steel Dagger", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.Mallet = new Item("Mallet", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.Adze = new Item("Adze", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.WoodPlaner = new Item("Wood Planer");
    ItemData.Level = new Item("Level");
    ItemData.WideAx = new Item("Wide Bladed Ax", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.DrawKnife = new Item("Draw Knife");
    ItemData.Dividers = new Item("Adjustable Dividers");
    ItemData.Cart = new Item("Rickety, two wheeled cart");
    ItemData.Mule = new Item("Old Gentle Mule");
    ItemData.LeatherKit = new Item("Small leather working tool kit", undefined, "Includes punches, awls, cutters");
    ItemData.TannedLeather = new Item("Roll of tanned leather");
    ItemData.LeatherArmorRoll = new Item("Leather Armor", DiceRoll.fourSidedDieRoll(), "Light Armor, Ud4");
    ItemData.MasonHammer = new Item("Hammer", undefined, "Light Melee Weapon, 1d4 damage");
    ItemData.IronSpikes = new Item("Iron Spikes", DiceRoll.eightSidedDieRoll());
    ItemData.Trowel = new Item("Trowel");
    ItemData.SwordsmithWeapon = new Item("Simple or Heavy Melee Weapon", undefined, "Typically a sword (1d6) or great sword (1d6 or 1d8 if proficient)");
    ItemData.ChainMailArmor = new Item("Chain Mail or Scale Mail Armor", 1, "Medium Armor, Ud6");
    ItemData.BowfletToolChest = new Item("Small tool chest", undefined, "Contains files, fine wood shavers, and hide glue");
    ItemData.Scissors = new Item("Scissors");
    ItemData.FormalWearOutfit = new Item("Formal Wear Outfit", 1, "Shirt, vest, trousers, stockings, hat, belt, and shoes");
    ItemData.Padlock = new Item("Padlock with key");
    // Money Changer / Assayer / Peddler
    ItemData.FancyClothes = new Item("Set of fancy clothes");
    ItemData.Abacus = new Item("Abacus");
    ItemData.LeadStylus = new Item("Lead stylus");
    ItemData.Ledger = new Item("Bound ledger");
    ItemData.MortarPestle = new Item("Mortar & Pestle");
    ItemData.Reagents = new Item("Small kit of reagents");
    ItemData.MerchantBackpack = new Item("Double capacity backpack", undefined, "Holds 1200 coins or 60 lbs");
    ItemData.Baubles = new Item("Baubles and miscellaneous small equipment", 40, "Worth approximately 40 coins");
    // Ambler & Variants
    ItemData.RidingHorse = new Item("Riding Horse", undefined, "Quiet/mild-tempered or hot-blooded/aggressive");
    ItemData.Saddle = new Item("Saddle");
    ItemData.Bridle = new Item("Bridle");
    ItemData.Saddlebags = new Item("Saddlebags with grain", DiceRoll.fourSidedDieRoll());
    ItemData.ChefKnives = new Item("Set of knives");
    ItemData.CuttingBoard = new Item("Cutting board");
    ItemData.FishingString = new Item("Fine, strong string (20')");
    ItemData.BrassHooks = new Item("Brass hooks", DiceRoll.sixSidedDieRoll());
    ItemData.HerderDog = new Item("Small, loyal dog", undefined, "Obeys one word commands.");
    ItemData.OpenWagon = new Item("Open Wagon");
    ItemData.Ponies = new Item("Two mild tempered ponies");
    // Warlock
    ItemData.BlackClothing = new Item("Set of black clothing");
    ItemData.PortableKennel = new Item("Small portable kennel", undefined, "Suitable for your familiar");
    ItemData.FamiliarFeed = new Item("Small sack of feed", DiceRoll.sixSidedDieRoll());
    ItemData.Familiars = [
        new Item("Familiar: Bat"), new Item("Familiar: Black Cat"),
        new Item("Familiar: Rat"), new Item("Familiar: Raven"),
        new Item("Familiar: Snake"), new Item("Familiar: Large Spider")
    ];
    // Thrall & Scoundrel
    ItemData.RaggedClothes = new Item("Ragged and dirty shirt and pants");
    ItemData.Twine = new Item("Twine (3')", undefined, "To keep your pants up.");
    ItemData.Shackles = new Item("Open wooden pillory or pair of iron shackles with chain", undefined, "About 12 inches of chain.");
    ItemData.ScoundrelCloak = new Item("Gray or neutral colored cloak", undefined, "Has long sleeves for concealing items.");
    ItemData.NarrowDaggers = new Item("Narrow daggers", 2, "Light Melee/Ranged (1d4), concealed.");
    // --- Trinkets & Special Items ---
    ItemData.BlackArrow = new Item("Arrow, Black", 1, "At the end of the Encounter, you can always find it within 1d6 turns if you search.", 5);
    ItemData.LuckyCopperCoin = new Item("Coin, Lucky Copper", 1, "It always lands on your mental choice of heads or tails.", 5);
    ItemData.GlowingCrystal = new Item("Crystal, glowing", 1, "This palm sized crystal emits a bluish light continually and can illuminate an area Close when uncovered. The light it emits is unaffected by the Darkness spell.", 20);
    ItemData.CurvedDagger = new Item("Dagger, curved", 1, "It does standard damage (1d4) but has 4 gems worth 10 coins each. If removed, a new gem will take its place after one week.", 40);
    ItemData.BountifulFlask = new Item("Flask, Bountiful", 1, "This copper flask continually refills and always has enough water for two people per day. If a bottle of wine is added it will refill with wine for a week.", 15);
    ItemData.GlassMarbles = new Item("Glass Marbles, dozen", 1, "You can cast marbles as a Standard Action to an area Close. Creatures that move through them must pass a DEX Test or be Down. Marbles Nearby return to their pouch if you hold it open on the ground and concentrate for one minute.", 5);
    ItemData.SilentHammer = new Item("Silent Hammer", 1, "This work hammer has a head made of an unusual, dark black metal. It makes no sound when hammering nails, spikes, or chisels. Hammer (Simple Melee & Ranged, 1d6 damage, Range: Nearby) can also be used as a ranged weapon.", 10);
    ItemData.SkeletonKey = new Item("Key, Skeleton", 1, "This key has a 1 in 4 chance to work on any mundane lock. A failed attempt can be tried again on the same lock the following day.", 20);
    ItemData.FoldingKnife = new Item("Knife with folding blade", 1, "This knife is small and easy to conceal. The blade never dulls and will not break with a Critical Failure. Knife (Light Melee & Ranged, 1d2 damage, Range: Nearby) that can also be thrown.", 10);
    ItemData.FishCharmNecklace = new Item("Leather Necklace with Lucky Fish Charm", 1, "This charm gives you Advantage on your INT Test when fishing or Foraging at a shoreline to increase your rations.", 5);
    ItemData.LuckyDice = new Item("Lucky Dice, pair", 1, "In dice games, once per day you can reroll and take the better result.", 5);
    ItemData.Lodestone = new Item("Lodestone on a leather thong", 1, "The lodestone points north by default but can be attuned to another target you can touch and concentrate on for one minute.", 10);
    ItemData.FloralPerfume = new Item("Perfume, Floral (Ud4)", 1, "When perfume from this vial is applied, you have Advantage on CHA Tests when seeking information or asking for favors. Each application lasts 1 hour.", 5);
    ItemData.InsectRing = new Item("Ring, silver with insect motif", 1, "When you wear this ring, insects avoid you. Any insect type creature must pass a WIS Test to attack you.", 10);
    ItemData.SpiderSilkRope = new Item("Rope, spider silk rope, 100’", 1, "This thin rope can hold the weight of approximately six human-sized beings (1200 lbs). It also never tangles. It takes 8 hp of damage to break/sever.", 15);
    ItemData.RosewoodFlute = new Item("Rosewood flute", 1, "Once per day, when you play this flute as a Standard Action, the GM will reroll on the NPC Reaction Table if you ask.", 10);
    ItemData.MagicSatchel = new Item("Satchel, tooled leather with shoulder strap and silver buckle", 1, "This small satchel has twice the capacity of a backpack. It can hold 60 lbs (1200 coins) but never weighs more than 10 pounds. What is put in the satchel is limited by the size of its mouth (12\" diameter). Living creatures cannot survive in the satchel over 24 hours if it is closed.", 20);
    ItemData.SneezingPowder = new Item("Sneezing powder, packets (Ud6)", 1, "As a Reaction to an opponent being Close, you can blow this powder in their face. If the target fails a CON Ability Test, they will sneeze uncontrollably and have Disadvantage on any Actions until the beginning of your next turn. The powder cannot be used in windy conditions.", 10);
    ItemData.SpringBladeStaff = new Item("Staff, Walking with concealed spring blade", 1, "This walking staff has a concealed spring blade allowing it to be used as a spear. Spear (Simple Melee and Ranged, 1d6 damage, Range: Nearby) can also be used as a ranged weapon.", 10);
    ItemData.JadeMonkeyStatuette = new Item("Lucky Statuette Jade Monkey", 1, "While held, this palm sized statuette gives you Advantage on one INT Ability Test per day.", 10);
    ItemData.Pliers = new Item("Pliers", 1);
    ItemData.FineWoodShavers = new Item("Fine wood shavers", 1);
    ItemData.basicTrinketSection = [
        ItemData.BlackArrow, ItemData.LuckyCopperCoin, ItemData.GlowingCrystal, ItemData.CurvedDagger, ItemData.BountifulFlask,
        ItemData.GlassMarbles, ItemData.SilentHammer, ItemData.SkeletonKey, ItemData.FoldingKnife, ItemData.FishCharmNecklace,
        ItemData.LuckyDice, ItemData.Lodestone, ItemData.FloralPerfume, ItemData.InsectRing, ItemData.SpiderSilkRope,
        ItemData.RosewoodFlute, ItemData.MagicSatchel, ItemData.SneezingPowder, ItemData.SpringBladeStaff, ItemData.JadeMonkeyStatuette
    ];
    // --- Performance & Entertainment ---
    ItemData.PerformanceOutfit = new Item("Performance outfit", 1, "Bright and decorative with bells, sequins, or tassels");
    ItemData.JugglingClubs = new Item("Juggling clubs", 5, "Light Melee & Ranged, 1d4 damage, Range: Nearby");
    ItemData.JesterClub = new Item("Jester's club", 1, "Light Melee, 1d4 damage, decorated with bells");
    ItemData.InstrumentCase = new Item("Leather instrument case");
    ItemData.DisguiseKit = new Item("Disguise Kit", 1, "Small chest with clothes, jewelry, wigs, and makeup");
    // --- Divine & Occult ---
    ItemData.PrayerMat = new Item("Prayer mat");
    ItemData.Candles = new Item("Candles", DiceRoll.sixSidedDieRoll(), "Usage Die: Ud6");
    ItemData.PsalmBook = new Item("Book of psalms/prayers");
    ItemData.ForbiddenBook = new Item("Forbidden book of profane prayers");
    ItemData.CoarseRobe = new Item("Coarse spun robe");
    ItemData.RopeBelt = new Item("Rope belt");
    ItemData.Sandals = new Item("Sandals");
    ItemData.UnholySymbol = new Item("Unholy symbol");
    ItemData.ArcaneTrinkets = new Item("Collection of arcane trinkets");
    ItemData.StrangeBooks = new Item("Books of strange theories");
    // --- Craft & Trade ---
    ItemData.CooperTools = new Item("Cooper tools", 1, "Includes draw knife, dividers, and a planer");
    ItemData.LeatherPunches = new Item("Leather punches and awls");
    ItemData.MasonTrowel = new Item("Mason's trowel");
    ItemData.BrewerTools = new Item("Brewing equipment", 1, "Kettles and fermentation jars");
    ItemData.VintnerTools = new Item("Winemaking equipment");
    ItemData.HerbalistKit = new Item("Herbalist kit", 1, "Pouches and shears for harvesting");
    // --- Labor & Travel ---
    ItemData.SmallVessel = new Item("Small fishing vessel", 1, "Suitable for rivers and coasts");
    ItemData.WagonBolts = new Item("Crossbow bolts", DiceRoll.sixSidedDieRoll(), "Usage Die: Ud6");
    // --- Combat & Weaponry ---
    ItemData.SpikedMaceHoly = new Item("Spiked Mace", 1, "Simple Melee (1d6). Dispenses holy water (Ud4, 1d4 damage).");
    ItemData.HolySymbol = new Item("Holy Symbol");
    ItemData.VariantHolySymbol = new Item("Variant Holy Symbol", 1, "An older or sectarian version of a holy symbol.");
    ItemData.SpearLance = new Item("Spear/Light Lance", 1, "Light Melee (1d6). Includes detachable banner.");
    ItemData.SmallShield = new Item("Small Shield", 1, "Ud4 protection on 1 attack/Round.");
    ItemData.BrassKnuckles = new Item("Brass Knuckles", 1, "1d2+1 damage (or 1d4+1 with Brawler).");
    ItemData.Sap = new Item("Sap", 1, "Simple Melee (1d4). Potential for knockout.");
    // --- Magic & Research ---
    ItemData.ResearchTrunk = new Item("Trunk of Research", 1, "Contains books and notes.");
    ItemData.YewStaff = new Item("Carved Yew Staff", 1, "Simple Melee (1d4).");
    ItemData.AlchemyJournal = new Item("Leather-bound Alchemical Journal", 1, "Partially filled with formulae.");
    ItemData.EyeGoggles = new Item("Glass-lensed Eye Goggles");
    ItemData.SilkScarf = new Item("Silk Scarf", 1, "Protection from chemical inhalation.");
    ItemData.LabGlassware = new Item("Wooden Case of Lab Glassware", 1, "Includes testing agents (Ud8).");
    ItemData.FlashPowder = new Item("Flash Powder", 1, "Usage Die: Ud4.");
    ItemData.CopperDowsingRods = new Item("Copper Dowsing Rods");
    // --- Toolkits & Kits ---
    ItemData.DivinationKit = new Item("Divination Kit", 1, "Dice, cards, small bones, or sticks.");
    ItemData.ShelterKit = new Item("Shelter Kit", 1, "Large sack, 20' rope, 12 stakes, 15x15 water resistant canvas.");
    ItemData.LockPicks = new Item("Lock Picks");
    ItemData.Crowbar = new Item("Crowbar");
    ItemData.GrapplingHook = new Item("Grappling Hook", 1, "Includes 50' of light rope.");
    // --- Misc & Class Specific ---
    ItemData.InquisitorGarb = new Item("Inquisitor Garb", 1, "Special robe and exotic hat.");
    ItemData.Gambeson = new Item("Leather Gambeson", 1, "Light Armor, Ud4.");
    ItemData.FlashyCape = new Item("Flashy Cape");
    ItemData.ThighBoots = new Item("Thigh-high Leather Boots");
    ItemData.DecoratedWand = new Item("Decorated Wand");
    ItemData.GamingSet = new Item("Gaming Set", 1, "Dice, deck of cards, and thimblerig set.");
    ItemData.EmergencyFund = new Item("Emergency Fund", 20, "20 additional starting coins.");
    const none = new SelectionPackage([], [], []);
    // --- Selection Packages ---
    ItemData.DwarfItemSelection = new SelectionPackage([ItemData.Apron, ItemData.Nails, ItemData.Hammer, ItemData.Whiskey, ItemData.Gems], [], []);
    ItemData.ElfItemSelection = new SelectionPackage([ItemData.LinenHaversack, ItemData.ElfRations, ItemData.Wine], [], [ItemData.StandardRations, ItemData.Water]);
    ItemData.HumanItemSelection = new SelectionPackage([ItemData.LinenHaversack, ItemData.WateredWine], [], [ItemData.Water]);
    ItemData.HalflingItemSelection = new SelectionPackage([ItemData.ClayPipe, ItemData.TobaccoPouch, ItemData.WalkingStick, ItemData.Handkerchief, ItemData.Cheese, ItemData.Bread, ItemData.DriedMeat], [new ChoiceGroup(1, [ItemData.BerryWine, ItemData.DarkBeer], [])], [ItemData.StandardRations, ItemData.Water]);
    ItemData.OrcItemSelection = new SelectionPackage([ItemData.OrcArmor, ItemData.Dagger, ItemData.BeltPouch, ItemData.Whetstone, ItemData.Teeth], [], []);
    ItemData.IxianItemSelection = new SelectionPackage([ItemData.LeatherHaversack, ItemData.LeatherGloves], [], []);
    ItemData.JewelerItemSelection = new SelectionPackage([ItemData.Satchel, ItemData.Files, ItemData.Saw], [new ChoiceGroup(1, [ItemData.Ring, ItemData.Bracelet, ItemData.Necklace, ItemData.Pendant], [])], []);
    ItemData.BarbarianItemSelection = new SelectionPackage([ItemData.FurArmor, ItemData.FacePaint], [
        new ChoiceGroup(1, [ItemData.Mushrooms, ItemData.SpecialLeaves], []),
        new ChoiceGroup(1, [ItemData.BarbSword, ItemData.BarbAxe, ItemData.BarbMace, ItemData.BarbGreatSword], [])
    ], []);
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
            ItemData.CrossbowWithBolts, ItemData.DaggerRanged, ItemData.Javelins, ItemData.ShortBowWithArrows, ItemData.SlingWithStones, ItemData.SpearRanged
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
        "Free Laborer": new SelectionPackage([ItemData.RidingHorse, ItemData.Saddle, ItemData.Bridle, ItemData.Saddlebags], [], []),
        "Apprentice Crafter": new SelectionPackage([ItemData.SmithTools, ItemData.SteelDagger], [], []),
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
        "Touched/Anchorite": new SelectionPackage([ItemData.PrayerMat, ItemData.Candles, ItemData.HolySymbol, new Item("Prayer Beads")], [], [ItemData.TravelingClothes, ItemData.LeatherBelt, ItemData.LeatherBoots]),
        Armiger: new SelectionPackage([ItemData.RidingHorse, ItemData.Saddle, ItemData.Saddlebags, ItemData.Saddlebags, ItemData.SpearLance], [
            new ChoiceGroup(1, [ItemData.Gambeson, ItemData.SmallShield], []),
            new ChoiceGroup(1, [ItemData.Sword, ItemData.Axe, ItemData.BarbMace, ItemData.BarbGreatSword, new Item("Warhammer", 1, "1d8"), new Item("Battle Axe", 1, "1d8")], [])
        ], []),
        Barbarian: ItemData.BarbarianItemSelection,
        "Mercenary/Hedge": new SelectionPackage([], [
            new ChoiceGroup(1, [ItemData.Gambeson, ItemData.SmallShield], []),
            new ChoiceGroup(1, [ItemData.Sword, ItemData.Axe, ItemData.BarbMace, ItemData.BarbGreatSword, new Item("Warhammer", 1, "1d8"), new Item("Battle Axe", 1, "1d8")], [])
        ], []),
        Prizefighter: new SelectionPackage([ItemData.BrassKnuckles], [], []),
        "Ruffian/Enforcer": new SelectionPackage([], [new ChoiceGroup(1, [ItemData.BrassKnuckles, ItemData.Sap], [])], []),
        "Woodard/Warden": new SelectionPackage([ItemData.ShelterKit], [], []),
        "Adept/Arcane Apprentice": new SelectionPackage([ItemData.ResearchTrunk, ItemData.YewStaff], [], []),
        "Alchemy Apprentice": new SelectionPackage([ItemData.Ink, ItemData.Quill, ItemData.AlchemyJournal, ItemData.EyeGoggles, ItemData.SilkScarf, ItemData.LabGlassware], [], []),
        "Arcane Researcher": new SelectionPackage([ItemData.Ink, ItemData.Quill, new Item("Arcane Research Book")], [], []),
        Charlatan: new SelectionPackage([ItemData.FlashyCape, ItemData.ThighBoots, ItemData.DecoratedWand, new Item("Divination Cards"), ItemData.FlashPowder], [], []),
        Dowser: new SelectionPackage([ItemData.CopperDowsingRods], [], []),
        Warlock: new SelectionPackage([ItemData.BlackClothing, ItemData.PortableKennel, ItemData.FamiliarFeed], [new ChoiceGroup(1, ItemData.Familiars, [])], []),
        Fence: new SelectionPackage([ItemData.Satchel, ItemData.Abacus, ItemData.LeadStylus, ItemData.Ledger, ItemData.EmergencyFund], [], []),
        Gambler: new SelectionPackage([ItemData.GamingSet], [], []),
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
        [JobSubsetEnum.Smith]: new SelectionPackage([ItemData.SmithTools, ItemData.SteelDagger], [], []),
        [JobSubsetEnum.Carpenter]: new SelectionPackage([ItemData.Mallet, ItemData.Adze, ItemData.WoodPlaner, ItemData.Level], [], []),
        [JobSubsetEnum.MoneyChanger]: new SelectionPackage([ItemData.FancyClothes, ItemData.Abacus, ItemData.LeadStylus, ItemData.Ledger], [], []),
        [JobSubsetEnum.Ambler]: new SelectionPackage([ItemData.RidingHorse, ItemData.Saddle, ItemData.Bridle, ItemData.Saddlebags], [], []),
        [JobSubsetEnum.Chef]: new SelectionPackage([ItemData.ChefKnives, ItemData.CuttingBoard, ItemData.MortarPestle], [], []),
        // Laborer & Service Subsets
        [JobSubsetEnum.HouseServant]: none,
        [JobSubsetEnum.Farmhand]: none,
        [JobSubsetEnum.Laborer]: none,
        [JobSubsetEnum.Sailor]: none,
        [JobSubsetEnum.Brewer]: new SelectionPackage([ItemData.BrewerTools], [], []),
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
        [JobSubsetEnum.BurglarSpecialist]: new SelectionPackage([ItemData.LockPicks, ItemData.Crowbar, ItemData.GrapplingHook], [], []),
        [JobSubsetEnum.ThreeTrinketRandom]: none,
        [JobSubsetEnum.OneTrinketChoice]: none,
        // Additional Artisan subsets
        [JobSubsetEnum.Armorer]: new SelectionPackage([ItemData.SmithTools, ItemData.ChainMailArmor], [], []),
        [JobSubsetEnum.Bowyer]: new SelectionPackage([ItemData.BowfletToolChest, ItemData.ShortBowWithArrows], [], []),
        [JobSubsetEnum.Fletcher]: new SelectionPackage([ItemData.BowfletToolChest, ItemData.ShortBowWithArrows], [], []),
        [JobSubsetEnum.Tailor]: new SelectionPackage([ItemData.Apron, ItemData.Scissors, ItemData.FormalWearOutfit], [], []),
        [JobSubsetEnum.Locksmith]: new SelectionPackage([ItemData.Files, ItemData.Saw, ItemData.MasonHammer, ItemData.Padlock, ItemData.LockPicks], [], []),
        // Additional Crafter subsets
        [JobSubsetEnum.Cooper]: new SelectionPackage([ItemData.Mallet, ItemData.WideAx, ItemData.DrawKnife, ItemData.Dividers, ItemData.WoodPlaner, ItemData.Cart, ItemData.Mule], [], []),
        [JobSubsetEnum.Leatherworker]: new SelectionPackage([ItemData.LeatherKit, ItemData.TannedLeather, ItemData.LeatherArmorRoll], [], []),
        [JobSubsetEnum.Mason]: new SelectionPackage([ItemData.MasonHammer, ItemData.IronSpikes, ItemData.Trowel, ItemData.Level], [], []),
        [JobSubsetEnum.Swordsmith]: new SelectionPackage([ItemData.SwordsmithWeapon], [], []),
        // Additional Mercantiler subsets
        [JobSubsetEnum.Assayer]: new SelectionPackage([ItemData.MortarPestle, ItemData.Reagents], [], []),
        [JobSubsetEnum.Herbalist]: new SelectionPackage([ItemData.HerbalistKit], [], []),
        [JobSubsetEnum.Peddler]: new SelectionPackage([ItemData.MerchantBackpack, ItemData.Baubles], [], []),
        // Additional Laborer subsets
        [JobSubsetEnum.Fisher]: new SelectionPackage([ItemData.FishingString, ItemData.BrassHooks], [], []),
        [JobSubsetEnum.Wagoner]: new SelectionPackage([ItemData.OpenWagon, ItemData.Ponies, ItemData.Crossbow, ItemData.Bolts], [], []),
    };
})(ItemData || (ItemData = {}));
