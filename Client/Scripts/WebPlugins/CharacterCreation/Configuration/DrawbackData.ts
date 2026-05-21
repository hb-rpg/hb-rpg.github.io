import { Utility } from "../../../WebCore/Utility.js";
import { Drawbacks } from "../Contracts/Drawbacks.js";
import { JobSubsetEnum, JobType, RaceType } from "../Contracts/StringTypes.js";
import { ChoiceGroup, SelectionPackage } from "../Contracts/TaggedData.js";

export namespace DrawbackData {

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
    export const GamblerDrawbackOptions: Drawbacks[] = [
        AddictionAlcohol, AddictionTobacco, AddictionPsychoactive,
        CompulsionGambling, CompulsionGambling,
        CompulsionKleptomania, CompulsionPyromania,
        Insomnia, Spendthrift, Wanted,
    ];

    export const AllDrawbacks: Drawbacks[] = [
        ProfaneAspect, Outlander, Youth,
        AddictionAlcohol, AddictionTobacco, AddictionPsychoactive,
        CompulsionGambling, CompulsionKleptomania, CompulsionPyromania,
        Insomnia, Spendthrift, Wanted,
    ];

    // --- Selection Packages ---

    export const none = new SelectionPackage<Drawbacks>([], [], []);

    const IxianDrawbackSelection = new SelectionPackage<Drawbacks>(
        [ProfaneAspect], [], []
    );

    const BarbarianDrawbackSelection = new SelectionPackage<Drawbacks>(
        [Outlander], [], []
    );

    // Roll 1d10 twice, player picks one of the two results
    const GamblerDrawbackSelection = new SelectionPackage<Drawbacks>(
        [], [new ChoiceGroup(1, [Utility.RandomElement(GamblerDrawbackOptions), Utility.RandomElement(GamblerDrawbackOptions)], [])],
        []
    );

    const StreetUrchinDrawbackSelection = new SelectionPackage<Drawbacks>(
        [Youth], [], []
    );

    // --- Records ---

    export const RaceRecord: Record<RaceType, SelectionPackage<Drawbacks>> = {
        Dwarf:    none,
        Elf:      none,
        Orc:      none,
        Ixian:    IxianDrawbackSelection,
        Human:    none,
        Halfling: none,
    };

    export const JobTypeToDrawback: Record<JobType, SelectionPackage<Drawbacks>> = {
        "Apprentice Artisan":       none,
        "Apprentice Bureaucrat":    none,
        "Free Laborer":             none,
        "Apprentice Crafter":       none,
        "Apprentice Mercantiler":   none,
        "Escaped Peasant/Thrall":   none,
        Acrobat:                    none,
        Contortionist:              none,
        Jester:                     none,
        Minstrel:                   none,
        "Storyteller/Thespian":     none,
        Scholar:                    none,
        Accursed:                   none,
        Acolyte:                    none,
        Cultist:                    none,
        Inquisitor:                 none,
        Pariah:                     none,
        "Touched/Anchorite":        none,
        Armiger:                    none,
        Barbarian:                  BarbarianDrawbackSelection,
        "Mercenary/Hedge":          none,
        Prizefighter:               none,
        "Ruffian/Enforcer":         none,
        "Woodard/Warden":           none,
        "Adept/Arcane Apprentice":  none,
        "Alchemy Apprentice":       none,
        "Arcane Researcher":        none,
        Charlatan:                  none,
        Dowser:                     none,
        Warlock:                    none,
        Fence:                      none,
        Gambler:                    GamblerDrawbackSelection,
        Scoundrel:                  none,
        Sharp:                      none,
        Spy:                        none,
        "Street Urchin":            StreetUrchinDrawbackSelection,
    };

    export const JobSubsetToDrawback: Record<JobSubsetEnum, SelectionPackage<Drawbacks>> = {
        [JobSubsetEnum.None]:               none,
        [JobSubsetEnum.Jeweler]:            none,
        [JobSubsetEnum.Arbalist]:           none,
        [JobSubsetEnum.Scrivener]:          none,
        [JobSubsetEnum.Advocate]:           none,
        [JobSubsetEnum.Cartographer]:       none,
        [JobSubsetEnum.Inspector]:          none,
        [JobSubsetEnum.Interpreter]:        none,
        [JobSubsetEnum.Smith]:              none,
        [JobSubsetEnum.Carpenter]:          none,
        [JobSubsetEnum.MoneyChanger]:       none,
        [JobSubsetEnum.Ambler]:             none,
        [JobSubsetEnum.Chef]:               none,
        [JobSubsetEnum.HouseServant]:       none,
        [JobSubsetEnum.Farmhand]:           none,
        [JobSubsetEnum.Laborer]:            none,
        [JobSubsetEnum.Sailor]:             none,
        [JobSubsetEnum.Brewer]:             none,
        [JobSubsetEnum.Farmer]:             none,
        [JobSubsetEnum.Herder]:             none,
        [JobSubsetEnum.Vintner]:            none,
        [JobSubsetEnum.Oratory]:            none,
        [JobSubsetEnum.Theology]:           none,
        [JobSubsetEnum.Esoterica]:          none,
        [JobSubsetEnum.ActiveService]:      none,
        [JobSubsetEnum.Freelance]:          none,
        [JobSubsetEnum.LordSlain]:          none,
        [JobSubsetEnum.Disgraced]:          none,
        [JobSubsetEnum.HedgeKnight]:        none,
        [JobSubsetEnum.Mercenary]:          none,
        [JobSubsetEnum.Bandit]:             none,
        [JobSubsetEnum.Discharged]:         none,
        [JobSubsetEnum.IxianRaver]:         none,
        [JobSubsetEnum.IxianArchon]:        none,
        [JobSubsetEnum.Dragon]:             none,
        [JobSubsetEnum.Lich]:               none,
        [JobSubsetEnum.Wizard]:             none,
        [JobSubsetEnum.ElderGod]:           none,
        [JobSubsetEnum.Moloch]:             none,
        [JobSubsetEnum.Kain]:               none,
        [JobSubsetEnum.DisguiseSpecialist]: none,
        [JobSubsetEnum.BurglarSpecialist]:  none,
        [JobSubsetEnum.ThreeTrinketRandom]: none,
        [JobSubsetEnum.OneTrinketChoice]:   none,
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
    };
}
