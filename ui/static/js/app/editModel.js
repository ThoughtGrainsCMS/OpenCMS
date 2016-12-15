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

///   File Name   :   editModel.js                                                                                   ///

///   Description :   editModel.js                                                                                   ///

///                                                                                                                  ///

///   Date :   20/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getModelByID(model, projectName, modelID, successFnc) {
    //Cookie checker
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    else if (projectName === undefined) {
        window.location.href = "#projects";
    }
    else {

        var token = localStorage.getItem("token");
        var modelEditId = {username: token, password: '', id: modelID, modelname: model, projectname: projectName};

        requestHTTP("POST", 13, modelEditId, success, error);

        function success(msg, a, b) {
            successFnc(msg.fields);
        }

        function error(error) {
            window.location.href = "#login";
        }
    }
}

function editModel(arr) {

    requestHTTP("POST", 14, arr, success, error);

    function success(msg, a, b) {
        if (b.status === 201) {
            window.location.href = "#models";
        }
        else if (msg.error != '') {
            setAlertDialog("Error", msg.error, invalidType);
            function invalidType() {
                window.location.href = "#models";
            }
        }
    }

    function error(error) {
        if (error.status === 406) {
            setAlertDialog("Error", "Couldn't edit Entries exists", success);
            function success() {
                return true;
            }
        }
        else {
            //window.location.href = "#login";
        }
    }
}