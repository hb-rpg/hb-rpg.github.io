import { AbilityNames } from "./Abilities.js";
import { CastingTime, MagicSchool, MagicTradition, SpellDuration, SpellRange } from "./Magic.js";

export interface SpellInit {
    Name: string;
    Description: string;
    /** 0 for cantrips. Left unset for spells whose level has not been assigned yet. */
    Level?: number;
    School?: MagicSchool[];
    Tradition?: MagicTradition[];
    IsRitual?: boolean;
    CastingTime?: CastingTime;
    Range?: SpellRange;
    Duration?: SpellDuration;
    /** Which ability the target tests against. Empty or omitted means "Test None". */
    Test?: AbilityNames[];
    reference?: string;
}

export class Spell {
    public Name: string;
    public Description: string;
    public Level?: number;
    public School?: MagicSchool[];
    public Tradition?: MagicTradition[];
    public IsRitual?: boolean;
    public CastingTime?: CastingTime;
    public Range?: SpellRange;
    public Duration?: SpellDuration;
    public Test?: AbilityNames[];
    public reference?: string;

    constructor(init: SpellInit) {
        this.Name = init.Name;
        this.Description = init.Description;
        this.Level = init.Level;
        this.School = init.School;
        this.Tradition = init.Tradition;
        this.IsRitual = init.IsRitual;
        this.CastingTime = init.CastingTime;
        this.Range = init.Range;
        this.Duration = init.Duration;
        this.Test = init.Test;
        this.reference = init.reference;
    }
}
