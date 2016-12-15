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

///   File Name   :   ajaxRequest.js                                                                                 ///

///   Description :   ajaxRequest.js                                                                                 ///

///                                                                                                                  ///

///   Date :   06/07/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var IP = "";

jQuery.get('../../server/API/ipconfig.json', function (data) {
    IP = ("http://"+data.server_IP+":10101");
});

function requestHTTP(type, urlType, data, successFnc, errorFnc) {
    $.ajax({
        url: getUrl(urlType),
        type: type,
        data: data,
        async: false,
        success: function (msg, a, b) {
            successFnc(msg, a, b);
        },
        error: function (error) {
            errorFnc(error);
        }
    });
}

function getUrl(type) {
    switch (type) {
        case 1:
            return IP + "/api/register";
            break;
        case 2:
            return IP + "/api/forgotpassword";
            break;
        case 3:
            return IP + "/api/login";
            break;
        case 4:
            return IP + "/api/changepassword";
            break;
        case 5:
            return IP + "/api/getproject";
            break;
        case 6:
            return IP + "/api/addproject";
            break;
        case 7:
            return IP + "/api/getprojectbyid";
            break;
        case 8:
            return IP + "/api/editproject";
            break;
        case 9:
            return IP + "/api/deleteproject";
            break;
        case 10:
            return IP + "/api/projectdownload";
            break;
        case 11:
            return IP + "/api/getmodel";
            break;
        case 12:
            return IP + "/api/addmodel";
            break;
        case 13:
            return IP + "/api/getmodelbyid";
            break;
        case 14:
            return IP + "/api/editmodel";
            break;
        case 15:
            return IP + "/api/deletemodelfield";
            break;
        case 16:
            return IP + "/api/deletemodel";
            break;
        case 17:
            return IP + "/api/listentry";
            break;
        case 18:
            return IP + "/api/getmodelfields";
            break;
        case 19:
            return IP + "/api/addentry";
            break;
        case 20:
            return IP + "/api/geteditentryfields";
            break;
        case 21:
            return IP + "/api/editentry";
            break;
        case 22:
            return IP + "/api/deleteentry";
            break;
        case 23:
            return IP + "/api/getpages";
            break;
        case 24:
            return IP + "/api/addpages";
            break;
        case 25:
            return IP + "/api/deletepages";
            break;
        case 26:
            return IP + "/api/loadpagefield";
            break;
        case 27:
            return IP + "/api/addpagefield";
            break;
        case 28:
            return IP + "/api/linkmodel";
            break;
    }
}