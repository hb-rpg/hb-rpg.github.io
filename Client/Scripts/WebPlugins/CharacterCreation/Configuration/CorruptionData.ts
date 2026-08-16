import { Utility } from "../../../WebCore/Utility.js";
import { Corruption, CorruptionAffliction, CorruptionSeverity } from "../Contracts/Corruption.js";
import { JobSubsetEnum, JobType } from "../Contracts/StringTypes.js";
import { ChoiceGroup, SelectionPackage } from "../Contracts/TaggedData.js";
import { DiceRoll } from "../Utility/DiceRoll.js";

// --- Afflictions ---
export namespace CorruptionData {

    const Mist = new CorruptionAffliction("Mist", "A stationary mist forms around you that has a ghostly glow and obscured, tortured faces that are silently speaking. Within 2 turns, the mist obscures you and everything Nearby you from all but magic vision. A strong wind will disperse the mist temporarily or you can walk away from it and are momentarily clear until it returns. Melee attacks against those obscured by the mist are at Disadvantage. All missile attacks and damage against those obscured by the mist are at Disadvantage.");
    const OvergrownArms = new CorruptionAffliction("Overgrown Features: Arms", "Your arms reach down to your ankles. Your Halfing and other short friends always ask you to get things on the top shelf for them or to pass the potatoes at dinner. When the growth starts, constraining clothing will probably need to be removed quickly or you will receive 1d4 damage. Custom clothing to accommodate your enlarged body parts costs x2.");
    const OvergrownEars = new CorruptionAffliction("Overgrown Features: Ears", "Your ears are triple normal size but you receive Advantage on INT and WIS Tests where hearing is a factor. When the growth starts, constraining clothing will probably need to be removed quickly or you will receive 1d4 damage. Custom clothing to accommodate your enlarged body parts costs x2.");
    const AcidExcretions = new CorruptionAffliction("Acid Excretions", "Your sweat is highly acidic and damages anything you touch. You cause damage or pain to anyone or anything you touch with your bare hands or skin. Anything you wear or are in skin contact with for an extended amount of time will need to be replaced after one week. You can wear gloves that need to be replaced weekly to protect possessions you touch. Expensive alkaline substances can be purchased (20 coins/week) and if applied regularly can mitigate the effects. Your touch causes 1 point of damage per hour to anything you touch.");
    const ClovenHooves = new CorruptionAffliction("Cloven Hooves", "Your feet are replaced with black, cloven hooves. If you already have cloven hooves (as some Ixian and other creatures do), reroll this result.");
    const GlowingEyes = new CorruptionAffliction("Glowing Eyes", "Your eyes glow a bright color of your choice and may even cycle through colors. The light is bright enough to illuminate everything Near and make it difficult for you to hide, even in shadows.");
    const FungoidInfection = new CorruptionAffliction("Fungoid Infection", "Waves of fungal fruiting bodies erupt across your body every few hours. Spores are released when the caps open. Lesions also appear every few hours and emit spores when ruptured. The eruptions are painful but do not incapacitate you. You smell moldy constantly and organic possessions and items that are Near you for over a few hours become moldy and will be ruined within a week if not cleaned. Constant washing and exposure to sun and dry air mitigate the results for a few hours. Characters with the Drawback, Mold Alergy, give you a wide berth.");
    const Hairless = new CorruptionAffliction("Hairless", "All hair on your body falls out. If this Corruption is not permanent, the hair will regrow in one month after the effect of the Corruption abates.");
    const Hirsute = new CorruptionAffliction("Hirsute", "Within a day, you grow thick hair of a color of your choice from every part of your skin. The hair needs to be intensely trimmed and shaved at least once a week or it begins limiting your mobility, ability to grasp things, eyesight, and hearing. This will give you Disadvantage on most actions. If not maintained, you can become immobile within 3 months and you could potentially die within 6 months.");
    const Horns = new CorruptionAffliction("Horns", "Horns begin growing out of your head. If you already have horns (as some Ixian and other creatures do), you may reroll this result. They can be straight and taper to sharp points or spiral. Removal of your horns by grinding or cutting them down to the quick is extremely painful and causes 2 points of damage that does not heal until after a Full Rest when the horns will completely regenerate. If you headbut someone, your horns cause an additional 1 point of damage for every 2 of your Levels. You can only wear headgear that is modified to accommodate your horns.");
    const OvergrownFeet = new CorruptionAffliction("Overgrown Features: Feet", "Your feet are twice as wide and long as normal. You will need to get custom footwear. When the growth starts, constraining clothing will probably need to be removed quickly or you will receive 1d4 damage. Custom clothing to accommodate your enlarged body parts costs x2.");
    const OvergrownFingers = new CorruptionAffliction("Overgrown Features: Fingers", "Your fingers become twice as long as normal but function normally otherwise. When the growth starts, constraining clothing will probably need to be removed quickly or you will receive 1d4 damage. Custom clothing to accommodate your enlarged body parts costs x2.");
    const OvergrownLegs = new CorruptionAffliction("Overgrown Features: Legs", "Your legs grow to double their normal length. You walk slightly faster now and have to take smaller steps for others to keep up. When the growth starts, constraining clothing will probably need to be removed quickly or you will receive 1d4 damage. Custom clothing to accommodate your enlarged body parts costs x2.");
    const OvergrownNose = new CorruptionAffliction("Overgrown Features: Nose", "Your nose grows to triple its normal size and your olfactory sense is improved. You receive Advantage on INT and WIS Tests where smell is a factor. When the growth starts, constraining clothing will probably need to be removed quickly or you will receive 1d4 damage. Custom clothing to accommodate your enlarged body parts costs x2.");
    const Paranoia = new CorruptionAffliction("Paranoia", "At least once every session, the GM will ask you and your companions to roll Initiative that will secretly be for no reason and give you misleading insights or suspicious observations. If you investigate them, only a Critical Success on a related Ability Test will dispel a false suspicion. You also regularly have disturbing dreams of alien beings sitting around a table controlling you and the world you inhabit.");
    const ExtraplanarAttention = new CorruptionAffliction("Extraplanar Attention", "You have drawn an unhealthy amount of interest and attention of a powerful but playful, extraplanar, divine or profane creature. Roll 1d6 to determine the type (1: Celestial Reaver, 2-3: Celestial Archon, 4-5: Ixian Archon, 6: Ixian Raver). Their interference and obsession with you does not follow the typical durations shown in Corruption Severity. Instead, apply that d6 roll to the following effects: 1: Daily Aid/Hinder. 2: Weekly Generosity/Spite. 3: Twinsies. 4: Jealousy. 5: Lesson. 6: Rapture.");
    const SmellAmmonia = new CorruptionAffliction("Smell: Ammonia", "Your body exudes a strong odor that is easy for anyone Close to you to detect. The smell permeates your possessions and lingers even after you are gone. It is virtually impossible to mask with washing or perfume. Creatures who track you using scent have Advantage.");
    const SmellBrimstone = new CorruptionAffliction("Smell: Brimstone/Sulfur", "Your body exudes a strong odor that is easy for anyone Close to you to detect. The smell permeates your possessions and lingers even after you are gone. It is virtually impossible to mask with washing or perfume. Creatures who track you using scent have Advantage.");
    const SmellLavender = new CorruptionAffliction("Smell: Lavender", "Your body exudes a strong odor that is easy for anyone Close to you to detect. The smell permeates your possessions and lingers even after you are gone. It is virtually impossible to mask with washing or perfume. Creatures who track you using scent have Advantage. Does not alarm commoners.");
    const SmellRottedMeat = new CorruptionAffliction("Smell: Rotten Meat", "Your body exudes a strong odor that is easy for anyone Close to you to detect. The smell permeates your possessions and lingers even after you are gone. It is virtually impossible to mask with washing or perfume. Creatures who track you using scent have Advantage.");
    const SmellRosemary = new CorruptionAffliction("Smell: Rosemary", "Your body exudes a strong odor that is easy for anyone Close to you to detect. The smell permeates your possessions and lingers even after you are gone. It is virtually impossible to mask with washing or perfume. Creatures who track you using scent have Advantage. Does not alarm commoners.");
    const SmellSandalwood = new CorruptionAffliction("Smell: Sandalwood", "Your body exudes a strong odor that is easy for anyone Close to you to detect. The smell permeates your possessions and lingers even after you are gone. It is virtually impossible to mask with washing or perfume. Creatures who track you using scent have Advantage. Does not alarm commoners.");
    const ScalySkin = new CorruptionAffliction("Scaly Skin", "Your skin becomes unnaturally ridged and scaly like a reptile. It can be any color of your choice but is typically an almost neon red, orange, blue, or green. Its toughness does not stack with other armor but your scaly hide is as effective as Light Armor (Ud4). Once the Usage Die is depleted for your scaly hide, it will not act as armor again until it regenerates after a Full Rest.");
    const Skeletal = new CorruptionAffliction("Skeletal", "A portion of your body has exposed bone. The tissue that covers and attaches to the bone is ethereal but still functions to keep the affected portion of the body working. Roll 1d6 to determine the body part: 1 - Left Arm, 2- Right Arm, 3 - Left Leg, 4 - Right Leg, 5 - Torso, 6 - Head. Helmets, hats, gloves, boots, or clothing for the affected body part will need special padding or straps to stay on securely.");
    const Spiky = new CorruptionAffliction("Spiky", "Thick, 4\" long spikes grow from your head, shoulders, back, and the tops of your hands. Removal of your spikes or cutting them down to the quick is extremely painful and causes 2 points of damage that does not heal until after a Full Rest when the spikes will completely regenerate. With these spikes, your unarmed attacks cause +1 point of damage for every 2 of your Levels. You require modified clothing and armor that costs x2.");
    const TranslucentSkin = new CorruptionAffliction("Translucent Skin", "Your skin is transparent making your veins, arteries, muscles, and bones visible. Extended exposure to intense sunlight is painful and any damage it would inflict is doubled.");
    const WartySkin = new CorruptionAffliction("Warty Skin", "Your body is covered with large knobby and warty protrusions with skin discoloration. They are an uncomfortable cosmetic disfiguration. If removed, they will regenerate at your next Full Rest.");
    const WebbedDigits = new CorruptionAffliction("Webbed Digits", "You grow a translucent membrane between your fingers and toes. Your swimming movement rate is doubled.");
    const WeepingBlood = new CorruptionAffliction("Weeping Blood", "Blood leaks from the ducts of both of your eyes. It is uncomfortable and stains your clothes but is otherwise just a nuisance. This condition is also known as the \"Mark of Moloch\". You will receive Advantage on interaction CHA Tests and the NPC Reaction Table in your first encounter with any followers Moloch and minotaurs.");
    const WeepingSores = new CorruptionAffliction("Weeping Sores", "Oozing and crusty sores and lesions appear on your face and body. They are uncomfortable and stain your clothing but are otherwise just a nuisance.");
    const SpinyDarts = new CorruptionAffliction("Spiny Darts", "Thin, stiff, 6\" spines grow from your head, shoulders, back, and the tops of your hands. If cut off, they will regrow at your next Full Rest. Unmodified clothing you wear is quickly destroyed and costs x2 to replace. You cannot wear armor or helmets though you can use a shield. You can shoot a spine (d4) as a Reaction to anyone Nearby.");
    
