export class CorruptionAffliction {
    Effect;
    Description;
    reference;
    constructor(Effect, Description, reference) {
        this.Effect = Effect;
        this.Description = Description;
        this.reference = reference;
    }
}
export class CorruptionSeverity {
    Effect;
    Description;
    reference;
    constructor(Effect, Description, reference) {
        this.Effect = Effect;
        this.Description = Description;
        this.reference = reference;
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
