import { Observable, Computed } from "../../../Framework/Knockout/knockout.js";
import { ConfiguredCharacterData } from "../Configuration/CharacterWizardData.js";
import { CreateObjectModel } from "../ViewModels/CreateObjectModel.js";

export interface ICharacterWizardViewModel<ResolveType, EvaluateType> extends IWizardModel<ResolveType, EvaluateType>  {
    Randomize : Function
    GlobalCharacterData : ConfiguredCharacterData
    isConfigured?(): boolean
}

export type IRandomizeWizardModel<EvaluateType> = IWizardModel<void, EvaluateType, undefined> & {Randomize : Function, isConfigured?(): boolean}


export type IConfigurableViewModal<ItemToConfigureDataType> =
    IPartialViewModel<CreateObjectModel<ItemToConfigureDataType, IConfigurableViewModel>>
    & { hasContent: Computed<boolean> }

export type IConfigurableViewModel = IHTMLInjectable<void> & {IsConfigured : Observable<boolean>}

export type CharacterPickerModal<ItemType, PreviewType> =
    IPartialViewModel<CreateObjectModel<ItemType, PreviewType>>
    & { hasContent: Computed<boolean> }

export interface IAnyCharacterPickerModal {
    ViewUrl: string
    hasContent: Computed<boolean>
    Model: {
        Init(): Promise<void>
        Randomize(): void
        previewViewModel: {
            Model: {
                IsConfigured: Observable<boolean>
                StepNumber: Observable<number>
                Randomize: Function
            }
        }
    }
}

