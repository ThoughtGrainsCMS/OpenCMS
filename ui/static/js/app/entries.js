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

///   File Name   :   entries.js                                                                                     ///

///   Description :   entries.js                                                                                     ///

///                                                                                                                  ///

///   Date :   24/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

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

function getEntries(projectName, model, modelID, successFnc) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    else if (projectName === undefined) {
        window.location.href = "#projects";
    }
    else {

        var token = localStorage.getItem("token");
        var tokenObj = {username: token, password: '', projectname: projectName, modelid: modelID, modelname: model};

        requestHTTP("POST", 17, tokenObj, success, error);

        function success(msg, a, b) {
            successFnc(msg.Entries);
        }

        function error(error) {
            window.location.href = "#login";
        }
    }
}

function passEntryDelete(entryID, projectName, modelName) {
    var token = localStorage.token;
    setConfirmDialog("Delete Entry", "Are you sure?", success, cancel);
    function success() {
        var deleteEntryID = {
            username: token,
            password: '',
            entryid: entryID,
            projectname: projectName,
            modelname: modelName
        };

        requestHTTP("POST", 22, deleteEntryID, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                window.location.href = "#entries";
            }
        }

        function error(msg) {
            setAlertDialog("Error", msg, invalidType);
            function invalidType() {
                return true;
            }
        }
    }

    return true;
}

function cancel() {
    return true;
}