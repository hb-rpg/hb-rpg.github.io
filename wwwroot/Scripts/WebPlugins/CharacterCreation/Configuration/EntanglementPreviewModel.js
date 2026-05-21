export class EntanglementPreview {
    entanglementType;
    entanglementName;
    entanglementReputation;
    allowedGeneratedNames;
    constructor(entanglementType, entanglementName, entanglementReputation, allowedGeneratedNames = true) {
        this.entanglementType = entanglementType;
        this.entanglementName = entanglementName;
        this.entanglementReputation = entanglementReputation;
        this.allowedGeneratedNames = allowedGeneratedNames;
    }
}
