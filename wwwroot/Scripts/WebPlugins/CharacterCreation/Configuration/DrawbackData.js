import { Utility } from "../../../WebCore/Utility.js";
import { Drawbacks } from "../Contracts/Drawbacks.js";
import { JobSubsetEnum } from "../Contracts/StringTypes.js";
import { ChoiceGroup, SelectionPackage } from "../Contracts/TaggedData.js";
export var DrawbackData;
(function (DrawbackData) {
    // --- Ancestry Drawbacks ---
    const ProfaneAspect = new Drawbacks("Profane Aspect", "Ancestry", "You are more susceptible to divine spells and detection. Non-Ixian commoners who see expressions of your Infernal Heritage (horns, hooves, tail, wings, etc.) or are aware of it are fearful, causing you to have Disadvantage on all CHA Tests involving interactions with them other than intimidation. You have Advantage on CHA Tests to intimidate those who can see or are aware of your Infernal Heritage. Interactions with spellcasters & those who know you personally will be unaffected by your condition.");
    // --- Background Drawbacks ---
    const Outlander = new Drawbacks("Outlander", "Background", "You have difficulties dealing with commoners in \"civilized\" areas until you learn some couth and wash regularly (and reach 3rd level). Conversely, you can often be successful in some dealings with commoners through intimidation. You are also typically better when dealing with barbarians from the region of your origin sometimes even if you are traditional enemies because they are happy to see a familiar face.");
    const Youth = new Drawbacks("Youth", "Background", "You are an adolescent who is not fully developed for this dangerous world. Choose or roll 1d6 twice for adjustments to your Ability Scores.");
    // --- Addiction Drawbacks ---
    const AddictionAlcohol = new Drawbacks("Addiction, Alcohol", "Addiction", "You need to drink every day and it is typically to excess.");
    const AddictionTobacco = new Drawbacks("Addiction, Tobacco", "Addiction", "You need to smoke every day and have trouble with endurance activities.");
    const AddictionPsychoactive = new Drawbacks("Addiction, Psychoactive Substances", "Addiction", "You need to get high daily but then do not make good decisions.");
    // --- Compulsion Drawbacks ---
    const CompulsionGambling = new Drawbacks("Compulsion, Gambling", "Compulsion", "You must gamble or make a wager every day or have trouble thinking.");
    const CompulsionKleptomania = new Drawbacks("Compulsion, Kleptomania", "Compulsion", "You must steal or palm something every day or have trouble thinking.");
    const CompulsionPyromania = new Drawbacks("Compulsion, Pyromania", "Compulsion", "You must ignite something that is not yours every day or be distracted.");
    // --- Condition Drawbacks ---
    const Insomnia = new Drawbacks("Insomnia", "Condition", "You have trouble sleeping and even when you do, it is often not restorative.");
    const Spendthrift = new Drawbacks("Spendthrift", "Condition", "You are loose with your money and tend to overpay and undersell things.");
    const Wanted = new Drawbacks("Wanted", "Condition", "You are wanted for a crime or large outstanding debt that may or may not be yours.");
    // --- Lists ---
    // Weighted to match the 1d10 table (rolls 4-5 both map to CompulsionGambling)
    DrawbackData.GamblerDrawbackOptions = [
        AddictionAlcohol, AddictionTobacco, AddictionPsychoactive,
        CompulsionGambling, CompulsionGambling,
        CompulsionKleptomania, CompulsionPyromania,
        Insomnia, Spendthrift, Wanted,
    ];
    DrawbackData.AllDrawbacks = [
        ProfaneAspect, Outlander, Youth,
        AddictionAlcohol, AddictionTobacco, AddictionPsychoactive,
        CompulsionGambling, CompulsionKleptomania, CompulsionPyromania,
        Insomnia, Spendthrift, Wanted,
    ];
    // --- Selection Packages ---
    DrawbackData.none = new SelectionPackage([], [], []);
    const IxianDrawbackSelection = new SelectionPackage([ProfaneAspect], [], []);
    const BarbarianDrawbackSelection = new SelectionPackage([Outlander], [], []);
    // Roll 1d10 twice, player picks one of the two results
    const GamblerDrawbackSelection = new SelectionPackage([], [new ChoiceGroup(1, [Utility.RandomElement(DrawbackData.GamblerDrawbackOptions), Utility.RandomElement(DrawbackData.GamblerDrawbackOptions)], [])], []);
    const StreetUrchinDrawbackSelection = new SelectionPackage([Youth], [], []);
    // --- Records ---
    DrawbackData.RaceRecord = {
        Dwarf: DrawbackData.none,
        Elf: DrawbackData.none,
        Orc: DrawbackData.none,
        Ixian: IxianDrawbackSelection,
        Human: DrawbackData.none,
        Halfling: DrawbackData.none,
    };
    DrawbackData.JobTypeToDrawback = {
        "Apprentice Artisan": DrawbackData.none,
        "Apprentice Bureaucrat": DrawbackData.none,
        "Free Laborer": DrawbackData.none,
        "Apprentice Crafter": DrawbackData.none,
        "Apprentice Mercantiler": DrawbackData.none,
        "Escaped Peasant/Thrall": DrawbackData.none,
        Acrobat: DrawbackData.none,
        Contortionist: DrawbackData.none,
        Jester: DrawbackData.none,
        Minstrel: DrawbackData.none,
        "Storyteller/Thespian": DrawbackData.none,
        Scholar: DrawbackData.none,
        Accursed: DrawbackData.none,
        Acolyte: DrawbackData.none,
        Cultist: DrawbackData.none,
        Inquisitor: DrawbackData.none,
        Pariah: DrawbackData.none,
        "Touched/Anchorite": DrawbackData.none,
        Armiger: DrawbackData.none,
        Barbarian: BarbarianDrawbackSelection,
        "Mercenary/Hedge": DrawbackData.none,
        Prizefighter: DrawbackData.none,
        "Ruffian/Enforcer": DrawbackData.none,
        "Woodard/Warden": DrawbackData.none,
        "Adept/Arcane Apprentice": DrawbackData.none,
        "Alchemy Apprentice": DrawbackData.none,
        "Arcane Researcher": DrawbackData.none,
        Charlatan: DrawbackData.none,
        Dowser: DrawbackData.none,
        Warlock: DrawbackData.none,
        Fence: DrawbackData.none,
        Gambler: GamblerDrawbackSelection,
        Scoundrel: DrawbackData.none,
        Sharp: DrawbackData.none,
        Spy: DrawbackData.none,
        "Street Urchin": StreetUrchinDrawbackSelection,
    };
    DrawbackData.JobSubsetToDrawback = {
        [JobSubsetEnum.None]: DrawbackData.none,
        [JobSubsetEnum.Jeweler]: DrawbackData.none,
        [JobSubsetEnum.Arbalist]: DrawbackData.none,
        [JobSubsetEnum.Scrivener]: DrawbackData.none,
        [JobSubsetEnum.Advocate]: DrawbackData.none,
        [JobSubsetEnum.Cartographer]: DrawbackData.none,
        [JobSubsetEnum.Inspector]: DrawbackData.none,
        [JobSubsetEnum.Interpreter]: DrawbackData.none,
        [JobSubsetEnum.RatCatcher]: DrawbackData.none,
        [JobSubsetEnum.Smith]: DrawbackData.none,
        [JobSubsetEnum.Carpenter]: DrawbackData.none,
        [JobSubsetEnum.MoneyChanger]: DrawbackData.none,
        [JobSubsetEnum.Ambler]: DrawbackData.none,
        [JobSubsetEnum.Chef]: DrawbackData.none,
        [JobSubsetEnum.HouseServant]: DrawbackData.none,
        [JobSubsetEnum.Farmhand]: DrawbackData.none,
        [JobSubsetEnum.Laborer]: DrawbackData.none,
        [JobSubsetEnum.Sailor]: DrawbackData.none,
        [JobSubsetEnum.Brewer]: DrawbackData.none,
        [JobSubsetEnum.Farmer]: DrawbackData.none,
        [JobSubsetEnum.Herder]: DrawbackData.none,
        [JobSubsetEnum.Vintner]: DrawbackData.none,
        [JobSubsetEnum.Oratory]: DrawbackData.none,
        [JobSubsetEnum.Theology]: DrawbackData.none,
        [JobSubsetEnum.Esoterica]: DrawbackData.none,
        [JobSubsetEnum.ActiveService]: DrawbackData.none,
        [JobSubsetEnum.Freelance]: DrawbackData.none,
        [JobSubsetEnum.LordSlain]: DrawbackData.none,
        [JobSubsetEnum.Disgraced]: DrawbackData.none,
        [JobSubsetEnum.HedgeKnight]: DrawbackData.none,
        [JobSubsetEnum.Mercenary]: DrawbackData.none,
        [JobSubsetEnum.Bandit]: DrawbackData.none,
        [JobSubsetEnum.Discharged]: DrawbackData.none,
        [JobSubsetEnum.IxianRaver]: DrawbackData.none,
        [JobSubsetEnum.IxianArchon]: DrawbackData.none,
        [JobSubsetEnum.Dragon]: DrawbackData.none,
        [JobSubsetEnum.Lich]: DrawbackData.none,
        [JobSubsetEnum.Wizard]: DrawbackData.none,
        [JobSubsetEnum.ElderGod]: DrawbackData.none,
        [JobSubsetEnum.Moloch]: DrawbackData.none,
        [JobSubsetEnum.Kain]: DrawbackData.none,
        [JobSubsetEnum.DisguiseSpecialist]: DrawbackData.none,
        [JobSubsetEnum.BurglarSpecialist]: DrawbackData.none,
        [JobSubsetEnum.ThreeTrinketRandom]: DrawbackData.none,
        [JobSubsetEnum.OneTrinketChoice]: DrawbackData.none,
        [JobSubsetEnum.Armorer]: DrawbackData.none,
        [JobSubsetEnum.Bowyer]: DrawbackData.none,
        [JobSubsetEnum.Fletcher]: DrawbackData.none,
        [JobSubsetEnum.Tailor]: DrawbackData.none,
        [JobSubsetEnum.Locksmith]: DrawbackData.none,
        [JobSubsetEnum.Cooper]: DrawbackData.none,
        [JobSubsetEnum.Leatherworker]: DrawbackData.none,
        [JobSubsetEnum.Mason]: DrawbackData.none,
        [JobSubsetEnum.Swordsmith]: DrawbackData.none,
        [JobSubsetEnum.Assayer]: DrawbackData.none,
        [JobSubsetEnum.Herbalist]: DrawbackData.none,
        [JobSubsetEnum.Peddler]: DrawbackData.none,
        [JobSubsetEnum.Fisher]: DrawbackData.none,
        [JobSubsetEnum.Wagoner]: DrawbackData.none,
    };
})(DrawbackData || (DrawbackData = {}));
