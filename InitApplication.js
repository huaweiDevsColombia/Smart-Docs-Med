$(function() {
    let jsLibs = require("./loadJSLibs");
    let smart = {
        onInit: function() {
            let reference = this;
            $("link").remove();
            $("script").remove();

            jsLibs.loadMediumJS().then(function() {
                    console.log("JS Medium Libs were loaded");
                    return jsLibs.loadLowJS();
                })
                .then(function() {
                    console.log("JS Low Libs were loaded");
                    return jsLibs.loadDataTables();
                })
                .then(function() {
                    console.log("JS Low 2 were loaded");
                });
        }
    }

    smart.onInit();

});