    // --- Severities ---
    
    const Temporary = new CorruptionSeverity("Temporary", "The Corruption is temporary and lasts until your next Full Rest or a Remove Curse spell.");
    const ShortTerm = new CorruptionSeverity("Short-term", "The Corruption is temporary and lasts 3d6 days.");
    const Daily = new CorruptionSeverity("Daily", "The Corruption recurs daily and lasts 12 hours*, from noon until midnight.");
    const MoonReaction = new CorruptionSeverity("Moon Reaction", "The Corruption lasts 24 hours* (day and night) of a full moon, 12 times a year.");
    const StressReaction = new CorruptionSeverity("Stress Reaction", "The Corruption can be triggered by stressful events. Once per Encounter, when you have to roll Initiative, roll a CON Test also.  If you fail the CON Test, the Corruption Effects emerge and last 24 hours.");
    const Permanent = new CorruptionSeverity("Permanent", "The Corruption is permanent. Remove Curse will suppress the effects for 24 hours.");
    
    // --- Lists ---
    
    export const CorruptionData: CorruptionAffliction[] = [
        Mist, OvergrownArms, OvergrownEars, AcidExcretions, ClovenHooves, GlowingEyes,
        FungoidInfection, Hairless, Hirsute, Horns, OvergrownFeet, OvergrownFingers,
        OvergrownLegs, OvergrownNose, Paranoia, ExtraplanarAttention, SmellAmmonia,
        SmellBrimstone, SmellLavender, SmellRottedMeat, SmellRosemary, SmellSandalwood,
        ScalySkin, Skeletal, Spiky, TranslucentSkin, WartySkin, WebbedDigits,
        WeepingBlood, WeepingSores, SpinyDarts,
    ];
    
