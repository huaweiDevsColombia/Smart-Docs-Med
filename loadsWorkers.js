
/**
 * Get the information from Users Datamodel
 * Make a Ajax Request to get the worker and then call get user service
 */
function getUserInformation() {
    return new Promise(function (resolve, reject) {
        let workerUserInformation = $.ajax({
            method: "GET",
            dataType: "script",
            url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=3e9d8bc0-999e-434f-aeeb-dda673659611&attachmentId=88315474-b2b2-4751-9e8a-2ab077c8ac94",
            cache: false
        });
        $.when(workerUserInformation).done(function (workerUserInformationResponse) {
            $('<script>')
                .attr('type', 'javascript/worker')
                .attr('id', 'workerUserInformation')
                .text(workerUserInformationResponse)
                .appendTo('head');

            let blob = new Blob([
                $("#workerUserInformation").text()
            ], { type: "text/javascript" })
            var worker = new Worker(URL.createObjectURL(blob));

            worker.addEventListener('message', function (e) {
                resolve(e.data);
            }, false);

            worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId }); // Send data to our worker.

            console.log("[Wk] - User Information has Loaded");

        }).fail(function (error) {
            console.log("[Wk] - User Information User has Failed");
            reject(error);
        });
    });
}



module.exports = {
    
    getUserInformation: getUserInformation(),
    
    
    getTemplates:
    /**
 * Get the templates from Templates Datamodel
 * Make a Ajax Request to get the worker and then call get templates get list service
 */
    function getTemplates(project) {
        return new Promise(function (resolve, reject) {
            let workerTemplates = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=015b8292-ebcc-40e6-8601-fbddeb2c0ef5&attachmentId=c24a203d-005f-4d20-ad92-4cd8b14b2cf8",
                cache: false
            });
            $.when(workerTemplates).done(function (workerTemplatesResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTemplates')
                    .text(workerTemplatesResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTemplates").text()
                ], { type: "text/javascript" })

                $("#workerTemplates").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "username": username, "userId": USER_ID, "token": csrfToken, "tenantId": tenantId}); // Send data to our worker.

                console.log("[Wk] - Get Templates has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Templates has Failed");
                reject(error);
            });
        });
    },
    getTemplate:
    function getTemplate(web_location, pdf_location) {
        return new Promise(function (resolve, reject) {
            let workerTemplates = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=8117dc95-0e34-4ac6-abd4-530eefcaafb4&attachmentId=ad1b3ab2-6f5f-4049-a78b-9201a38de3a3",
                cache: false
            });
            $.when(workerTemplates).done(function (workerTemplatesResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerTemplates')
                    .text(workerTemplatesResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerTemplates").text()
                ], { type: "text/javascript" })

                $("#workerTemplates").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.postMessage({ "web_location": web_location, "pdf_location": pdf_location }); // Send data to our worker.

                console.log("[Wk] - Get Template has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Get Template has Failed");
                reject(error);
            });
        });
    },
    loadPDF:
    function (template, template_name, watermark, ticket_id, answers, username) {
        return new Promise(function (resolve, reject) {
            let workerloadPDF = $.ajax({
                method: "GET",
                dataType: "script",
                url: "https://104a-app.teleows.com/servicecreator/fileservice/get?batchId=74bf4e14-16ba-4f3a-9207-ff70bdc73fc6&attachmentId=4d43f3ca-3688-432f-9339-6df2e54443a8",
                cache: false
            });
            $.when(workerloadPDF).done(function (workerloadPDFResponse) {
                $('<script>')
                    .attr('type', 'javascript/worker')
                    .attr('id', 'workerloadPDF')
                    .text(workerloadPDFResponse)
                    .appendTo('head');

                let blob = new Blob([
                    $("#workerloadPDF").text()
                ], { type: "text/javascript" })

                $("#workerloadPDF").remove();

                var worker = new Worker(URL.createObjectURL(blob));

                worker.addEventListener('message', function (e) {
                    resolve(e.data);
                }, false);

                worker.addEventListener("error", function (error) {
                    console.log("Se ha producido un error : " + error);
                }
                    , false);

                worker.postMessage({ "template":JSON.stringify(template), "template_name":template_name, "watermark":watermark, "ticket":ticket_id, "answers":JSON.stringify(answers), "username":username}); // Send data to our worker.

                console.log("[Wk] - Load PDF has Loaded");

            }).fail(function (error) {
                console.log("[Wk] - Load PDF has Failed");
                reject(error);
            });
        });
    }
};