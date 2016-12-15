////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///------------------------------------------------------------------------------------------------------------------///

///                                   Copyright © 2015-2017 Thought Grains Solutions.                                ///

///                                               All Rights Reserved.                                               ///

///                                                                                                                  ///

///             This software is the confidential and proprietary information of Thought Grains Solutions.           ///

///                                          (Confidential Information)                                              ///

///  --------------------------------------------------------------------------------------------------------------  ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                                                                                                  ///

///   File Name   :   layout.js                                                                                      ///

///   Description :   layout.js                                                                                      ///

///                                                                                                                  ///

///   Date :   05/07/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    $('.download-tab').hover(
        function () {
            $('.download-tab-ul').css({'display': 'block'});
        }, function () {
            $('.download-tab-ul').css({'display': 'none'});
        }
    );
});

$("#username").html(localStorage.getItem("username"));

function loadEntries(successFnc) {

    var columnsField = [];

    var entryField = {
        "checkbox": "ONE",
        "color": "#c0c0c0",
        "date": "2016-01-01",
        "datetime": "01/01/2016",
        "datetimelocal": "2016-01-01T01:00",
        "dropdown": "ONE",
        "email": "exampe@example.com",
        "header": "Header",
        "month": "2016-01",
        "number": "11",
        "password": "Password",
        "radio": "ONE",
        "subheader": "Subheader",
        "tel": "+910123456789",
        "text": "Text",
        "textarea": "Textarea Text",
        "textbox": "Textbox",
        "time": "01:00",
        "url": "http://www.example.com",
        "week": "2016-W01"
    };

    columnsField["fielddatatype"] = ["varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar", "varchar"];
    columnsField["ui_fieldname"] = ["HEADER", "SUBHEADER", "TEXTBOX", "TEXT", "DROPDOWN", "TEXTAREA", "PASSWORD", "DATETIME", "DATETIMELOCAL", "DATE", "MONTH", "TIME", "WEEK", "NUMBER", "EMAIL", "URL", "TEL", "COLOR", "RADIO", "CHECKBOX"];
    columnsField["fieldname"] = ["header", "subheader", "textbox", "text", "dropdown", "textarea", "password", "datetime", "datetimelocal", "date", "month", "time", "week", "number", "email", "url", "tel", "color", "radio", "checkbox"];
    columnsField["fieldoptions"] = ["Header", "Subheader", "Textbox", "Text", "ONE,TWO", "Textarea", "Password", "Datetime", "Datetimelocal", "Date", "Month", "Time", "Week", "Number", "Email", "Url", "Tel", "Color", "ONE,TWO", "ONE,TWO"];
    columnsField["fieldtype"] = ["header", "subheader", "textbox", "text", "dropdown", "textarea", "password", "datetime", "datetime-local", "date", "month", "time", "week", "number", "email", "url", "tel", "color", "radio", "checkbox"];


    var tempArray = [];

    for (var k = 0; k < columnsField["fieldname"].length; k++) {
        var arr = {};

        for (var f in columnsField) {
            if (typeof columnsField[f] === "object") {
                arr[f] = columnsField[f][k];

                if (arr['fieldtype'] == "datetime") {
                    arr['fielddate'] = new Date(entryField[arr.fieldname.toLowerCase()]);
                    arr['fielddate'].setHours(arr['fielddate'].getHours() - 5);
                    arr['fielddate'].setMinutes(arr['fielddate'].getMinutes() - 30);
                }

                else if (arr['fieldtype'] == "datetime-local") {
                    arr['fielddate'] = new Date(entryField[arr.fieldname.toLowerCase()]);
                    arr['fielddate'].setHours(arr['fielddate'].getHours() - 5);
                    arr['fielddate'].setMinutes(arr['fielddate'].getMinutes() - 30);
                }

                else if (arr['fieldtype'] == "date") {
                    arr['fielddate'] = new Date(entryField[arr.fieldname.toLowerCase()]);
                    arr['fielddate'].setHours(arr['fielddate'].getHours() - 5);
                    arr['fielddate'].setMinutes(arr['fielddate'].getMinutes() - 30);
                }

                else if (arr['fieldtype'] == "month") {
                    arr['fielddate'] = new Date(entryField[arr.fieldname.toLowerCase()]);
                    arr['fielddate'].setHours(arr['fielddate'].getHours() - 5);
                    arr['fielddate'].setMinutes(arr['fielddate'].getMinutes() - 30);
                }

                else if (arr['fieldtype'] == "time") {
                    arr['fieldtime'] = new Date("2016-09-20T" + entryField[arr.fieldname.toLowerCase()]);
                    arr['fieldtime'].setHours(arr['fieldtime'].getHours() - 5);
                    arr['fieldtime'].setMinutes(arr['fieldtime'].getMinutes() - 30);
                }

                else if (arr['fieldtype'] == "week") {
                    var week = entryField[arr['fieldname'].toLowerCase()];
                    var weekDate = "";
                    weekofYear(week, function (retWeek) {
                        weekDate = retWeek;
                    });
                    arr['fieldweek'] = new Date(weekDate);
                }

                else if (arr['fieldtype'] == "number") {
                    arr['fieldnumber'] = Number(entryField[arr.fieldname.toLowerCase()]);
                }

                else if (f === "fieldname") {
                    arr['fieldvalue'] = entryField[arr.fieldname.toLowerCase()];
                    arr['projectname'] = columnsField.projectname;
                }
            }
        }
        tempArray.push(arr);
    }

    for (var f in tempArray) {
        if (tempArray[f].fieldtype === "dropdown" || tempArray[f].fieldtype === "radio" || tempArray[f].fieldtype === "checkbox") {
            tempArray[f].fieldoptions = tempArray[f].fieldoptions.split(",");
        }
    }

    successFnc(tempArray);
}


