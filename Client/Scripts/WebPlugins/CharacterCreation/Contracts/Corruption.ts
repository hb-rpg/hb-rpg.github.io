export class CorruptionAffliction {
    constructor (public Effect : string, public Description : string, public reference? : string) {}
}

export class CorruptionSeverity {
    constructor (public Effect : string, public Description : string, public reference? : string) {}
}

export class Corruption {
    constructor(public affliction : CorruptionAffliction, public severity : CorruptionSeverity) {}
}