import { ko } from "../../Framework/Knockout/ko.js";
import { ClearHistory, UpdateHistoryAndPage } from "../../WebPlugins/Blog/Utility/History.js";
export class WebPageController {
    ViewUrl = "PartialViews/WebCore/WebPageView.html";
    isLoading;
    HTMLandKnockoutRequestCallback = Promise.resolve();
    NavigationOptions;
    CurrentPage;
    CurrentURL;
    constructor(NavigationOptions) {
        this.isLoading = ko.observable(true);
        this.NavigationOptions = NavigationOptions;
        this.CurrentPage = ko.observable(this.NavigationOptions[0].modelConstructor());
        const url = window.location.pathname;
        this.CurrentURL = url.split("/").filter((text) => { return text != ""; });
    }
    async Init() {
        await this.HTMLandKnockoutRequestCallback;
        const url = window.location.pathname;
        this.CurrentURL = url.split("/").filter((text) => { return text != ""; });
        if (this.CurrentURL.length == 0)
            return UpdateHistoryAndPage(this.CurrentPage, { CurrentPageObservable: this.CurrentPage, URLPath: this.CurrentURL }, this.NavigationOptions[0]).then(() => this.isLoading(false));
        const desiredPage = this.CurrentURL.shift();
        let selectedPageOption = this.NavigationOptions.find((testOption) => { return testOption.pageKey == desiredPage; });
        if (!selectedPageOption) {
            console.warn("Page not found, redirecting to " + this.NavigationOptions[0].FriendlyName);
            selectedPageOption = this.NavigationOptions[0];
        }
        return this.UpdatePage(selectedPageOption);
    }
    async UpdatePage(selectedOption) {
        ClearHistory();
        return UpdateHistoryAndPage(this.CurrentPage, { CurrentPageObservable: this.CurrentPage, URLPath: this.CurrentURL }, selectedOption).then(() => this.isLoading(false));
    }
}