function linkModel(fieldtype, projectName, tempArrayFnc, modelNameFnc) {
    $(".edit-input").hide(300);
    $(".input-close").hide(300);
    $(".menu-layer").hide(300);
    $(".link-control").show(300);
    $(".dropped-content").removeClass("dropped-content-active");
    $(event.target).closest(".dropped-content").addClass("dropped-content-active");

    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }

    var token = localStorage.getItem("token");

    var tokenObj = {
        username: token, password: '', fieldtype: fieldtype, projectname: projectName
    };

    requestHTTP("POST", 28, tokenObj, success, error);

    function success(msg) {
        var columnsField = msg.Models;
        var tempArray = [];
        var modelName = {};

        for (var k = 0; k < columnsField.length; k++) {
            var arr = {};

            var field = columnsField[k];
            for (var f in field) {
                arr[f] = field[f];

                if (f === 'modelname') {
                    var model_name = arr['modelname'];
                    var found = jQuery.inArray(model_name, modelName);
                    if (found === -1) {
                        modelName[model_name] = [];
                    }
                }
            }
            tempArray.push(arr);
        }
        for (var f in tempArray) {
            if (tempArray[f].fieldtype === "dropdown" || tempArray[f].fieldtype === "radio" || tempArray[f].fieldtype === "checkbox") {
                tempArray[f].fieldoptions = tempArray[f].fieldoptions.split(",");
            }
        }

        for (var i in modelName) {
            for (var k = 0; k < columnsField.length; k++) {
                if (i === columnsField[k].modelname) {
                    columnsField[k].fieldvalue = columnsField[k].fieldoptions;
                    if (columnsField[k].fieldtype == "datetime") {
                        columnsField[k].fielddate = new Date("2016-01-01");
                    }
                    else if (columnsField[k].fieldtype == "datetime-local") {
                        columnsField[k].fielddate = new Date("2016-01-01T01:00");
                    }
                    else if (columnsField[k].fieldtype == "date") {
                        columnsField[k].fieldvalue = "2016-01-01";
                    }

                    else if (columnsField[k].fieldtype == "month") {
                        columnsField[k].fieldvalue = "2016-01";
                    }

                    else if (columnsField[k].fieldtype == "time") {
                        columnsField[k].fieldvalue = "01:00";
                    }

                    else if (columnsField[k].fieldtype == "week") {
                        var week = "2016-W01";
                        var weekDate = "";
                        weekofYear(week, function (retWeek) {
                            weekDate = retWeek;
                        });
                        columnsField[k].fieldvalue = new Date(weekDate);
                    }

                    else if (columnsField[k].fieldtype == "number") {
                        columnsField[k].fieldtype = "11";
                    }

                    else if (columnsField[k] === "fieldname") {
                        columnsField[k].fieldvalue = field.fieldoptions;
                        columnsField[k].fieldvalue = field.ui_modelname;
                    }

                    else if (columnsField[k].fieldtype === "dropdown" || columnsField[k].fieldtype === "radio" || columnsField[k].fieldtype === "checkbox") {
                        columnsField[k].fieldoptions = columnsField[k].fieldoptions.split(",");
                    }

                    modelName[i].push(columnsField[k]);
                }
            }
        }
        tempArrayFnc(tempArray);
        modelNameFnc(modelName);
    }

    function error() {
        window.location.href = "#login";
    }
}


