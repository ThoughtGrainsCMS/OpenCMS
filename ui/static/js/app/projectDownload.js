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

///   File Name   :   projectDownload.js                                                                             ///

///   Description :   projectDownload.js                                                                             ///

///                                                                                                                  ///

///   Date :   09/07/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseDownload(ProjName) {
    var token = localStorage.getItem("token");
    var deleteProjectID = {username: token, password: '', projectname: ProjName};

    requestHTTP("POST", 10, deleteProjectID, success, error);

    function success(msg, a, b) {
        if (msg.path) {
            window.location.href = msg.path;
        }
    }

    function error(error) {
        window.location.href = "#projects";
    }
}


function uiDownload(projectName) {

    var pageNameSet = [];
    var fieldJS = '';
    var breadcrumb = '';
    var breadcrumbListCont = '';
    var zip = new JSZip();
    var root = zip.folder("TG_CMS");
    var html = root.folder("templates");


    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    var tokenObj = {username: token, password: '', projectname: projectName};


    requestHTTP("POST", 23, tokenObj, success, error);

    function success(msg) {
        var pages = msg.Pages;
        if (pages.length === 0) {
            setAlertDialog("Error", "There is no page to download", success);
            function success() {
                return true;
            }
        }

        for (var i = 0; i < pages.length; i++) {
            var pageName = pages[i].pagename;
            var tokenObj = {username: token, password: '', projectname: projectName, pageid: pages[i].pageid};
            requestHTTP("POST", 26, tokenObj, success, error);
            function success(msg) {
                var columns = msg.Pages;

                for (var j = 0; j < columns.length; j++) {
                    var tempArray = [];
                    var fieldsHtml = '';
                    var columnsField = columns[j];
                    if (columnsField["fielddatatype"] == null || columnsField == "") {
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
                                    if (f === "fieldname") {
                                        arr["ui_fieldname"] = arr["fieldname"];
                                        arr['modelname'] = columnsField.modelname;
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
                    }

                    var fieldOptionsList = '';
                    var field;
                    var fieldLen = tempArray.length;
                    for (var i = 0; i < fieldLen; i++) {
                        var fielddatatype = tempArray[i].fielddatatype;
                        var fieldName = tempArray[i].fieldname;
                        var fieldoptions = tempArray[i].fieldoptions;
                        var fieldtype = tempArray[i].fieldtype;
                        var fieldvalue = tempArray[i].fieldvalue;
                        var leftposition = tempArray[i].leftposition;
                        var projectname = tempArray[i].projectname;
                        var topposition = tempArray[i].topposition;
                        var ui_fieldname = tempArray[i].ui_fieldname;
                        var fieldWidth = tempArray[i].fieldwidth;
                        var fieldHeight = tempArray[i].fieldheight;
                        var inputvalue = tempArray[i].inputvalue;

                        if (fieldtype != 'header' && fieldtype != 'subheader' && fieldtype != 'textbox' && fieldtype != 'textarea' && fieldtype != 'dropdown' && fieldtype != 'radio' && fieldtype != 'checkbox' && fieldtype != 'file') {
                            if (fieldtype != "text" && fieldtype != "password" && fieldtype != "email" && fieldtype != "url" && fieldtype != "tel") {
                                fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '">\
                      <label class="field-label">' + ui_fieldname + '</label>\
                            <input class="content-input" type="' + fieldtype + '" required="" value="' + fieldvalue + '"/>\
                    </div> ';
                            }
                            else if (fieldtype === "password") {
                                fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '">\
                      <label class="field-label">' + ui_fieldname + '</label>\
                            <input class="content-input" type="' + fieldtype + '" required="" placeholder="' + ui_fieldname + '" value="' + inputvalue + '"/>\
                    </div> ';
                            } else {
                                fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' ">\
                      <label class="field-label">' + ui_fieldname + '</label>\
                            <input class="content-input" type="' + fieldtype + '" required="" placeholder="' + ui_fieldname + '" value="' + inputvalue + '"/>\
                    </div> ';
                            }
                        }

                        else if (fieldtype === 'header') {
                            fieldsHtml += '<div class="dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' ">\
                            <h1 class="content-input-header"><span>' + fieldvalue + '</span>\
                            </h1></div>';
                        }

                        else if (fieldtype === 'subheader') {
                            fieldsHtml += '<div class="dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '">\
                            <h4 class="content-input-header"><span>' + fieldvalue + '</span>\
                            </h4></div>';
                        }

                        else if (fieldtype === 'textbox') {
                            fieldsHtml += '<div class="dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '; height: ' + fieldHeight + ' ">\
                            <textarea class="text-box" readonly>' + fieldvalue + '</textarea> </div>';
                        }

                        else if (fieldtype === 'textarea') {
                            fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '; height: ' + fieldHeight + ' ">\
                     <label class="field-label">' + ui_fieldname + '</label>\
                     <textarea class="content-area" placeholder="' + fieldvalue + '" required="" >' + inputvalue + '</textarea>\
                    </div> ';
                        }

                        else if (fieldtype === 'dropdown') {
                            fieldOptionsList = '';
                            var dropSel = '';

                            fieldOptionVals = fieldoptions.toString().split(",");
                            var dropDownFieldVal = fieldOptionVals.length;
                            for (var j = 0; j < dropDownFieldVal; j++) {
                                dropSel = "selected=" + fieldvalue + "";
                                fieldOptionsList += '<option value="' + fieldOptionVals[j] + '">' + fieldOptionVals[j] + '</option>';
                            }


                            fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' ">\
                     <label class="field-label">' + ui_fieldname + '</label>\
                     <select class="form-control" >\
                     ' + fieldOptionsList + '\
                     </select>\
                    </div>';
                        }

                        else if (fieldtype === 'radio') {
                            fieldOptionsList = '';
                            var radioSel = '';
                            var fieldOptionVals = fieldoptions.toString().split(",");
                            var innerOP;
                            var radioFieldVal = fieldOptionVals.length;
                            for (j = 0; j < radioFieldVal; j++) {

                                fieldOptionsList += '<li>\
                                            <label>\
                                                <input type="radio" name="radio" value=" ' + fieldOptionVals[j] + ' ">\
                                                <span></span> ' + fieldOptionVals[j] + ' \
                                            </label>\
                                         </li>';
                            }


                            fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' "><label class="field-label ">' + ui_fieldname + '</label>\
                               <div class="dropped-radios">\
                                    <ul> ' + fieldOptionsList + '</ul>\
                               </div></div>';
                        }

                        else if (fieldtype === 'checkbox') {
                            var checkBoxSel = '';
                            fieldOptionsList = '';
                            fieldOptionVals = fieldoptions.toString().split(",");
                            var checkBoxFieldVal = fieldOptionVals.length;
                            for (j = 0; j < checkBoxFieldVal; j++) {
                                fieldOptionsList += '<li>\
                                            <label>\
                                                <input type="checkbox" name="checkbox" value=" ' + fieldOptionVals[j] + ' ">\
                                                <span></span>' + fieldOptionVals[j] + '\
                                            </label>\
                                         </li>';
                            }
                            fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' "><label class="field-label">' + ui_fieldname + '</label>\
                                <div class="dropped-checkbox">\
                                    <ul>' + fieldOptionsList + '</ul>' +
                                '           </div></div>';
                        }
                    }
                    var htmlContent = '<div id="sortable">' + fieldsHtml + '</div><script src="JS/TGCMS.js" type="text/javascript"></script>';
                    html.file(pageName + ".html", htmlContent);
                    pageNameSet.push(pageName);

                }
            }

            function error() {
                window.location.href = "#login";
            }
        }
    }

    function error() {
        window.location.href = "#login";
    }

    for (i in pageNameSet) {
        breadcrumbListCont += '<li style="width:calc(100% / ' + pageNameSet.length + ' )"><a class="Projects" id="' + pageNameSet[i].replace(' ', '') + '" href="index.html#/' + pageNameSet[i] + '">' + pageNameSet[i] + '</a>';
        breadcrumb = '<div class="breadcrumb-layers"><div class="inners"><ul class="cf">' + breadcrumbListCont + '</ul></div></div>';
    }

    var index = [];
    var appPageNameJS = pageNameSet;
    for (var i = 0; i < appPageNameJS.length; i++) {
        index.push("'" + appPageNameJS[i] + "'");
        fieldJS += "this.get('/" + appPageNameJS[i] + "', function () {this.partial('templates/" + appPageNameJS[i] + ".html');});";
    }
    var appJS = "$('.cf li a').click(function () {$('.breadcrumb-layers a').removeClass('active');$(this).closest('a').addClass('active');});$('#" + (index[0].replace(/['"]+/g, '')).replace(' ', '') + "').addClass('active');(function ($) {var app = $.sammy('#app', function () {this.get('/index', function () {this.partial('templates/" + (index[0].replace(/['"]+/g, '')) + ".html');});" + fieldJS + "});$(function () {app.run('#/" + (index[0].replace(/['"]+/g, '')) + "');});})(jQuery);";

    var indexHTML = '<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <title>TG CMS</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <link rel="stylesheet" href="CSS/TGCMS.css"/> </head> <body><header id="header"> <div class="navbar-header"> <a href="http://www.thoughtgrains.com/" target="_blank" class="navbar-brand"> <img class="img-responsive" src="https://pbs.twimg.com/profile_images/693331155626528768/hB5rSCMW.png" alt="Thought Grains Solutions" title="Thought Grains Solutions"/> </a> </div> </header> ' + breadcrumb + ' <div class="main-container"> <div class="main wrapper clearfix"> <div id="app"> <!-- template will be injected here --> </div> </div> </div> <footer class="footer">Footer Content&copy;All Rights Reserved.</footer> </body> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" type="text/javascript"></script> <script src="https://cdn.jsdelivr.net/sammy/0.7.4/sammy.js" type="text/javascript"></script> <script src="app.js" type="text/javascript"></script> <script src="JS/TGCMS.js" type="text/javascript"></script> </html>';

    var cssContent = "body * {; font-family: 'Open Sans', sans-serif !important; } body { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Open Sans', sans-serif; font-size: 12px; font-weight: 500; line-height: 18px; text-rendering: optimizeLegibility; } label { display: inline-block; max-width: 100%; margin-bottom: 5px; font-weight: 700; } #header { position: relative; min-height: 0; background: #FFFFFF; /*border-bottom: 1px solid #ddd;*/ /*-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, .3);*/ margin: 0; padding: 0; /*position: fixed;*/ width: 100%; top: 0; } #header, .navbar-header { float: left; min-height: 0; padding: 0; /*width: calc(100% - 50%);*/ } .navbar-brand { height: auto !important; padding: 10px; } .navbar-brand > img { width: 20% !important; height: 20%; } .breadcrumb-layers { border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; background-color: #f4f4f4; /*-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .3);*/ position: relative; float: left; width: 100%; z-index: 1; } .breadcrumb-layers ul { margin: 0; padding: 0; list-style: none; } .breadcrumb-layers li { float: left; width: 19%; height: 30px; /* float: left; */ position: relative; margin: 0; padding: 0; } .breadcrumb-layers a { width: 100%; margin: 0; position: relative; display: block; padding: 6px 0 6px 0; font-size: 13px; font-weight: bold; text-align: center; color: #aaa; cursor: pointer; float: left; border-left: 1px solid; text-decoration: none; } .breadcrumb-layers a:hover { background: #eee; } .breadcrumb-layers a.active { color: white; background-color: #368cd7; } .breadcrumb-layers a span:first-child { display: inline-block; width: 22px; height: 22px; padding: 2px; margin-right: 5px; border: 2px solid #aaa; border-radius: 50%; background-color: #fff; } .breadcrumb-layers a.active span:first-child { color: #aaa; border-color: #fff; background-color: #fff; } .breadcrumb-layers a:before, .breadcrumb-layers a:after { content: ''; position: absolute; top: 0; left: 100%; z-index: 1; display: block; width: 0; height: 0; /*border-top: 16px solid transparent;*/ /*border-bottom: 16px solid transparent;*/ /*border-left: 1px solid transparent;*/ } .breadcrumb-layers a:before { margin-left: 1px; border-left-color: #d5d5d5; } .breadcrumb-layers a:after { border-left-color: #f5f5f5; } .breadcrumb-layers a:hover:after { border-left-color: #eee; } .breadcrumb-layers a.active:after { border-left-color: #368cd7; } @media (max-width: 720px) { .breadcrumb-layers a { padding: 15px; } .breadcrumb-layers a:before, .breadcrumb-layers a:after { border-top-width: 26px; border-bottom-width: 26px; border-left-width: 13px; } } @media (max-width: 620px) { .breadcrumb-layers a { padding: 10px; font-size: 12px; } .breadcrumb-layers a:before, .breadcrumb-layers a:after { border-top-width: 22px; border-bottom-width: 22px; border-left-width: 11px; } } @media (max-width: 520px) { .breadcrumb-layers a { padding: 5px 5px 5px 10px; } .breadcrumb-layers a:before, .breadcrumb-layers a:after { border-top-width: 16px; border-bottom-width: 16px; border-left-width: 8px; } .breadcrumb-layers li a span:first-child { display: block; margin: 0 auto; } .breadcrumb-layers li a span:last-child { display: none; } } .inners { /*max-width: 820px;*/ margin: 0 auto; } .cf:before, .cf:after { content: ' '; display: table; } .cf:after { clear: both; } .content-text-input { /*-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, .3);*/ /*border: 1px outset #F1F1F1;*/ padding: 10px; margin-top: 0; width: 100%; float: left; } .content-text-input h1 { text-align: center; } .dropped-content { width: 92%; position: absolute; float: left; } .field-label { float: left; } .content-input { width: 100%; display: block; border: none; padding: 15px 0; border-bottom: solid 1px #368cd7; -webkit-transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1); transition: all 0.3s cubic-bezier(0.64, 0.09, 0.08, 1); background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 96%, #368cd7 4%); background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 96%, #368cd7 4%); background-position: -2500px 0; background-size: 100% 100%; background-repeat: no-repeat; color: #368cd7; } .content-input:focus { box-shadow: none; outline: none; background-position: 0 0; } .content-input:focus::-webkit-input-placeholder, .content-input:valid::-webkit-input-placeholder { color: #368cd7; -webkit-transition: all 0.3s; transition: all 0.3s; font-size: 11px; -webkit-transform: translateY(-20px); transform: translateY(-20px); visibility: visible !important; } .form-control { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; color: #555; background: #fff none; border: 1px solid #ccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075); -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s; -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s; } .form-control:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6); } .form-control::-moz-placeholder { color: #999; opacity: 1; } .form-control:-ms-input-placeholder { color: #999; } .form-control::-webkit-input-placeholder { color: #999; } .form-control::-ms-expand { background-color: transparent; border: 0; } .form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control { background-color: #eee; opacity: 1; } .form-control[disabled], fieldset[disabled] .form-control { cursor: not-allowed; } .dropped-dropdown { margin-top: 38px; } #sortable { display: block; float: left; list-style-type: none; width: 100%; text-align: center; } .content-input-header { width: 100%; display: block; border: none; color: #666666; } .layer { float: left; width: 100%; height: 100%; } .dropped-radios { margin-top: 0; text-align: center; width: 100%; float: left; } .content-radios ul, .content-checkbox ul, .dropped-radios ul, .dropped-checkbox ul { list-style: none; text-decoration: none; float: left; margin: 0; padding: 5px; text-align: left; width: 100%; height: 100%; } .content-radios ul li input[type='radio'], .dropped-radios ul li input[type='radio'], .content-checkbox ul li input[type='checkbox'], .dropped-checkbox ul li input[type='checkbox'] { display: none; } .content-radios ul li input[type='radio'] span, .dropped-radios ul li input[type='radio'] span { background-color: #fefefe; border: 2px solid #368cd7; border-radius: 50px; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15); display: inline-block; float: left; margin-right: 7px; padding: 7px; position: relative; -webkit-appearance: none; } .content-radios ul li input[type='radio']:checked span, .dropped-radios ul li input[type='radio']:checked span, .content-checkbox ul li input[type='checkbox']:checked span, .dropped-checkbox ul li input[type='checkbox']:checked span { color: #368cd7; } .content-radios ul li input[type='radio']:checked span:after, .dropped-radios ul li input[type='radio']:checked span:after { background: #368cd7; border-radius: 50px; box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.75), inset -1px -1px 1px rgba(0, 0, 0, 0.75); content: ' '; height: 10px; left: 2px; position: absolute; top: 2px; width: 10px; } .content-checkbox ul li input[type='checkbox'] + span, .dropped-checkbox ul li input[type='checkbox'] + span { background-color: #fefefe; border: 2px solid #368cd7; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15); display: inline-block; float: left; margin-right: 7px; padding: 7px; position: relative; -webkit-appearance: none; } .content-radios ul li input[type='radio'] + span, .dropped-radios ul li input[type='radio'] + span { background-color: #fefefe; border: 2px solid #368cd7; border-radius: 50px; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15); display: inline-block; float: left; margin-right: 7px; padding: 7px; position: relative; -webkit-appearance: none; } .content-radios ul li input[type='radio']:checked + span, .dropped-radios ul li input[type='radio']:checked + span, .content-checkbox ul li input[type='checkbox']:checked + span, .dropped-checkbox ul li input[type='checkbox']:checked + span { color: #368cd7; } .content-radios ul li input[type='radio']:checked + span:after, .dropped-radios ul li input[type='radio']:checked + span:after { background: #368cd7; border-radius: 50px; box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.75), inset -1px -1px 1px rgba(0, 0, 0, 0.75); content: ' '; height: 10px; left: 2px; position: absolute; top: 2px; width: 10px; } .content-checkbox ul li input[type='checkbox']:checked + span:after, .dropped-checkbox ul li input[type='checkbox']:checked + span:after { content: '\2714'; height: 10px; left: 2px; position: absolute; top: 0; width: 10px; } .content-radios ul li label:hover input[type='radio'] + span, .dropped-radios ul li label:hover input[type='radio'] + span, .content-checkbox ul li label:hover input[type='checkbox'] + span, .dropped-checkbox ul li label:hover input[type='checkbox'] + span { border-color: #368cd7 #368cd7 #368cd7 #368cd7; } .text-box { width: 100%; margin-top: 7px; resize: none; border: 0; text-align: justify; } .content-area{ width: 100%; margin-top: 7px; resize: none; text-align: justify; } .text-box:focus { outline: 0; } .content-area { height: 75%; } .text-box { height: 95%; } .header-container { float: left; width: 100%; height: 100%; position: relative; } .header-wrapper { float: left; width: 100%; height: 100%; position: relative; } .page-details { list-style: none; margin: 0; padding: 0; width: 100%; float: left; background-color: #5f5f5f; } .page-previous { float: left; width: calc(100% - 75%); } .page-previous a { border: none; color: white; padding: 10px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; cursor: pointer; } .page-previous a:hover { background-color: #449647; } .page-name { width: 50%; float: left; text-align: -webkit-center; } .page-name a { background-color: #008CBA; border: none; color: white; padding: 10px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; } .page-next { float: right; width: 25%; text-align: -webkit-right; } .page-next a { border: none; color: white; padding: 10px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 12px; cursor: pointer; } .page-next a:hover { background-color: #4CAF50; } .main-container { position: relative; width: 100%; float: left; height: 10%; } .footer { bottom: 0px; position: fixed; text-align: center; width: 100%; font-size: 13px; }";

    var jsContent = "$('textarea').each(function () {var scrollHeight = (($(this)[0].scrollHeight) + 50);$(this).height(scrollHeight);});";


    $.when(indexHTML, appJS, cssContent).done(function () {
        root.file("ReadMe.txt", "Hello Guest! Welcome to ThoughtGrains Solutions.  Deploy this project with any server or any Editors which has built in servers like PyCharm, WebStorm.\n");
        root.file("index.html", indexHTML);
        root.file("app.js", appJS);

        var js = root.folder("JS");
        js.file("TGCMS.js", jsContent);

        var css = root.folder("CSS");
        css.file("TGCMS.css", cssContent);

        zip.generateAsync({type: "blob"})
            .then(function (content) {
                saveAs(content, "TG-CMS.zip");
            });
    });

}