import { Observable, ObservableArray } from "../../../../Framework/Knockout/knockout.js";
import { ConfiguredCharacterData } from "../../Configuration/CharacterWizardData.js";
import { ICharacterWizardViewModel } from "../../Contracts/CharacterWizardViewModels.js";
import { StoryModel, TaggedCharacterData } from "../../Contracts/TaggedData.js";
import { ko } from "../../../../Framework/Knockout/ko.js";
import { Utility } from "../../../../WebCore/Utility.js";
import { JobSubset, JobSubsetEnum, JobType, ProfessionType } from "../../Contracts/StringTypes.js";
import { PopulateBackground } from "../../Utility/PopulateStory.js";
import { getCharacterCreatorPicturePath, tryGetCharacterCreatorPicturePath } from "../../Utility/RoutingUtility.js";

// TODO: replace PictureUrl with a background-specific placeholder image
const BackgroundPlaceholder = {
    PictureUrl: getCharacterCreatorPicturePath("Copy of CH 10 Treasure John Dickson Batten Fairy_tales_from_the_Arabian_nights_-_Batten_illustration_at_page_306 2.jpg"),
    Description: "Choose a Profession and a specific Job to define your character's history before they ever picked up a sword or cast a spell. Whether you ground your character's roots in the sweat of a laborer, the sweat and cold steel of a mercenary or a knight, or the hidden shadows of a rogue, your background represents the life you left behind. See the rulebook for more details."
}

// Configure which profession you are 
    
// Configure which job you are 

// Configure the specific job type

// ----------------------

// Eg. Skilled & Laborer > Apprentice Artisan (be able to see story) > choice of Jeweler or Arbalist

// The job: eg. Jeweler is going to used to determine what items, skills, edges, etc you have, the story is going to be used to determine what relationships you have

// Each Job will have it's own selection constructor (configuring who you pissed off, story?, and default picture url) so that you don't have to recreate it for every sub-job

export class JobBackgroundPickerModel implements ICharacterWizardViewModel<void, StoryModel<JobType>> {
    readonly ViewUrl = "PartialViews/CharacterCreation/JobBackgroundPickerView.html";
    isLoading: Observable<boolean>;

    FriendlyName = "Class History Picker"

    chosenProfession : Observable<ProfessionType | null>
    chosenJob : Observable<JobType | null>
    chosenJobBackground : Observable<StoryModel<JobType> | null>
    chosenJobSubset : Observable<JobSubset | undefined>

    PossibleJobs : ObservableArray<JobType>
    PossibleJobSubset : ObservableArray<JobSubset>

    showJobSubset : Observable<boolean>

    PictureUrl : Observable<string>
    description : Observable<string>

    errorMessage : Observable<string> = ko.observable("")

    constructor (
        public GlobalCharacterData : ConfiguredCharacterData,
        public PossibleProfessions : ProfessionType[],
        public ProfessionsJobs : Record<ProfessionType, JobType[]>,
        public JobsStory : Record<JobType, StoryModel<JobType>>,
        public JobToJobSubsets : Record<JobType, JobSubset[]>,
    ) {
        this.chosenProfession = ko.observable<ProfessionType | null>(null)
        this.PossibleJobs = ko.observableArray<JobType>([])
        this.chosenJob = ko.observable<JobType | null>(null)
        this.chosenJobBackground = ko.observable<StoryModel<JobType> | null>(null)
        this.PossibleJobSubset = ko.observableArray<JobSubset>([])
        this.chosenJobSubset = ko.observable<JobSubset | undefined>(undefined)
        this.showJobSubset = ko.observable(false)
        this.PictureUrl = ko.observable(BackgroundPlaceholder.PictureUrl)
        this.description = ko.observable(BackgroundPlaceholder.Description)

        this.chosenProfession.subscribe((newValue) => {
            if (!newValue) {
                this.PossibleJobs([])
                this.chosenJob(null)
                this.chosenJobSubset(undefined)
                this.PictureUrl(BackgroundPlaceholder.PictureUrl)
                return
            }
            this.PossibleJobs(this._determinePossibleJobs())
        })

        this.PossibleJobs.subscribe(() => this.chosenJob(this.PossibleJobs()[0] ?? null))

        this.chosenJob.subscribe((newJob) => {
            if (!newJob) {
                this.chosenJobSubset(undefined)
                this.PossibleJobSubset([])
                this.showJobSubset(false)
                this.chosenJobBackground(null)
                this.PictureUrl(BackgroundPlaceholder.PictureUrl)
                this.description(BackgroundPlaceholder.Description)
                return
            }

            const classBackground = this._determineClassBackground(newJob)
            if (classBackground == undefined) return

            this.chosenJobBackground(PopulateBackground(classBackground, this.GlobalCharacterData))
            this.PossibleJobSubset(this._determinePossibleJobSubsets())
            this.chosenJobSubset(this.PossibleJobSubset()[0])
            this.PictureUrl(tryGetCharacterCreatorPicturePath(classBackground.PartialPictureUrl))
            this.description(classBackground.Story)
        })

        this.PossibleJobSubset.subscribe((newValues) => {
            this.showJobSubset(newValues.length > 0 && newValues.filter((value) => value == JobSubsetEnum.None).length == 0)
        })

        this.isLoading = ko.observable(false)
    }

    Init () {
        this.errorMessage("")
        if (this.GlobalCharacterData.HasChosenBackground) {
            this.chosenProfession(this.GlobalCharacterData.Profession())
            this.chosenJob(this.GlobalCharacterData.Job())
            this.chosenJobBackground(this.GlobalCharacterData.JobBackground())
            this.chosenJobSubset(this.GlobalCharacterData.JobSubset())
        }
        return Promise.resolve()
    }

    isConfigured () { return this.chosenProfession() != null && this.chosenJob() != null }
    configurationError () { return "Please select a profession and job." }
    onValidationFailed () { this.errorMessage(this.configurationError()) }

    Evaluate () {
        if (this.chosenProfession() === null || this.chosenJob() === null || this.chosenJobBackground() === null) throw EvalError()

        const JobSubsetChoice = (this.chosenJobSubset() !== undefined)? <JobSubsetEnum>this.chosenJobSubset() : JobSubsetEnum.None

        this.GlobalCharacterData.Profession(this.chosenProfession() as ProfessionType)
        this.GlobalCharacterData.Job(this.chosenJob() as JobType)
        this.GlobalCharacterData.JobBackground(this.chosenJobBackground() as StoryModel<JobType>)
        this.GlobalCharacterData.JobSubset(JobSubsetChoice)
        this.GlobalCharacterData.HasChosenBackground = true

        return this.chosenJobBackground() as StoryModel<JobType> 
    }

    Randomize () {
        this.chosenProfession(Utility.RandomElement(this.PossibleProfessions))
        this.chosenJob(Utility.RandomElement(this.PossibleJobs()))
        this.chosenJobSubset(Utility.RandomElement(this.PossibleJobSubset()))
    }

    _determinePossibleJobs () {
        return <JobType[]> this.ProfessionsJobs[<ProfessionType>this.chosenProfession()]
    }

    _setInitialJob() {
        return this.PossibleJobs()[0]
    }

    _determinePossibleJobSubsets () {
        return this.JobToJobSubsets[<JobType>this.chosenJob()]
    }

    _determineClassBackground (jobOption : JobType) : StoryModel<JobType> {
        return PopulateBackground<JobType>(<StoryModel<JobType>>(this.JobsStory[jobOption]), this.GlobalCharacterData)
    }
}