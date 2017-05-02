let templates = require("./templates");
let smartEngine = require("./smartEngine");
let worker = require("./loadsWorkers");
let message = require("./messages");

module.exports = {
    "loadAllPages": function loadAllPages() {
        let reference = this;
        return new Promise(function (resolve, reject) {
            var pagesSaved = [];
            var http = new XMLHttpRequest();
            var url = "https://104a-app.teleows.com/servicecreator/pageservices/service.do?forAccessLog={serviceName:co_sm_med_html_pages_getList,userId:" + USER_ID + ",tenantId:" + tenantId + "}";
            var params = "start=0&limit=100&csrfToken=" + csrfToken + "&serviceId=co_sm_med_html_pages_getList";
            http.open("POST", url, true);
            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    let pages = JSON.parse(http.response).results;
                    reference.pages = pages;
                    resolve(pages);
                }
                else if (http.readyState == 4 && http.status != 200) {
                    reject(http.status);
                }
            }
            http.send(params);
        });
    },
    pages: "",
    bootstrapMenu: function () {
        let reference = this;
        reference.filterPage('page-002').then(function (pageCode) {
            reference.changeMenuContent(pageCode);
            message.removeMessageLoader("body");
            message.addMessageLoder("loaderMessage", "#mainContent2");
            /*reference.addEventsToMenuItems();*/
            reference.loadNavBar();
            reference.makeProgressive();
            reference.addEventsToMenu();
            message.changeMessageLoader("loaderMessage", "El Menu Principal ha sido cargado correctamente");
            return reference.filterPage("page-003");
        }).then(function (pageCode) {
            reference.changeMainContent(pageCode);
            $("#pageName").text("Inicio");
            message.changeMessageLoader("loaderMessage", "Consultando Plantillas en @OWS Datamodel");
            return templates.loadTemplates();
        }).then(function (templates) {
            reference.changeTemplatesPage(templates);
            message.removeMessageLoader("#mainContent2");
        }).catch(function (error) {
            reject(error);
        });
    },
    filterPage: function (id_page) {
        let reference = this;
        return new Promise(function (resolve, reject) {
            var pageFilter = reference.pages.filter(function (page) {
                return page.id_page == id_page;
            });
            console.log(pageFilter);
            var attachmentId = pageFilter[0].page_file.attachment[0].attachmentId;
            var batchId = pageFilter[0].page_file.attachment[0].batchId;
            $.get("https://104a-app.teleows.com/servicecreator/fileservice/get?batchId=" + batchId + "&attachmentId=" + attachmentId, function (pageCode) {
                resolve(pageCode);
            }).fail(function (error) {
                reject("error");
            })
        });
    },
    changeMenuContent: function (pageCode) {
        let reference = this;
        $('body').append("<div class='app-container'><div class='row content-container'></div> </div>");
        $('body').addClass("flat-blue");
        $("head").append("<meta name='viewport' content='width=device-width, user-scalable=no'>");
        $('.content-container').append(pageCode);
    },
    changeMainContent: function (pageCode) {
        let reference = this;
        $("#mainContent2").html("");
        $('#mainContent2').append(pageCode);
    },
    loadNavBar: function () {
        $("#_homePage").remove();
        $(function () {
            $(".navbar-expand-toggle").click(function () {
                $(".app-container").toggleClass("expanded");
                return $(".navbar-expand-toggle").toggleClass("fa-rotate-90");
            });
            return $(".navbar-right-expand-toggle").click(function () {
                $(".navbar-right").toggleClass("expanded");
                return $(".navbar-right-expand-toggle").toggleClass("fa-rotate-90");
            });
        });

        $(function () {
            return $(".side-menu .nav .dropdown").on('show.bs.collapse', function () {
                return $(".side-menu .nav .dropdown .collapse").collapse('hide');
            });
        });
    },
    makeProgressive: function () {
        $("head").append("<meta name='mobile-web-app-capable' content='yes'>");
        //$("head").append("<link rel='icon' sizes='192x192' href='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=6296cedb-8b8b-4d71-8b18-2985a3cc43e6&attachmentId=666870'>");
    },
    addEventsToMenu: function () {
        let reference = this;
        $("#itemInicio").click(function () {
            reference.hideNavBar();
            reference.filterPage("page-003").then(function (pageCode) {
                $("#pageName").text("Inicio");
                reference.changeMainContent(pageCode);
                message.changeMessageLoader("loaderMessage", "Consultando Plantillas en @OWS Datamodel");
                return templates.loadTemplates();
            }).then(function (templates) {
                reference.changeTemplatesPage(templates);
                message.removeMessageLoader("#mainContent2");
            });
        });
    },
    hideNavBar: function () {
        $(".app-container").removeClass("expanded");
        $(".navbar-expand-toggle").removeClass("fa-rotate-90");
    },
    changeTemplatesPage: function (allTemplates) {
        let reference = this;
        let cont = 0;
        if (allTemplates.length > 0) {
            $("#templatesNotFound").remove();
            for (let template of allTemplates) {
                $("#allTemplatesDiv").append("<div class='col-sm-12 col-md-6 col-lg-6'><div class=pricing-table><div class=pt-header style=background-color:#fff><div class=plan-pricing><div class=pricing style=font-size:1.5em>" + template.template_name_web + "</div><img src='" + template.icon_template.substr(1).slice(0, -1) + "'style=padding:10px><div class=pricing-type><!--<b>Id:</b>" + template.id_template + "!--></div></div></div><div class=pt-footer><p><b>Ultima Actualizacion: </b> " + template.template_date + " </p><button id='createTemplate_" + cont + "'class='btn btn-primary' style='margin-right:5px;box-shadow: 2px 2px 2px #888888;' type=button>Crear Reporte</button></div></div></div>");
                $("#createTemplate_" + cont).on("click", {
                    val:
                    {
                        id_template: template.id_template,
                        template_date: template.template_date,
                        template_pdf: "/get?batchId=" + template.template_pdf.attachment[0].batchId + "&attachmentId=" + template.template_pdf.attachment[0].attachmentId,
                        template_web: "/get?batchId=" + template.template_web.attachment[0].batchId + "&attachmentId=" + template.template_web.attachment[0].attachmentId,
                        template_name: template.template_name_web,
                        author: template.author
                    }
                }, function (event) {
                    let templateSelected = { "template_web": event.data.val.template_web, "template_pdf": event.data.val.template_pdf, "template_name":event.data.val.template_name };
                    templates.templateSelected = templateSelected;
                    reference.filterPage("page-004").then(function (pageCode) {
                        $("#pageName").text("Edicion Reporte");
                        reference.changeMainContent(pageCode);
                        message.addMessageLoder("loaderMessage", "#mainContent2");
                        message.changeMessageLoader("loaderMessage", "Consultando Plantilla en @OWS Datamodel");
                        templates.loadTemplate(templates.templateSelected.template_web, templates.templateSelected.template_pdf).then(function (templateResponse) {
                            smartEngine.executeEngine(templates.templateResponse[0].jsonWeb);
                            $('#templateNavTabs a:first').tab('show');
                            reference.loadEventSave();
                            message.removeMessageLoader("#mainContent2");
                        });
                    });
                });
                cont += 1;
            }
        }
    },
    loadEventSave: function () {
        let reference = this;
        $("#btnSave").click(function () {
            message.addMessageLoder("loaderMessage", "#mainContent2");
            message.changeMessageLoader("loaderMessage", "Generando Report en PDF");
            let answer = smartEngine.saveAnswer();
            console.log("Save Answer", answer);
            let userAnswer = JSON.parse(answer.userAnswer);
            if (answer.completed) {
                reference.launchAnswerCompletedModal();
            }
            else {
                reference.launchAnswerInCompleteModal(answer.fieldsEmpty);
            }
            worker.loadPDF(templates.templateResponse[0].jsonPdf, "Test Template", true, "No Ticket", userAnswer, username).then(function (loadPdfResponse) {
                console.log("Pdf Response was correct");
                //console.log(loadPdfResponse);
                let preview_pdf = JSON.parse(loadPdfResponse);
                console.log("Recibiendo Data", preview_pdf);
                preview_pdf.footer = function (currentPage, pageCount) {
                    var text = {};
                    text["text"] = "Este reporte fue generado en Huawei Smart Docs @OWS Medellin App - " + new Date().toString().split("GMT")[0] + "\n Pag " + currentPage + " de " + pageCount;
                    text["alignment"] = "center";
                    text["fontSize"] = 6;
                    text["link"] = "https://104a-app.teleows.com/servicecreator/spl/CO_SMART_DOCS_MED/CO_SMART_DOCS__MED_PRODUCTION.spl";
                    return text;
                };

                pdfMake.createPdf(preview_pdf).download(templates.templateSelected.template_name + ".pdf");
                reference.filterPage("page-003").then(function () {
                    message.removeMessageLoader("#mainContent2");
                });
            });
        })
    },
    launchAnswerCompletedModal: function () {
        $("#completedReport").remove();
        $("body").append("<div class='fade modal modal-info'aria-hidden=true aria-labelledby=myModalLabel1 id=completedReport role=dialog style=display:none tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel8>Todos los campos fueron completados</h4></div><div class=modal-body><img src=https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/512/Tick_Mark-256.png style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center>Todos los campos obligatorios fueron completados.</h4></div><div class=modal-footer><input class='btn btn-info'data-dismiss=modal type=button value='OK'></div></div></div></div>");
        $("#completedReport").modal('show');
    },
    launchAnswerInCompleteModal: function (emptyFields) {
        $("#incompleteReport").remove();
        $("body").append("<div class='fade modal modal-info'aria-hidden=true aria-labelledby=myModalLabel1 id=incompletedReport role=dialog style=display:none tabindex=-1><div class=modal-dialog><div class=modal-content><div class=modal-header><h4 class=modal-title id=myModalLabel7>Algunos campos no fueron completados</h4></div><div class=modal-body><img src=https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/chat-256.png style=margin-left:auto;margin-right:auto;display:block width=150px><h4 style=text-align:center>Todos los campos obligatorios no fueron completados</h4><h5 id=emptyFieldsText style=text-align:center></h5></div><div class=modal-footer><input class='btn btn-info'data-dismiss=modal type=button value=OK></div></div></div></div>");
        $("#emptyFieldsText").text(emptyFields);
        $("#incompletedReport").modal('show');
    }
}