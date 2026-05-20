import { ko } from "../../../Framework/Knockout/ko.js";
import { Observable } from "../../../Framework/Knockout/knockout.js";
import { BlogModel } from "./BlogModel.js";
import { Utility } from "../../../WebCore/Utility.js";
import { ResolveURLData } from "../../../WebCore/Contracts/PageOption.js";

export class ArticleModel implements IHTMLInjectable<void, ResolveURLData<void>> {
    isLoading: Observable<boolean>;
    public readonly ViewUrl : string = "PartialViews/Blog/ArticleView.html"

    Blog: IPartialViewModel<BlogModel>
    
    constructor(public readonly BlogUrl : string) {
        this.isLoading = ko.observable(true);

        this.Blog = Utility.BundleViewAndModel(new BlogModel(BlogUrl))
    }

    Init (data?: ResolveURLData<void>) : Promise<void> {
        return Promise.resolve();
    }
}