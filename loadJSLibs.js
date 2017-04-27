module.exports = {
    /**
     * Load JS hierarchically - loadHighJS
     * bootstrap  
     */
    "loadHighJS": function() {
        return new Promise(function(resolve, reject) {
            let bootstrap = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            });
            $.when(bootstrap).done(function(bootstrapResponse) {
                resolve();
            }).fail(function(error) {
                reject(error);
            });
        });
    },
    /**
     * Load JS hierarchically - loadMediumJS
     * Boostrap Switch - JqueryMinHeight - Jquery Datatables
     */
    "loadMediumJS": function loadMediumJS() {
        return new Promise(function(resolve, reject) {
            let bootstrapSwitch = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-switch/3.3.4/js/bootstrap-switch.min.js"
            });
            let jqueryMinHeight = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js"
            });
            /*let jqueryDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=20cb4446-a397-434d-bf86-02ca0d83618c&attachmentId=3140a49c-5b12-4641-8c00-d249346fcb7c"
            });*/
            let pdfmake = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/pdfmake.min.js"
            });
            $.when(bootstrapSwitch, jqueryMinHeight, /*jqueryDataTables,*/ pdfmake)
                .done(function(bootstrapSwitchResponse, jqueryMinHeightResponse, /*jqueryDataTablesResponse,*/ pdfmakeResponse) {
                    resolve();
                }).fail(function(error) {
                    reject(error);
                });
        });
    },
    /**
     * Load JS hierarchically - LoadLowJS
     * Bootstrap Datatables - buttonsDatatble - vs_fonts
     */
    "loadLowJS": function() {
        return new Promise(function(resolve, reject) {
            /*let bootstrapDataTables = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"
            });
            */
            let vs_fonts = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.26/vfs_fonts.js",
                cache: false
            });
            $.when( /*bootstrapDataTables,*/ vs_fonts)
                .done(function( /*bootstrapDataTablesResponse,*/ vs_fontsResponse) {
                    resolve();
                }).fail(function(error) {
                    reject(error);
                });
        });
    },

    "loadDataTables": function() {
        return new Promise(function(resolve, reject) {
            let dataTables = $.ajax({
                method: "GET",
                dataType: "script",
                //url: "https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-html5-1.2.4/b-print-1.2.4/datatables.min.js"
                url: "https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.13/b-1.2.4/b-colvis-1.2.4/b-html5-1.2.4/b-print-1.2.4/cr-1.3.2/r-2.1.1/datatables.min.js",
                cache: false
            });
            $.when(dataTables)
                .done(function(dataTablesResponse) {
                    let bootstrapDataTables = $.ajax({
                        method: "GET",
                        dataType: "script",
                        url: "http://cdn.datatables.net/plug-ins/e9421181788/integration/bootstrap/3/dataTables.bootstrap.js",
                        cache: false
                    });
                    $.when(bootstrapDataTables)
                        .done(function(bootstrapDataTablesResponse) {
                            resolve();
                        }).fail(function(error) {
                            reject(error);
                        });
                }).fail(function(error) {
                    reject(error);
                });
        })
    }
}