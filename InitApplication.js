$(function () {
    let cssLibs = require("./loadStyleLibs");
    let jsLibs = require("./loadJSLibs");
    let pages = require("./pages");
    let message = require("./messages");
    
    let smart = {
        onInit: function () {
            let reference = this;
            $("link").remove();
            $("script").remove();
            message.addMessageLoder("pageLoaderContent", "body");

            cssLibs.loadFonts.then(function () {
                console.log("Fonts libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Las fuentes han sido cargadas");
                return cssLibs.loadIcons;
            }).then(function () {
                console.log("Icons libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Los Iconos han sido cargados");
                return cssLibs.loadCSS;
            }).then(function () {
                console.log("CSS Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Los Estilos Primarios han sido cargados");
                return cssLibs.loadCustomCss;
            }).then(function () {
                console.log("CSS Custom Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Los Estilos Secundarios han sido cargados");
                return jsLibs.loadHighJS();
            }).then(function () {
                console.log("High JS were loaded");
                return jsLibs.loadMediumJS();
                message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 1/4 han sido cargadas");
            }).then(function () {
                console.log("JS Medium Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 2/4 han sido cargadas");
                return jsLibs.loadLowJS();
            }).then(function () {
                console.log("JS Low Libs were loaded");
                message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 3/4 han sido cargadas");
                return jsLibs.loadDataTables();
            }).then(function () {
                console.log("JS Low 2 were loaded");
                message.changeMessageLoader("pageLoaderContent", "Librerias Javascript 4/4 han sido cargadas");
                return pages.loadAllPages();
            }).then(function (data) {
                console.log("Pages :", data);
                message.changeMessageLoader("pageLoaderContent", "Las Paginas han sido cargadas");
                pages.bootstrapMenu();
            }).catch(function (error) {
                console.log(error);
                message.changeMessageLoader("pageLoaderContent", "Ha ocurrido un error: " + JSON.stringify(error));
            });
        }
    }

    smart.onInit();

});