$(function () {
    let cssLibs = require("./loadStyleLibs");
    let jsLibs = require("./loadJSLibs");
    let pages = require("./pages");
    let smart = {
        onInit: function () {
            let reference = this;
            $("link").remove();
            $("script").remove();
            cssLibs.loadFonts.then(function () {
                console.log("Fonts libs were loaded");
                return cssLibs.loadIcons;
            }).then(function () {
                console.log("Icons libs were loaded");
                return cssLibs.loadCSS;
            }).then(function () {
                console.log("CSS Libs were loaded");
                return cssLibs.loadCustomCss;
            }).then(function () {
                console.log("CSS Custom Libs were loaded");
                return jsLibs.loadHighJS();
            }).then(function () {
                console.log("High JS were loaded");
                return jsLibs.loadMediumJS();
            }).then(function () {
                console.log("JS Medium Libs were loaded");
                return jsLibs.loadLowJS();
            })
                .then(function () {
                    console.log("JS Low Libs were loaded");
                    return jsLibs.loadDataTables();
                })
                .then(function () {
                    console.log("JS Low 2 were loaded");
                    return pages.loadAllPages()
                }).then(function(data){
                    console.log("Pages :" , data );
                    return pages.bootstrapMenu();
                });
        }
    }

    smart.onInit();

});