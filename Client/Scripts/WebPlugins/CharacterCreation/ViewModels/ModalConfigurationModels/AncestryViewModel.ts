import {ko} from "../../../../Framework/Knockout/ko.js"
import { Utility } from "../../../../WebCore/Utility.js";
import { PictureModel, TaggedCharacterData } from "../../Contracts/TaggedData.js";
import { RaceType } from "../../Contracts/StringTypes.js";
import {RaceDefaultExplanation, RaceDescriptions, Races } from "../../Configuration/DispositionData.js";
import { ConfiguredCharacterData } from "../../Configuration/CharacterWizardData.js";
import { Observable } from "../../../../Framework/Knockout/knockout.js";
import { getCharacterCreatorPicturePath } from "../../Utility/RoutingUtility.js";

export class AncestryViewModel implements IWizardModel<void, RaceType> {
    ViewUrl = "PartialViews/CharacterCreation/AncestryView.html"
    isLoading: Observable<boolean>;
    FriendlyName = "Ancestry"

    ChosenRace : ko.Observable<RaceType | null>

    PictureUrl : ko.Observable<string>
    RaceDescription : ko.Observable<string>

    errorMessage : Observable<string> = ko.observable("")

    constructor (public GlobalCharacterData : ConfiguredCharacterData, public PossibleRaces : RaceType[]) {
        this.ChosenRace = ko.observable<RaceType | null>(null)
        this.PictureUrl = ko.observable(getCharacterCreatorPicturePath(RaceDefaultExplanation.PictureUrl))
        this.RaceDescription = ko.observable(RaceDefaultExplanation.Description)   

        this.isLoading = ko.observable(true)

        this.ChosenRace.subscribe((race) => {
            if (!race) { this.PictureUrl(getCharacterCreatorPicturePath(RaceDefaultExplanation.PictureUrl)); this.RaceDescription(RaceDefaultExplanation.Description); return }
            const raceData = this.GetRaceData(race)
            this.PictureUrl(raceData.PictureUrl)
            this.RaceDescription(raceData.Description)
        })
    }

    Init () : Promise<void> {
        this.errorMessage("")
        if (this.GlobalCharacterData.HasChosenRace)
            this.ChosenRace(this.GlobalCharacterData.Race())
        return Promise.resolve()
    }

    isConfigured () { return this.ChosenRace() != null }
    configurationError () { return "Please select an ancestry." }
    onValidationFailed () { this.errorMessage(this.configurationError()) }

    Evaluate () {
        if (this.ChosenRace() === null) throw EvalError("ChosenRace cannot be null")
        this.GlobalCharacterData.Race(this.ChosenRace() as RaceType)
        this.GlobalCharacterData.HasChosenRace = true
        return this.ChosenRace() as RaceType
    }

    Randomize () {
        this.ChosenRace(Utility.RandomElement(Races))
    }

    private GetRaceData (race : RaceType) : PictureModel {
        const taggedRaceData: TaggedCharacterData<PictureModel> | undefined = RaceDescriptions
            .find((taggedData)=>{ return taggedData.Tags.Race?.Race == race})

        if (taggedRaceData == undefined) throw Error(race + " config not found")

        return {PictureUrl: getCharacterCreatorPicturePath(taggedRaceData.Payload.PictureUrl), Description : taggedRaceData.Payload.Description}
    }
}



