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

///   File Name   :   addModel.js                                                                                    ///

///   Description :   addModel.js                                                                                    ///

///                                                                                                                  ///

///   Date :   18/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$("#username").html(localStorage.getItem("username"));

$(document).ready(function () {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
});

function addModel(arr) {

    requestHTTP("POST", 12, arr, success, error);

    function success(msg, a, b) {
        if (b.status === 201) {
            window.location.href = "#models";
        }
        else if (msg.error != '') {
            setAlertDialog("Error", msg.error, invalidType);
            function invalidType() {
                return true;
            }
        }
    }

    function error(error) {
        window.location.href = "#login";
    }
}