function addPages(projectName, currentModel, pagename, successFnc) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    var tokenObj = {
        username: token,
        password: '',
        projectname: projectName,
        modelname: currentModel,
        pagename: pagename
    };


    requestHTTP("POST", 24, tokenObj, success, error);

    function success(msg) {
        $('#content').css({'opacity': 1});
        successFnc(msg.Pages);
    }

    function error(error) {
        if (error.status === 409) {
            setAlertDialog("Error", "Page already exist in this Project.", success);
            function success() {
                return true;
            }
        }
        else {
            window.location.href = "#login";
        }
    }
}

function removePage(pageName, pageID, projectName, successFnc) {

    $('.view-wrapper').css({'opacity': 0.2});
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");

    setConfirmDialog("Delete Page", "Are you sure?", success, cancel);
    function success() {
        var tokenObj = {
            username: token,
            password: '',
            projectname: projectName,
            pagename: pageName,
            pageid: pageID
        };
        requestHTTP("POST", 25, tokenObj, success, error);

        function success(msg, a) {
            $('.view-wrapper').css({'opacity': 1});
            successFnc(msg.Status);
        }

        function error(error) {
            window.location.href = "#login";
        }
    }

    function cancel() {
        $('.view-wrapper').css({'opacity': 1});
        return true;
    }
}


function loadPages(projectName, successFnc) {

    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    var tokenObj = {username: token, password: '', projectname: projectName};

    requestHTTP("POST", 23, tokenObj, success, error);

    function success(msg) {
        successFnc(msg.Pages);
    }

    function error() {
        window.location.href = "#login";
    }
}


