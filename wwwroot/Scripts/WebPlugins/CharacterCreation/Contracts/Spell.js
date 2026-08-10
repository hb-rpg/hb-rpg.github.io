export class Spell {
    Name;
    Description;
    Level;
    School;
    Tradition;
    IsRitual;
    CastingTime;
    Range;
    Duration;
    Test;
    reference;
    constructor(init) {
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
