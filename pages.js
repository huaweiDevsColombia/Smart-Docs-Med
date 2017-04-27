let templates = require("./templates");

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
        return new Promise(function (resolve, reject) {
            reference.filterPage('page-002').then(function (pageCode) {
                reference.changeMenuContent(pageCode);
                /*reference.addEventsToMenuItems();*/
                reference.loadNavBar();
                reference.makeProgressive();
                reference.showUserInformationNav();
                return reference.filterPage("page-003")
            }).then(function (pageCode) {
                reference.changeMainContent(pageCode);
                return templates.loadTemplates();
            }).then(function (templates) {
                reference.changeTemplatesPage(templates);
            }).catch(function (error) {
                reject(error);
            });
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
        $("head").append("<link rel='icon' sizes='192x192' href='https://100l-app.teleows.com/servicecreator/fileservice/get?batchId=6296cedb-8b8b-4d71-8b18-2985a3cc43e6&attachmentId=666870'>");
    },
    showUserInformationNav: function (userInformationIn) {
        
        let userInformation = {};
        userInformation.fullname = "fullname";
        userInformation.userGroups = "FME";
        userInformation.userGroup = " - ";
        userInformation.username = "username";
        userInformation.email = "huaweiDevs@huawei.com";

        if (screen.width < 576) {
            $("#navbarBig").remove();
        } else {
            $("#navbarSmall").remove();
        }
        $("#userFullname").text(userInformation.fullname);
        $("#userFullname").append("<span class='caret'></span>");
        $("#userRol").text(userInformation.userGroups);
        $("#userGroup").text(userInformation.userGroup);
        $("#userAccount").text(userInformation.username);
        $("#userEmail").text(userInformation.email);
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
                        template_pdf: "get?batchId=" + template.template_pdf.attachment[0].batchId + "&attachmentId=" + template.template_pdf.attachment[0].attachmentId,
                        template_web: "get?batchId=" + template.template_web.attachment[0].batchId + "&attachmentId=" + template.template_web.attachment[0].attachmentId,
                        author: template.author
                    }
                }, function (event) {
                    let templateSelected = { "template_web": event.data.val.template_web, "template_pdf": event.data.val.template_pdf };
                    reference.templateSelected = templateSelected;
                    console.log(reference.templateSelected);
                    reference.filterPage("page-004").then(function (pageCode) {
                        reference.changeMainContent(pageCode);
                    });
                });
                cont += 1;
            }
        }
    }
}