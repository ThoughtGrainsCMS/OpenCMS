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

///   File Name   :   editEntry.js                                                                                   ///

///   Description :   editEntry.js                                                                                   ///

///                                                                                                                  ///

///   Date :   29/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditEntryFields(projectName, model, modelID, entryID, successFnc) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    else if (projectName === undefined) {
        window.location.href = "#projects";
    }
    else {

        var token = localStorage.getItem("token");
        var tokenObj = {username: token, password: '', modelname: model, projectname: projectName, entryid: entryID};

        requestHTTP("POST", 20, tokenObj, success, error);

        function success(msg, a, b) {
            successFnc(msg.Columns, msg.Entries);
        }

        function error(error) {
            window.location.href = "#login";
        }
    }
}

function editEntry(arr) {

    var formData = new FormData($("form#entryForm")[0]);
    formData.append('username', arr.username);
    formData.append('password', '');
    formData.append('count', arr.count);
    formData.append('entryid', arr.entryid);
    formData.append('modelname', arr.modelname);
    formData.append('projectname', arr.projectname);
    formData.append('fieldkeys', JSON.stringify(arr.fieldkeys));
    formData.append('filefields', JSON.stringify(arr.filefields));
    formData.append('fieldvalues', JSON.stringify(arr.fieldvalues));
    formData.append('filedatatype', JSON.stringify(arr.filedatatype));

    $.ajaxSetup({
        contentType: false,
        processData: false
    });

    requestHTTP("POST", 21, formData, success, error);

    function success(msg, a, b) {
        if (b.status === 201) {
            window.location.href = "#entries";
        }
        else if (msg.error != '') {
            setAlertDialog("Error", msg.error, invalidType);
            function invalidType() {
                return true;
            }
        }
        resetAjaxRequest();
    }

    function error(error) {
        if (error.status === 406) {
            setAlertDialog("Error", "Couldn't upload, invalid file type.", invalidType);
            function invalidType() {
                return true;
            }
        }
        else if (error.status === 409) {
            setAlertDialog("Error", "File already exist in entries.", fileExist);
            function fileExist() {
                return true;
            }
        }
        else {
            window.location.href = "#login";
        }
        resetAjaxRequest();
    }

    return false;
}