    export const CorruptionSeverityData: CorruptionSeverity[] = [
        Temporary, ShortTerm, Daily, MoonReaction, StressReaction, Permanent,
    ];
    
    export const none = new SelectionPackage<Corruption>([], [], [])
    
    export const RandomCorruptionSelection = new SelectionPackage<Corruption>(
        [new Corruption(Utility.RandomElement(CorruptionData), Utility.RandomElement(CorruptionSeverityData))], [],
        []
    );
    
    export const IxianRaverCorruptionSelection = new SelectionPackage<Corruption>(
        [], [new ChoiceGroup(1, [new Corruption(Utility.RandomElement(CorruptionData), Utility.RandomElement(CorruptionSeverityData)), new Corruption(Horns, Permanent), new Corruption(ClovenHooves, Permanent)], [])],
        []
    );
    
    export const IxianArchonCorruptionSelection = new SelectionPackage<Corruption>(
        [], [new ChoiceGroup(1, [new Corruption(Utility.RandomElement(CorruptionData), Utility.RandomElement(CorruptionSeverityData)), new Corruption(GlowingEyes, Permanent)], [])],
        []
    );
    
    export const LichCorruptionSelection = new SelectionPackage<Corruption>(
        [], [new ChoiceGroup(1, [new Corruption(Utility.RandomElement(CorruptionData), Utility.RandomElement(CorruptionSeverityData)), new Corruption(Skeletal, Permanent)], [])],
        []
    );
    
