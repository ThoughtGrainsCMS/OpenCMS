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

///   File Name   :   projects.js                                                                                    ///

///   Description :   projects.js                                                                                    ///

///                                                                                                                  ///

///   Date :   10/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(".user-board").css("display", "block");
$("#username").html(localStorage.getItem("username"));

function getProject(successFnc) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    var tokenObj = {username: token, password: ''};

    requestHTTP("POST", 5, tokenObj, success, error);

    function success(msg, a) {
        successFnc(msg.Projects);
    }

    function error(error) {
        window.location.href = "#login";
    }
}

function passProjecDelete(projectID) {
    var token = localStorage.token;
    setConfirmDialog("Delete Project", "Are you sure?", success, cancel);
    function success() {
        var deleteProjectID = {username: token, password: '', id: projectID};
        requestHTTP("POST", 9, deleteProjectID, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                window.location.href = '#projects';
            }
        }

        function error(error) {
            if (error.status === 403) {
                setAlertDialog("Error", "Couldn't delete the project, models exists", success);
                function success() {
                    return true;
                }
            }
            else {
                window.location.href = "#login";
            }
        }

        return true;
    }

    function cancel() {
        return true;
    }
}
