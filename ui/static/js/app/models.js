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

///   File Name   :   models.js                                                                                      ///

///   Description :   models.js                                                                                      ///

///                                                                                                                  ///

///   Date :   16/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

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

function getModels(projectName, successFnc) {

    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    else if (projectName === undefined) {
        window.location.href = "#projects";
    }
    else {

        var token = localStorage.getItem("token");
        var tokenObj = {username: token, password: '', projectname: projectName};

        requestHTTP("POST", 11, tokenObj, success, error);

        function success(msg, a, b) {
            successFnc(msg.Models);
        }

        function error(error) {
            window.location.href = "#login";
        }
    }
}

function passModelDelete(ModelID, projectName) {
    var token = localStorage.token;
    setConfirmDialog("Delete Model", "Are you sure?", success, cancel);
    function success() {
        var deleteModelID = {username: token, password: '', id: ModelID, projectname: projectName};

        requestHTTP("POST", 16, deleteModelID, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                window.location.href = '#models';
            }
        }

        function error(error, msg) {
            if (error.status === 406) {
                setAlertDialog("Error", "Couldn't delete the model, entries exist.", success);
                function success() {
                    return true;
                }
            }
            else {
                $("#user-error").html(msg);
            }
        }

        return true;
    }

    function cancel() {
        return true;
    }
}