function loadPageFields(projectName, selectedPageID, dropArray) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    var tokenObj = {username: token, password: '', projectname: projectName, pageid: selectedPageID};


    requestHTTP("POST", 26, tokenObj, success, error);

    function success(msg) {

        var columnsField = msg.Pages[0];
        var tempArray = [];

        if (columnsField["fielddatatype"] == "" || columnsField["fieldname"] == "" || columnsField["fieldoptions"] == "" || columnsField["fieldtype"] == "" || columnsField["fieldvalue"] == "" || columnsField["leftposition"] == "" || columnsField["topposition"] == "" || columnsField["fieldwidth"] == "" || columnsField["fieldheight"] == "" || columnsField["inputvalue"] == "" || columnsField == "") {
            tempArray = []
        } else if (columnsField["fielddatatype"] == null || columnsField["fieldname"] == null || columnsField["fieldoptions"] == null || columnsField["fieldtype"] == null || columnsField["fieldvalue"] == null || columnsField["leftposition"] == null || columnsField["topposition"] == null || columnsField["fieldwidth"] == null || columnsField["fieldheight"] == null || columnsField["inputvalue"] == "" || columnsField == null) {
            tempArray = []
        }
        else {
            columnsField["fielddatatype"] = columnsField["fielddatatype"].split("#");
            columnsField["fieldname"] = columnsField["fieldname"].split("#");
            columnsField["fieldoptions"] = columnsField["fieldoptions"].split("#");
            columnsField["fieldtype"] = columnsField["fieldtype"].split("#");
            columnsField["fieldvalue"] = columnsField["fieldvalue"].split("#");
            columnsField["leftposition"] = columnsField["leftposition"].split("#");
            columnsField["topposition"] = columnsField["topposition"].split("#");
            columnsField["fieldwidth"] = columnsField["fieldwidth"].split("#");
            columnsField["fieldheight"] = columnsField["fieldheight"].split("#");
            columnsField["inputvalue"] = columnsField["inputvalue"].split("#");

            for (var k = 0; k < columnsField["fielddatatype"].length; k++) {
                var arr = {};
                for (var f in columnsField) {
                    if (typeof columnsField[f] === "object") {
                        arr[f] = columnsField[f][k];
                        if (arr['fieldtype'] == "datetime") {
                            arr['fielddate'] = new Date(arr["fieldvalue"]);
                        }

                        else if (arr['fieldtype'] == "datetime-local") {
                            arr['fielddate'] = new Date(arr["fieldvalue"]);
                        }

                        else if (arr['fieldtype'] == "date") {
                            arr['fielddate'] = new Date(arr["fieldvalue"]);
                        }

                        else if (arr['fieldtype'] == "month") {
                            arr['fielddate'] = new Date(arr["fieldvalue"]);
                        }

                        else if (arr['fieldtype'] == "time") {
                            arr['fieldtime'] = new Date("2016-09-20T" + arr["fieldvalue"]);
                            arr['fieldtime'].setHours(arr['fieldtime'].getHours() - 5);
                            arr['fieldtime'].setMinutes(arr['fieldtime'].getMinutes() - 30);
                        }

                        else if (arr['fieldtype'] == "week") {
                            if (arr["fieldvalue"] != undefined) {
                                var week = arr["fieldvalue"];
                                var weekDate = "";
                                weekofYear(week, function (retWeek) {
                                    weekDate = retWeek;
                                });
                                arr['fieldweek'] = new Date(weekDate);
                            }
                        }

                        else if (arr['fieldtype'] == "number") {
                            arr['fieldnumber'] = Number(arr["fieldvalue"]);
                        }

                        else if (f === "fieldname") {
                            arr["ui_fieldname"] = arr["fieldname"];
                            arr['modelname'] = columnsField.modelname;
                            arr['projectname'] = columnsField.projectname;
                        }
                    }
                }
                tempArray.push(arr);
            }

            for (var i in tempArray) {
                if (tempArray[i].fieldtype === "dropdown" || tempArray[i].fieldtype === "radio" || tempArray[i].fieldtype === "checkbox") {
                    tempArray[i].fieldoptions = tempArray[i].fieldoptions.split(",");
                }
            }
        }
        dropArray(tempArray);
    }

    function error() {
        window.location.href = "#login";
    }
}


function submitForm(pageName, selectedPageID, projectName, droppedList) {

    var token = localStorage.getItem("token");

    var arr = {
        username: token,
        password: '',
        pagename: pageName,
        pageid: selectedPageID,
        projectname: projectName,
        fieldobj: []
    };

    var droppedListLen = droppedList.length;
    var fieldvalue = "";
    var inputvalue = "";
    for (var i = 0; i < droppedListLen; i++) {

        if (droppedList[i].fieldtype == "datetime") {
            fieldvalue = $(".sortable input[type='datetime']").data("value");
        }

        else if (droppedList[i].fieldtype == "datetime-local") {
            fieldvalue = $(".sortable input[type='datetime-local']").data("value");
        }

        else if (droppedList[i].fieldtype == "date") {
            fieldvalue = $(".sortable input[type='date']").data("value");
        }

        else if (droppedList[i].fieldtype == "month") {
            fieldvalue = $(".sortable input[type='month']").data("value");
        }

        else if (droppedList[i].fieldtype == "time") {
            fieldvalue = $(".sortable input[type='time']").data("value");
        }

        else if (droppedList[i].fieldtype == "week") {
            fieldvalue = $(".sortable input[type='week']").data("value");
        }

        else if (droppedList[i].fieldtype == "number") {
            fieldvalue = $(".sortable input[type='number']").data("value");
        }

        else if (droppedList[i].fieldtype == "text") {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = $(".sortable input[type='text']").val()
        }
        else if (droppedList[i].fieldtype == "password") {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = $(".sortable input[type='password']").val();
        }
        else if (droppedList[i].fieldtype == "textarea") {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = $(".sortable textarea").val();
        }

        else if (droppedList[i].fieldtype == "email") {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = $(".sortable input[type='email']").val();
        }

        else if (droppedList[i].fieldtype == "url") {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = $(".sortable input[type='url']").val();
        }

        else if (droppedList[i].fieldtype == "tel") {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = $(".sortable input[type='tel']").val();
        }

        else if (droppedList[i].fieldtype == "textarea") {
            fieldvalue = $(".sortable textarea").val();
        }

        else if (droppedList[i].fieldtype == "textbox") {
            fieldvalue = $(".sortable textarea").val();
        }

        else {
            fieldvalue = droppedList[i].fieldvalue;
            inputvalue = "";
        }

        arr.fieldobj.push({
            "fieldname": droppedList[i].ui_fieldname,
            "leftposition": droppedList[i].leftposition,
            "topposition": droppedList[i].topposition,
            "fieldwidth": droppedList[i].fieldwidth,
            "fieldheight": droppedList[i].fieldheight,
            "fieldvalue": fieldvalue,
            "inputvalue": inputvalue,
            "fieldtype": droppedList[i].fieldtype.toString(),
            "fielddatatype": droppedList[i].fielddatatype.toString(),
            "fieldoptions": droppedList[i].fieldoptions.toString()
        });

    }

    arr.fieldobj = JSON.stringify(arr.fieldobj);

    loader();
    requestHTTP("POST", 27, arr, success, error);

    function success(msg, a) {
    }

    function error(error) {
        window.location.href = "#login";
    }

}

