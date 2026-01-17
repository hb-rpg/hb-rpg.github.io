import { ConfiguredCharacterData } from "../../WebPlugins/CharacterCreation/Configuration/CharacterWizardData.js"
import { CharacterSheetModel } from "../../WebPlugins/CharacterCreation/VIewModels/CharacterSheetModel.js"
import { Utility } from "../Utility.js"

export const constructCharacterViewModel = ()=>{return Utility.BundleViewAndModel(new CharacterSheetModel(new ConfiguredCharacterData()))}
