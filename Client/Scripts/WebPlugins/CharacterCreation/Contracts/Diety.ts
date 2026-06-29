import { PronounType } from "./StringTypes.js";

export class Deity {
    constructor (public Pronoun : PronounType, public Description : string, public FullDescription : string, public SymbolPath? : string, public RunePath? : string, public reference? : string) {}
}