function weekofYear(week, retWeek) {
    var yw = week.split(/\D+0?/),
        weeks = 7 * yw[1] - 7,
        date1 = new Date(yw[0], 0, 1),
        day1 = date1.getDay(),
        incr = (day1 > 0 && day1 < 5) ? -1 : 1;
    if (yw[2]) weeks += (+yw[2]) - 1;

    while (date1.getDay() != 1) {
        date1.setDate(date1.getDate() + incr);
    }
    date1.setDate(date1.getDate() + weeks);
    retWeek(date1);
}

$('.entries-sect').hide();
$('.drop-preview').hide();
$(".pages-section-body").slideUp();
$('.add-new-page').hide();
$(".entry-section").slideUp();
$(".link-section").slideUp();
$(".edit-input").hide();
$(".link-control").hide();

function createTab(event) {
    $('.drop-preview').find('textarea').each(function () {
        $(this).css('height', 50);
    });

    $(".nav-container ul li").removeClass("active");
    $(event.target).addClass("active");
    $(".drop-area").show();
    $(".create-content").show(300);
    $(".drop-control").css({"width": "84%"});
    $(".input-close").show();
    $(".input-edit").show();
    $('.drop-preview').hide();
}

function modelSection(event) {
    $(event.target).find('i').toggleClass('rotated');
}

function pageSection(event) {
    $(event.target).find('i').toggleClass('rotated');
    $(".pages-section-body").slideToggle(300);
}

function addNewPage() {
    $('#content').css({'opacity': 0.2});
    $('.add-new-page').show(300);
    $('.add-new-page input').focus();
}

function addNewPageClose() {
    $('#content').css({'opacity': 1});
    $('.add-new-page').hide(300);
}

function submitNewPage() {
    $('.add-new-page').hide(300);
    $('.add-new-page input').val("");
}

function selectPage(event) {
    $(".pages-section-body").slideToggle(300);
    $("#pages-section i").toggleClass('rotated');
    $('.menu-layer-header').removeClass("selected-drag-side-header");
    $(event.target).closest(".menu-layer-header").addClass("selected-drag-side-header");
    $('.entries-sect').show(300);
}

function entryLink(target) {
    if (!target.is(".drag-side-header")) {
        target = target.closest(".drag-side-header");
    }
    target.find('i').toggleClass('rotated');
    target.siblings(".entry-section").slideToggle(300);
}

function modelLayerSection(target) {
    if (!target.is(".drag-side-header")) {
        target = target.closest(".drag-side-header");
    }
    target.find('i').toggleClass('rotated');
    target.find(".link-section").slideToggle(300);
}

function editInput(event) {
    $(".link-control").hide(300);
    $(".edit-input").show(300);
    $(".menu-layer").hide(300);
    $(".input-close").hide(300);
    $(".dropped-content").removeClass("dropped-content-active");
    $(event.target).closest(".dropped-content").addClass("dropped-content-active");
}

function editClose() {
    $(".menu-layer").show(300);
    $(".edit-input").hide(300);
    $(".input-close").show(300);
    $(".nav-container-tabs").show(300);
    $(".dropped-content").removeClass("dropped-content-active");
}