    export const WizardCorruptionSelection = new SelectionPackage<Corruption>(
        [], [new ChoiceGroup(1, [new Corruption(Utility.RandomElement(CorruptionData), Utility.RandomElement(CorruptionSeverityData)), new Corruption(Utility.RandomElement(CorruptionData), Utility.RandomElement(CorruptionSeverityData))], [])],
        []
    );
    
    export const JobTypeToCorruption : Record<JobType, SelectionPackage<Corruption>> = {
        "Apprentice Artisan":           none,
        "Apprentice Bureaucrat":        none,
        "Free Laborer":                 none,
        "Apprentice Crafter":           none,
        "Apprentice Mercantiler":       none,
        "Escaped Peasant/Thrall":       none,
        Acrobat:                        none,
        Contortionist:                  none,
        Jester:                         none,
        Minstrel:                       none,
        "Storyteller/Thespian":         none,
        Accursed:                       RandomCorruptionSelection,
        Acolyte:                        none,
        Cultist:                        RandomCorruptionSelection,
        Inquisitor:                     none,
        Pariah:                         none,
        "Touched/Anchorite":            none,
        Armiger:                        none,
        Barbarian:                      none,
        "Mercenary/Hedge":              none,
        Prizefighter:                   none,
        "Ruffian/Enforcer":             none,
        "Woodard/Warden":               none,
        "Adept/Arcane Apprentice":      none, // Handled by subclass
        "Alchemy Apprentice":           none,
        "Arcane Researcher":            RandomCorruptionSelection,
        Charlatan:                      none,
        Dowser:                         none,
        Warlock:                        none, // Handled by subclass
        Fence:                          none,
        Gambler:                        none,
        Scoundrel:                      none,
        Sharp:                          none,
        Spy:                            none,
        "Street Urchin":                none,
        Scholar:                        none,
    };
    
    export const JobSubsetToCorruption : Record<JobSubsetEnum, SelectionPackage<Corruption>> = {
        [JobSubsetEnum.None]:               none,
        [JobSubsetEnum.Jeweler]:            none,
        [JobSubsetEnum.Arbalist]:           none,
        [JobSubsetEnum.Scrivener]:          none,
        [JobSubsetEnum.Advocate]:           none,
        [JobSubsetEnum.Cartographer]:       none,
        [JobSubsetEnum.Inspector]:          none,
        [JobSubsetEnum.Interpreter]:        none,
        [JobSubsetEnum.RatCatcher]:         none,
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
        [JobSubsetEnum.Esoterica]:          RandomCorruptionSelection,
        [JobSubsetEnum.ActiveService]:      none,
        [JobSubsetEnum.Freelance]:          none,
        [JobSubsetEnum.LordSlain]:          none,
        [JobSubsetEnum.Disgraced]:          none,
        [JobSubsetEnum.HedgeKnight]:        none,
        [JobSubsetEnum.Mercenary]:          none,
        [JobSubsetEnum.Bandit]:             none,
        [JobSubsetEnum.Discharged]:         none,
        [JobSubsetEnum.IxianRaver]:         IxianRaverCorruptionSelection,
        [JobSubsetEnum.IxianArchon]:        IxianArchonCorruptionSelection,
        [JobSubsetEnum.Dragon]:             RandomCorruptionSelection,
        [JobSubsetEnum.Lich]:               LichCorruptionSelection,
        [JobSubsetEnum.Wizard]:             WizardCorruptionSelection,
        [JobSubsetEnum.ElderGod]:           RandomCorruptionSelection,
        [JobSubsetEnum.Moloch]:             RandomCorruptionSelection,
        [JobSubsetEnum.Kain]:               RandomCorruptionSelection,
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