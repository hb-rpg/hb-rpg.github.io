import { Utility } from "./Utility.js";
import { ko } from "../Framework/Knockout/ko.js";
export var KnockoutBindings;
(function (KnockoutBindings) {
    const PREVIOUS_MODEL_KEY = 'ko_partial_view_previous_model';
    function initializePartialView() {
        ko.bindingHandlers.ContentView = {
            init: function (element) {
                return { controlsDescendantBindings: true };
            },
            update: function (element, valueAccessor, _allBindings, viewModel) {
                const url = ko.unwrap(valueAccessor());
                const children = element.getElementsByTagName("*");
                for (let i = 0; i < children.length; i++)
                    ko.cleanNode(children[i]);
                element.innerHTML = '';
                if (url) {
                    fetch(Utility.getBaseHTMLUrl(url))
                        .then(r => r.text())
                        .then(html => {
                        element.innerHTML = html;
                        ko.applyBindingsToDescendants(viewModel, element);
                    });
                }
            }
        };
        ko.bindingHandlers.PartialView = {
            init: function (element, valueAccessor) {
                return { controlsDescendantBindings: true };
            },
            update: function (element, valueAccessor) {
                const bindingModel = valueAccessor();
                // Clean up from saved instance if desired
                ko.utils.domData.get(element, PREVIOUS_MODEL_KEY)?.Destruction?.();
                const childrenElements = element.getElementsByTagName("*");
                for (let i = 0; i < childrenElements.length; i++) {
                    ko.cleanNode(childrenElements[i]);
                }
                ko.utils.domData.set(element, PREVIOUS_MODEL_KEY, bindingModel.Model);
                bindingModel.Model.isLoading(true);
                bindingModel.Model.HTMLandKnockoutRequestCallback =
                    Utility.injectHTML(element, Utility.getBaseHTMLUrl(bindingModel.ViewUrl))
                        .then(() => ko.applyBindingsToDescendants(bindingModel.Model, element));
            }
        };
    }
    KnockoutBindings.initializePartialView = initializePartialView;
})(KnockoutBindings || (KnockoutBindings = {}));
