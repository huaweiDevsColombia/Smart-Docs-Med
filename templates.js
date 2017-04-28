let pages = require("./pages");
console.log("Pages" + pages);

module.exports = {
    templateSelected: "",
    templateResponse: "",
    loadTemplates: function () {
        let reference = this;
        return new Promise(function (resolve, reject) {
            var pagesSaved = [];
            var http = new XMLHttpRequest();
            var url = "https://104a-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_med_template_getList,userId:" + USER_ID + ",tenantId:" + tenantId + "}";
            var params = "start=0&limit=100&csrfToken=" + csrfToken + "&serviceId=co_sm_med_template_getList";
            http.open("POST", url, true);
            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    let templates = JSON.parse(http.response).results;
                    resolve(templates);
                }
                else if (http.readyState == 4 && http.status != 200) {
                    reject(http.status);
                }
            }
            http.send(params);
        });
    },
    loadTemplate: function (web_location, pdf_location) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            var responseWebJson;
            var response = [];

            var promise = get(web_location);
            promise.then(function (jsonWebResponse) {
                responseWebJson = jsonWebResponse;
                return get(pdf_location);
            }).then(function (jsonPdfResponse) {
                response.push({ jsonWeb: responseWebJson, jsonPdf: jsonPdfResponse });
                reference.templateResponse = response;
                resolve(response);
            });
            function get(location) {
                return new Promise(function (resolve, reject) {
                    var url = "https://104a-app.teleows.com/servicecreator/fileservice" + location;
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("POST", url, true);
                    xhttp.responseType = 'json';
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.onreadystatechange = function () {//Call a function when the state changes.
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            resolve(xhttp.response);
                        }
                    }
                    xhttp.onerror = function () {
                        reject(xhttp.statusText);
                    };
                    xhttp.send();
                })
            }
        });

    }
}