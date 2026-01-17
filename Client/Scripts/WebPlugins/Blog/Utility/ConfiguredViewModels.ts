import { Utility } from "../../../WebCore/Utility.js"
import { ArticleModel } from "../ViewModels/ArticleModel.js"

export const constructHomeViewModel = ()=>{return Utility.BundleViewAndModel(new ArticleModel("/GeneratedViews/Home.html"))}
export const constructResourcesViewModel = ()=>{return Utility.BundleViewAndModel(new ArticleModel("/GeneratedViews/Resources.html"))}
