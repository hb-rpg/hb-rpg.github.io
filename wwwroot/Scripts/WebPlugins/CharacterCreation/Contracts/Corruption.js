export class CorruptionAffliction {
    Effect;
    Description;
    constructor(Effect, Description) {
        this.Effect = Effect;
        this.Description = Description;
    }
}
export class CorruptionSeverity {
    Effect;
    Description;
    constructor(Effect, Description) {
        this.Effect = Effect;
        this.Description = Description;
    }
}
export class Corruption {
    affliction;
    severity;
    constructor(affliction, severity) {
        this.affliction = affliction;
        this.severity = severity;
    }
}
