import { ko } from "../../../../Framework/Knockout/ko.js";
import { Utility } from "../../../../WebCore/Utility.js";
import { JobSubsetEnum } from "../../Contracts/StringTypes.js";
import { PopulateBackground } from "../../Utility/PopulateStory.js";
import { getCharacterCreatorPicturePath, tryGetCharacterCreatorPicturePath } from "../../Utility/RoutingUtility.js";
// TODO: replace PictureUrl with a background-specific placeholder image
const BackgroundPlaceholder = {
    PictureUrl: getCharacterCreatorPicturePath("Copy of CH 10 Treasure John Dickson Batten Fairy_tales_from_the_Arabian_nights_-_Batten_illustration_at_page_306 2.jpg"),
    Description: "Choose a Profession and a specific Job to define your character's history before they ever picked up a sword or cast a spell. Whether you ground your character's roots in the sweat of a laborer, the sweat and cold steel of a mercenary or a knight, or the hidden shadows of a rogue, your background represents the life you left behind. See the rulebook for more details."
};
// Configure which profession you are 
// Configure which job you are 
// Configure the specific job type
// ----------------------
// Eg. Skilled & Laborer > Apprentice Artisan (be able to see story) > choice of Jeweler or Arbalist
// The job: eg. Jeweler is going to used to determine what items, skills, edges, etc you have, the story is going to be used to determine what relationships you have
// Each Job will have it's own selection constructor (configuring who you pissed off, story?, and default picture url) so that you don't have to recreate it for every sub-job
export class JobBackgroundPickerModel {
    GlobalCharacterData;
    PossibleProfessions;
    ProfessionsJobs;
    JobsStory;
    JobToJobSubsets;
    ViewUrl = "PartialViews/CharacterCreation/JobBackgroundPickerView.html";
    isLoading;
    FriendlyName = "Class History Picker";
    chosenProfession;
    chosenJob;
    chosenJobBackground;
    chosenJobSubset;
    PossibleJobs;
    PossibleJobSubset;
    showJobSubset;
    PictureUrl;
    description;
    errorMessage = ko.observable("");
    constructor(GlobalCharacterData, PossibleProfessions, ProfessionsJobs, JobsStory, JobToJobSubsets) {
        this.GlobalCharacterData = GlobalCharacterData;
        this.PossibleProfessions = PossibleProfessions;
        this.ProfessionsJobs = ProfessionsJobs;
        this.JobsStory = JobsStory;
        this.JobToJobSubsets = JobToJobSubsets;
        this.chosenProfession = ko.observable(null);
        this.PossibleJobs = ko.observableArray([]);
        this.chosenJob = ko.observable(null);
        this.chosenJobBackground = ko.observable(null);
        this.PossibleJobSubset = ko.observableArray([]);
        this.chosenJobSubset = ko.observable(undefined);
        this.showJobSubset = ko.observable(false);
        this.PictureUrl = ko.observable(BackgroundPlaceholder.PictureUrl);
        this.description = ko.observable(BackgroundPlaceholder.Description);
        this.chosenProfession.subscribe((newValue) => {
            if (!newValue) {
                this.PossibleJobs([]);
                this.chosenJob(null);
                this.chosenJobSubset(undefined);
                this.PictureUrl(BackgroundPlaceholder.PictureUrl);
                return;
            }
            this.PossibleJobs(this._determinePossibleJobs());
        });
        this.PossibleJobs.subscribe(() => this.chosenJob(this.PossibleJobs()[0] ?? null));
        this.chosenJob.subscribe((newJob) => {
            if (!newJob) {
                this.chosenJobSubset(undefined);
                this.PossibleJobSubset([]);
                this.showJobSubset(false);
                this.chosenJobBackground(null);
                this.PictureUrl(BackgroundPlaceholder.PictureUrl);
                this.description(BackgroundPlaceholder.Description);
                return;
            }
            const classBackground = this._determineClassBackground(newJob);
            if (classBackground == undefined)
                return;
            this.chosenJobBackground(PopulateBackground(classBackground, this.GlobalCharacterData));
            this.PossibleJobSubset(this._determinePossibleJobSubsets());
            this.chosenJobSubset(this.PossibleJobSubset()[0]);
            this.PictureUrl(tryGetCharacterCreatorPicturePath(classBackground.PartialPictureUrl));
            this.description(classBackground.Story);
        });
        this.PossibleJobSubset.subscribe((newValues) => {
            this.showJobSubset(newValues.length > 0 && newValues.filter((value) => value == JobSubsetEnum.None).length == 0);
        });
        this.isLoading = ko.observable(false);
    }
    Init() {
        this.errorMessage("");
        if (this.GlobalCharacterData.HasChosenBackground) {
            this.chosenProfession(this.GlobalCharacterData.Profession());
            this.chosenJob(this.GlobalCharacterData.Job());
            this.chosenJobBackground(this.GlobalCharacterData.JobBackground());
            this.chosenJobSubset(this.GlobalCharacterData.JobSubset());
        }
        return Promise.resolve();
    }
    isConfigured() { return this.chosenProfession() != null && this.chosenJob() != null; }
    configurationError() { return "Please select a profession and job."; }
    onValidationFailed() { this.errorMessage(this.configurationError()); }
    Evaluate() {
        if (this.chosenProfession() === null || this.chosenJob() === null || this.chosenJobBackground() === null)
            throw EvalError();
        const JobSubsetChoice = (this.chosenJobSubset() !== undefined) ? this.chosenJobSubset() : JobSubsetEnum.None;
        this.GlobalCharacterData.Profession(this.chosenProfession());
        this.GlobalCharacterData.Job(this.chosenJob());
        this.GlobalCharacterData.JobBackground(this.chosenJobBackground());
        this.GlobalCharacterData.JobSubset(JobSubsetChoice);
        this.GlobalCharacterData.HasChosenBackground = true;
        return this.chosenJobBackground();
    }
    Randomize() {
        this.chosenProfession(Utility.RandomElement(this.PossibleProfessions));
        this.chosenJob(Utility.RandomElement(this.PossibleJobs()));
        this.chosenJobSubset(Utility.RandomElement(this.PossibleJobSubset()));
    }
    _determinePossibleJobs() {
        return this.ProfessionsJobs[this.chosenProfession()];
    }
    _setInitialJob() {
        return this.PossibleJobs()[0];
    }
    _determinePossibleJobSubsets() {
        return this.JobToJobSubsets[this.chosenJob()];
    }
    _determineClassBackground(jobOption) {
        return PopulateBackground((this.JobsStory[jobOption]), this.GlobalCharacterData);
    }
}
