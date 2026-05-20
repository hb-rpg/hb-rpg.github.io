import { constructHomeViewModel, constructResourcesViewModel } from "../../WebPlugins/Blog/Utility/ConfiguredViewModels.js";
import { PageOption, ResolveURLData } from "../Contracts/PageOption.js";
import { constructCharacterViewModel } from "./ConfiguredViewModels.js";

export const navigationOptions : PageOption<void, ResolveURLData<void>>[] = [
        {FriendlyName: "Home", pageKey: "Home", modelConstructor: constructHomeViewModel},
        {FriendlyName: "Create", pageKey: "CharacterCreator", modelConstructor: constructCharacterViewModel},
        // {FriendlyName: "Resources", pageKey: "Resources", modelConstructor: constructResourcesViewModel},
    ]