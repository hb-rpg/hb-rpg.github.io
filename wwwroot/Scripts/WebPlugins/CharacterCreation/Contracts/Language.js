export class Language {
    Name;
    Description;
    Popularity;
    reference;
    constructor(Name, Description, Popularity, reference) {
        this.Name = Name;
        this.Description = Description;
        this.Popularity = Popularity;
        this.reference = reference;
    }
}
export class LearnedLanguage {
    Language;
    canSpeak;
    canRead;
    canWrite;
    constructor(Language, canSpeak, canRead, canWrite) {
        this.Language = Language;
        this.canSpeak = canSpeak;
        this.canRead = canRead;
        this.canWrite = canWrite;
    }
}
