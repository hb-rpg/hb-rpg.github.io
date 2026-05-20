export const UpdateHistoryAndPage = async (currentPage, urlData, selectedOption) => {
    if (selectedOption === undefined)
        throw "Invalid url state!";
    const oldURL = (history.state != null) ? history.state : "";
    const newURL = oldURL + `/${selectedOption.pageKey}`;
    history.pushState(newURL, newURL, newURL);
    const pageViewModel = selectedOption.modelConstructor();
    currentPage(pageViewModel);
    return pageViewModel.Model.Init(urlData);
};
export const PopHistory = () => {
    const oldHistory = history.state.split("/");
    oldHistory.shift();
    const newURL = oldHistory.join("/");
    history.replaceState(newURL, newURL, newURL);
};
export const ClearHistory = () => {
    history.replaceState("", "", "");
};
