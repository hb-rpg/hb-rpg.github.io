export class Deity {
    Pronoun;
    Description;
    FullDescription;
    SymbolPath;
    RunePath;
    reference;
    constructor(Pronoun, Description, FullDescription, SymbolPath, RunePath, reference) {
        this.Pronoun = Pronoun;
        this.Description = Description;
        this.FullDescription = FullDescription;
        this.SymbolPath = SymbolPath;
        this.RunePath = RunePath;
        this.reference = reference;
    }
}
