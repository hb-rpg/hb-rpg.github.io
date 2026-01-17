import { constructHomeViewModel } from "../../WebPlugins/Blog/Utility/ConfiguredViewModels.js";
import { constructCharacterViewModel } from "./ConfiguredViewModels.js";
export const navigationOptions = [
    { FriendlyName: "Home", pageKey: "Home", modelConstructor: constructHomeViewModel },
    { FriendlyName: "Create", pageKey: "CharacterCreator", modelConstructor: constructCharacterViewModel },
    // {FriendlyName: "Resources", pageKey: "Resources", modelConstructor: constructResourcesViewModel},
];
