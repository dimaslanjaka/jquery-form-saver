"use strict";
exports.__esModule = true;
exports.formSaver = void 0;
/// <reference path="index.d.ts">
var func_1 = require("./func");
var settings, forms;
// Default settings
var defaults = {
    selectorStatus: "[data-form-status]",
    selectorSave: "[data-form-save]",
    selectorDelete: "[data-form-delete]",
    selectorIgnore: "[data-form-no-save]",
    deleteClear: true,
    saveMessage: "Saved!",
    deleteMessage: "Deleted!",
    saveClass: "",
    deleteClass: "",
    initClass: "js-form-saver",
    callbackSave: function () { },
    callbackDelete: function () { },
    callbackLoad: function () { }
};
var formSaver = /** @class */ (function () {
    function formSaver() {
    }
    /**
     * Save form data to localStorage
     * @public
     * @param  {Element} btn Button that triggers form save
     * @param  {Element} form The form to save
     * @param  {Object} options
     * @param  {Event} event
     */
    formSaver.prototype.saveForm = function (btn, formID, options, event) {
        // Defaults and settings
        var overrides = func_1.getDataOptions(btn ? btn.getAttribute("data-options") : null);
        var merged = func_1.extend(settings || defaults, options || {}, overrides); // Merge user options with defaults
        var settings = merged;
        // Selectors and variables
        var form = document.querySelector(formID);
        var formSaverID = "formSaver-" + form.id;
        var formSaverData = {};
        var formFields = form.elements;
        var formStatus = form.querySelectorAll(settings.selectorStatus);
        /**
         * Convert field data into an array
         * @private
         * @param  {Element} field Form field to convert
         */
        var prepareField = function (field) {
            if (!func_1.getClosest(field, settings.selectorIgnore)) {
                if (field.type.toLowerCase() === "radio" ||
                    field.type.toLowerCase() === "checkbox") {
                    if (field.checked === true) {
                        formSaverData[field.name + field.value] = "on";
                    }
                }
                else if (field.type.toLowerCase() !== "hidden" &&
                    field.type.toLowerCase() !== "submit") {
                    if (field.value && field.value !== "") {
                        formSaverData[field.name] = field.value;
                    }
                }
            }
        };
        /**
         * Display status message
         * @private
         * @param  {Element} status The element that displays the status message
         * @param  {String} saveMessage The message to display on save
         * @param  {String} saveClass The class to apply to the save message wrappers
         */
        var displayStatus = function (status, saveMessage, saveClass) {
            status.innerHTML =
                saveClass === ""
                    ? "<div>" + saveMessage + "</div>"
                    : '<div class="' + saveClass + '">' + saveMessage + "</div>";
        };
        // Add field data to array
        func_1.forEach(formFields, function (field) {
            prepareField(field);
        });
        // Display save success message
        func_1.forEach(formStatus, function (status) {
            displayStatus(status, settings.saveMessage, settings.saveClass);
        });
        // Save form data in localStorage
        localStorage.setItem(formSaverID, JSON.stringify(formSaverData));
        settings.callbackSave(btn, form); // Run callbacks after save
    };
    /**
     * Remove form data from localStorage
     * @public
     * @param  {Element} btn Button that triggers form delete
     * @param  {Element} form The form to remove from localStorage
     * @param  {Object} options
     * @param  {Event} event
     */
    formSaver.prototype.deleteForm = function (btn, formID, options, event) {
        // Defaults and settings
        var overrides = func_1.getDataOptions(btn ? btn.getAttribute("data-options") : {});
        var settings = func_1.extend(settings || defaults, options || {}, overrides); // Merge user options with defaults
        // Selectors and variables
        var form = document.querySelector(formID);
        var formSaverID = "formSaver-" + form.id;
        var formStatus = form.querySelectorAll(settings.selectorStatus);
        var formMessage = settings.deleteClass === ""
            ? "<div>" + settings.deleteMessage + "</div>"
            : '<div class="' +
                settings.deleteClass +
                '">' +
                settings.deleteMessage +
                "</div>";
        /**
         * Display succes message
         * @private
         */
        var displayStatus = function () {
            if (settings.deleteClear === true || settings.deleteClear === "true") {
                sessionStorage.setItem(formSaverID + "-formSaverMessage", formMessage);
                location.reload(false);
            }
            else {
                func_1.forEach(formStatus, function (status) {
                    status.innerHTML = formMessage;
                });
            }
        };
        localStorage.removeItem(formSaverID); // Remove form data
        displayStatus(); // Display delete success message
        settings.callbackDelete(btn, form); // Run callbacks after delete
    };
    /**
     * Load form data from localStorage
     * @public
     * @param  {Element} form The form to get data for
     * @param  {Object} options
     */
    formSaver.prototype.loadForm = function (form, options) {
        // Selectors and variables
        var settings = func_1.extend(settings || defaults, options || {}); // Merge user options with defaults
        var formSaverID = "formSaver-" + form.id;
        var formSaverData = JSON.parse(localStorage.getItem(formSaverID));
        var formFields = form.elements;
        var formStatus = form.querySelectorAll(settings.selectorStatus);
        /**
         * Populate a field with localStorage data
         * @private
         * @param  {Element} field The field to get data form
         */
        var populateField = function (field) {
            if (formSaverData) {
                if (field.type.toLowerCase() === "radio" ||
                    field.type.toLowerCase() === "checkbox") {
                    if (formSaverData[field.name + field.value] === "on") {
                        field.checked = true;
                    }
                }
                else if (field.type.toLowerCase() !== "hidden" &&
                    field.type.toLowerCase() !== "submit") {
                    if (formSaverData[field.name]) {
                        field.value = formSaverData[field.name];
                    }
                }
            }
        };
        /**
         * Display success message
         * @param  {Element} status The element that displays the status message
         */
        var displayStatus = function (status) {
            status.innerHTML = sessionStorage.getItem(formSaverID + "-formSaverMessage");
            sessionStorage.removeItem(formSaverID + "-formSaverMessage");
        };
        // Populate form with data from localStorage
        func_1.forEach(formFields, function (field) {
            populateField(field);
        });
        // If page was reloaded and delete success message exists, display it
        func_1.forEach(formStatus, function (status) {
            displayStatus(status);
        });
        settings.callbackLoad(form); // Run callbacks after load
    };
    /**
     * Destroy the current initialization.
     * @public
     */
    formSaver.prototype.destroy = function () {
        if (!settings)
            return;
        document.documentElement.classList.remove(settings.initClass);
        document.removeEventListener("click", func_1.eventHandler, false);
        settings = null;
        forms = null;
    };
    /**
     * Initialize Form Saver
     * @public
     * @param {Object} options User settings
     */
    formSaver.prototype.init = function (options) {
        // feature test
        if (!func_1.isBrowser())
            return;
        // Destroy any existing initializations
        this.destroy();
        // Selectors and variables
        settings = func_1.extend(defaults, options || {}); // Merge user options with defaults
        forms = document.forms;
        // Add class to HTML element to activate conditional CSS
        document.documentElement.className +=
            (document.documentElement.className ? " " : "") + settings.initClass;
        // Get saved form data on page load
        func_1.forEach(forms, function (form) {
            this.loadForm(form, settings);
        });
        // Listen for click events
        document.addEventListener("click", func_1.eventHandler, false);
    };
    /**
     * Auto form saver
     */
    formSaver.prototype.auto = function () {
        func_1.formsaver();
    };
    return formSaver;
}());
exports.formSaver = formSaver;
