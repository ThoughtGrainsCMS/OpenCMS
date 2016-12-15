function databaseDownload(ProjName) {
    var token = localStorage.getItem("token");
    var deleteProjectID = {
        username: token,
        password: '',
        projectname: ProjName
    };

    // requestHTTP("POST", 10, deleteProjectID, success, error);

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

    // var pageNameSet = [];
    // var fieldJS = '';
    // var breadcrumb = '';
    // var breadcrumbListCont = '';
    // var zip = new JSZip();
    // var root = zip.folder("TG_CMS");
    // var html = root.folder("templates");
    //
    //
    // if (localStorage.getItem("token") === '') {
    //     window.location.href = "#login";
    // }
    // var token = localStorage.getItem("token");
    // var tokenObj = {username: token, password: '', projectname: projectName};
    //
    //
    // requestHTTP("POST", 23, tokenObj, success, error);
    //
    // function success(msg) {
    //     var pages = msg.Pages;
    //
    //     for (var i = 0; i < pages.length; i++) {
    //         var pageName = pages[i].pagename;
    //         var tokenObj = {username: token, password: '', projectname: projectName, pageid: pages[i].pageid};
    //         requestHTTP("POST", 26, tokenObj, success, error);
    //         function success(msg) {
    //             var columns = msg.Pages;
    //
    //             for (var j = 0; j < columns.length; j++) {
    //                 var tempArray = [];
    //                 var fieldsHtml = '';
    //                 var columnsField = columns[j];
    //                 if (columnsField["fielddatatype"] == null || columnsField == "") {
    //                     tempArray = []
    //                 }
    //                 else {
    //                     columnsField["fielddatatype"] = columnsField["fielddatatype"].split("#");
    //                     columnsField["fieldname"] = columnsField["fieldname"].split("#");
    //                     columnsField["fieldoptions"] = columnsField["fieldoptions"].split("#");
    //                     columnsField["fieldtype"] = columnsField["fieldtype"].split("#");
    //                     columnsField["fieldvalue"] = columnsField["fieldvalue"].split("#");
    //                     columnsField["leftposition"] = columnsField["leftposition"].split("#");
    //                     columnsField["topposition"] = columnsField["topposition"].split("#");
    //                     columnsField["fieldwidth"] = columnsField["fieldwidth"].split("#");
    //                     columnsField["fieldheight"] = columnsField["fieldheight"].split("#");
    //                     columnsField["inputvalue"] = columnsField["inputvalue"].split("#");
    //
    //                     for (var k = 0; k < columnsField["fielddatatype"].length; k++) {
    //                         var arr = {};
    //
    //                         for (var f in columnsField) {
    //                             if (typeof columnsField[f] === "object") {
    //                                 arr[f] = columnsField[f][k];
    //                                 if (f === "fieldname") {
    //                                     arr["ui_fieldname"] = arr["fieldname"];
    //                                     arr['modelname'] = columnsField.modelname;
    //                                     arr['projectname'] = columnsField.projectname;
    //                                 }
    //                             }
    //                         }
    //                         tempArray.push(arr);
    //                     }
    //
    //
    //                     for (var f in tempArray) {
    //                         if (tempArray[f].fieldtype === "dropdown" || tempArray[f].fieldtype === "radio" || tempArray[f].fieldtype === "checkbox") {
    //                             tempArray[f].fieldoptions = tempArray[f].fieldoptions.split(",");
    //                         }
    //                     }
    //                 }
    //
    //                 var fieldOptionsList = '';
    //                 var field;
    //                 var fieldLen = tempArray.length;
    //                 for (var i = 0; i < fieldLen; i++) {
    //                     var fielddatatype = tempArray[i].fielddatatype;
    //                     var fieldName = tempArray[i].fieldname;
    //                     var fieldoptions = tempArray[i].fieldoptions;
    //                     var fieldtype = tempArray[i].fieldtype;
    //                     var fieldvalue = tempArray[i].fieldvalue;
    //                     var leftposition = tempArray[i].leftposition;
    //                     var projectname = tempArray[i].projectname;
    //                     var topposition = tempArray[i].topposition;
    //                     var ui_fieldname = tempArray[i].ui_fieldname;
    //                     var fieldWidth = tempArray[i].fieldwidth;
    //                     var fieldHeight = tempArray[i].fieldheight;
    //                     var inputvalue = tempArray[i].inputvalue;
    //
    //                     if (fieldtype != 'header' && fieldtype != 'subheader' && fieldtype != 'textbox' && fieldtype != 'textarea' && fieldtype != 'dropdown' && fieldtype != 'radio' && fieldtype != 'checkbox' && fieldtype != 'file') {
    //                         if (fieldtype != "text" && fieldtype != "password" && fieldtype != "email" && fieldtype != "url" && fieldtype != "tel") {
    //                             fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '">\
    //                   <label class="field-label">' + ui_fieldname + '</label>\
    //                         <input class="content-input" type="' + fieldtype + '" required="" value="' + fieldvalue + '"/>\
    //                 </div> ';
    //                         }
    //                         else if (fieldtype === "password") {
    //                             fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '">\
    //                   <label class="field-label">' + ui_fieldname + '</label>\
    //                         <input class="content-input" type="' + fieldtype + '" required="" placeholder="' + ui_fieldname + '" value="' + inputvalue + '"/>\
    //                 </div> ';
    //                         } else {
    //                             fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' ">\
    //                   <label class="field-label">' + ui_fieldname + '</label>\
    //                         <input class="content-input" type="' + fieldtype + '" required="" placeholder="' + ui_fieldname + '" value="' + inputvalue + '"/>\
    //                 </div> ';
    //                         }
    //                     }
    //
    //                     else if (fieldtype === 'header') {
    //                         fieldsHtml += '<div class="dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' ">\
    //                         <h1 class="content-input-header"><span>' + fieldvalue + '</span>\
    //                         </h1></div>';
    //                     }
    //
    //                     else if (fieldtype === 'subheader') {
    //                         fieldsHtml += '<div class="dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '">\
    //                         <h4 class="content-input-header"><span>' + fieldvalue + '</span>\
    //                         </h4></div>';
    //                     }
    //
    //                     else if (fieldtype === 'textbox') {
    //                         fieldsHtml += '<div class="dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '; height: ' + fieldHeight + ' ">\
    //                         <textarea class="text-box" readonly>' + fieldvalue + '</textarea> </div>';
    //                     }
    //
    //                     else if (fieldtype === 'textarea') {
    //                         fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + '; height: ' + fieldHeight + ' ">\
    //                  <label class="field-label">' + ui_fieldname + '</label>\
    //                  <textarea class="content-area" placeholder="' + fieldvalue + '" required="" readonly>' + inputvalue + '</textarea>\
    //                 </div> ';
    //                     }
    //
    //                     else if (fieldtype === 'dropdown') {
    //                         fieldOptionsList = '';
    //                         var dropSel = '';
    //
    //                         fieldOptionVals = fieldoptions.toString().split(",");
    //                         var dropDownFieldVal = fieldOptionVals.length;
    //                         for (var j = 0; j < dropDownFieldVal; j++) {
    //                             dropSel = "selected=" + fieldvalue + "";
    //                             fieldOptionsList += '<option value="' + fieldOptionVals[j] + '">' + fieldOptionVals[j] + '</option>';
    //                         }
    //
    //
    //                         fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' ">\
    //                  <label class="field-label">' + ui_fieldname + '</label>\
    //                  <select class="form-control" >\
    //                  ' + fieldOptionsList + '\
    //                  </select>\
    //                 </div>';
    //                     }
    //
    //                     else if (fieldtype === 'radio') {
    //                         fieldOptionsList = '';
    //                         var radioSel = '';
    //                         var fieldOptionVals = fieldoptions.toString().split(",");
    //                         var innerOP;
    //                         var radioFieldVal = fieldOptionVals.length;
    //                         for (j = 0; j < radioFieldVal; j++) {
    //
    //                             fieldOptionsList += '<li>\
    //                                         <label>\
    //                                             <input type="radio" name="radio" value=" ' + fieldOptionVals[j] + ' ">\
    //                                             <span></span> ' + fieldOptionVals[j] + ' \
    //                                         </label>\
    //                                      </li>';
    //                         }
    //
    //
    //                         fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' "><label class="field-label ">' + ui_fieldname + '</label>\
    //                            <div class="dropped-radios">\
    //                                 <ul> ' + fieldOptionsList + '</ul>\
    //                            </div></div>';
    //                     }
    //
    //                     else if (fieldtype === 'checkbox') {
    //                         var checkBoxSel = '';
    //                         fieldOptionsList = '';
    //                         fieldOptionVals = fieldoptions.toString().split(",");
    //                         var checkBoxFieldVal = fieldOptionVals.length;
    //                         for (j = 0; j < checkBoxFieldVal; j++) {
    //                             fieldOptionsList += '<li>\
    //                                         <label>\
    //                                             <input type="checkbox" name="checkbox" value=" ' + fieldOptionVals[j] + ' ">\
    //                                             <span></span>' + fieldOptionVals[j] + '\
    //                                         </label>\
    //                                      </li>';
    //                         }
    //                         fieldsHtml += '<div class="content-text-input dropped-content" style="top:' + topposition + ';left:' + leftposition + '; width: ' + fieldWidth + ' "><label class="field-label">' + ui_fieldname + '</label>\
    //                             <div class="dropped-checkbox">\
    //                                 <ul>' + fieldOptionsList + '</ul>' +
    //                             '           </div></div>';
    //                     }
    //                 }
    //                 var htmlContent = '<div id="sortable">' + fieldsHtml + '</div><script src="JS/TGCMS.js" type="text/javascript"></script>';
    //                 html.file(pageName + ".html", htmlContent);
    //                 pageNameSet.push(pageName);
    //
    //             }
    //         }
    //
    //         function error() {
    //             window.location.href = "#login";
    //         }
    //     }
    // }
    //
    // function error() {
    //     window.location.href = "#login";
    // }
    //
    // for (i in pageNameSet) {
    //     breadcrumbListCont += '<li style="width:calc(100% / ' + pageNameSet.length + ' )"><a class="Projects" id="' + pageNameSet[i].replace(' ', '') + '" href="index.html#/' + pageNameSet[i] + '">' + pageNameSet[i] + '</a>';
    //     breadcrumb = '<div class="breadcrumb-layers"><div class="inners"><ul class="cf">' + breadcrumbListCont + '</ul></div></div>';
    // }
    //
    // var index = [];
    // var appPageNameJS = pageNameSet;
    // for (var i = 0; i < appPageNameJS.length; i++) {
    //     index.push("'" + appPageNameJS[i] + "'");
    //     fieldJS += "this.get('/" + appPageNameJS[i] + "', function () {this.partial('templates/" + appPageNameJS[i] + ".html');});";
    // }
    // var appJS = "$('.cf li a').click(function () {$('.breadcrumb-layers a').removeClass('active');$(this).closest('a').addClass('active');});$('#" + (index[0].replace(/['"]+/g, '')).replace(' ', '') + "').addClass('active');(function ($) {var app = $.sammy('#app', function () {this.get('/index', function () {this.partial('templates/" + (index[0].replace(/['"]+/g, '')) + ".html');});" + fieldJS + "});$(function () {app.run('#/" + (index[0].replace(/['"]+/g, '')) + "');});})(jQuery);";
    //
    // var indexHTML = '<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <title>TG CMS</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <link rel="stylesheet" href="CSS/TGCMS.css"/> </head> <body><header id="header"> <div class="navbar-header"> <a href="http://www.thoughtgrains.com/" target="_blank" class="navbar-brand"> <img class="img-responsive" src="./images/tg_logo_full45.png" alt="Thought Grains Solutions" title="Thought Grains Solutions"/> </a> </div> </header> ' + breadcrumb + ' <div class="main-container"> <div class="main wrapper clearfix"> <div id="app"> <!-- template will be injected here --> </div> </div> </div> <footer class="footer">Footer Content&copy;All Rights Reserved.</footer> </body> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" type="text/javascript"></script> <script src="JS/sammy-latest.min.js" type="text/javascript"></script> <script src="app.js" type="text/javascript"></script> <script src="JS/TGCMS.js" type="text/javascript"></script> </html>';
    //
    // var sammyRouter = $.get('/static/projectDownload/js/sammy-latest.min.js', function (sammyRouterMin) {
    //     sammyRouter = sammyRouterMin;
    // });
    //
    // var cssContent = $.get('/static/projectDownload/css/TGCMS.css', function (css) {
    //     cssContent = css;
    // });
    //
    // var jsContent = "$('textarea').each(function () {var scrollHeight = (($(this)[0].scrollHeight) + 50);$(this).height(scrollHeight);});";
    //
    //
    // $.when(indexHTML, appJS, sammyRouter, cssContent).done(function () {
    //     root.file("ReadMe.txt", "Hello Guest! Welcome to ThoughtGrains Solutions. \n");
    //     root.file("index.html", indexHTML);
    //     root.file("app.js", appJS);
    //
    //     var js = root.folder("JS");
    //     js.file("sammy-latest.min.js", sammyRouter);
    //     js.file("TGCMS.js", jsContent);
    //
    //     var css = root.folder("CSS");
    //     css.file("TGCMS.css", cssContent);
    //
    //     zip.generateAsync({type: "blob"})
    //         .then(function (content) {
    //             saveAs(content, "TG-CMS.zip");
    //         });
    // });

}