function linkClose() {
    $(".menu-layer").show(300);
    $(".link-control").hide(300);
    $(".input-close").show(300);
    $(".nav-container-tabs").show(300);
    $(".dropped-content").removeClass("dropped-content-active");
}

function pageFormSave(pageName, selectedPageID, projectName, droppedList, successFnc) {
    var className = $(".sortable");
    var position = [];

    for (var i = 0; i < className.length; i++) {
        var field = className[i];
        var topPositionField = $($(field)[0]).position().top + "px";
        var leftPositionField = $($(field)[0]).position().left;
        var screenWidth = $('.drop-preview').width();
        leftPositionField = (leftPositionField / screenWidth) * 100 + "%";
        var fieldWidth = ($($(field)[0]).width() + 22) + "px";
        var fieldHeight = ($($(field)[0]).height() + 22) + "px";

        position.push({
            topPos: topPositionField,
            leftPos: leftPositionField,
            fieldWidth: fieldWidth,
            fieldHeight: fieldHeight
        });
    }

    for (var k = 0; k < droppedList.length; k++) {
        droppedList[k].topposition = position[k].topPos;
        droppedList[k].leftposition = position[k].leftPos;
        droppedList[k].fieldwidth = position[k].fieldWidth;
        droppedList[k].fieldheight = position[k].fieldHeight;
        droppedList[k].projectname = projectName;
    }

    successFnc(droppedList);
    submitForm(pageName, selectedPageID, projectName, droppedList);
}

function tabFirstLoad(droppedList, newPos) {
    $('.drop-area').children().each(function (n) {
        var topPos = $(this).position().top + "px";
        var leftPos = $(this).position().left;
        var screenWidth = $('.drop-area').width();

        leftPos = (leftPos / screenWidth) * 100 + "%";
        droppedList[n].topPosition = topPos;
        droppedList[n].leftPosition = leftPos;
        newPos(droppedList);
    });
}

function previewTab() {
    $(".nav-container ul li").removeClass("active");
    $(".nav-container ul li").last().addClass("active");
    $(".drop-area").hide();
    $(".create-content").hide(300);
    $('.drop-preview').show();
    $("#sortable").show();
    $(".drop-control").css({"width": "100%"});
    $(".dropped-content").attr('style', '');
    $(".input-close").hide();
    $(".input-edit").hide();

    $('.drop-preview').find('textarea').each(function () {
        if ($(this).height() == "48") {

            var scrollHeight = (($(this)[0].scrollHeight) + 100);
            a = $(this);
            $(this).closest('.sortable').css({
                "height": scrollHeight
            });
            if ($(this).attr('class').split(' ')[0] == "text-box") {
                $(this).css('height', '95%');
            } else if ($(this).attr('class').split(' ')[0] == "content-area") {
                $(this).css('height', '75%');
            }
        }
    });

    var dropPreviewScrollHeight = ($('.drop-preview')[0].scrollHeight) + 100;
    $('.drop-preview').height(dropPreviewScrollHeight);

    setTimeout(function () {
        $(".sortable").children().each(function (n, elem) {
            if ($(this).is('h3')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 80,
                    minWidth: 150,
                    handles: "se"
                });
            } else if ($(this).is('h4')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 50,
                    minWidth: 120,
                    handles: "se"
                });
            } else if ($(this).is('textarea')) {
                var testHeight = '';
                $(this).closest('.sortable').resizable({
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="text"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('select')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 120,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="password"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="datetime"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="datetime-local"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="date"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="month"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="time"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="week"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="number"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="email"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="url"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="tel"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 100,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).is('input[type="color"]')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 80,
                    minWidth: 200,
                    handles: "se"
                });
            } else if ($(this).children().is('ul')) {
                $(this).closest('.sortable').resizable({
                    minHeight: 120,
                    minWidth: 200,
                    handles: "se"
                });
            }
        });

        $('.drop-preview').droppable({
            tolerance: 'fit'
        });

        $(".sortable").draggable({
            containment: ".drop-preview",
            stop: function () {
                $(this).draggable('option', 'revert', 'invalid');
            }
        });

        $('.sortable').droppable({
            greedy: true,
            tolerance: 'touch',
            drop: function (event, ui) {
                ui.draggable.draggable('option', 'revert', true);
            }
        });
    }, 0);

}

function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (10 + o.scrollHeight) + "px";
}