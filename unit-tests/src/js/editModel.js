function getModelByID(model, projectName, modelID, successFnc) {
    //Cookie checker
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    } else if (projectName === undefined) {
        window.location.href = "#projects";
    } else {
        var token = localStorage.getItem("token");
        var modelEditId = {
            username: token,
            password: '',
            id: modelID,
            modelname: model,
            projectname: projectName
        };

        // requestHTTP("POST", 13, modelEditId, success, error);

        function success(msg, a, b) {
            successFnc(msg.fields);
        }
        var fields = [{
            "fielddatatype": "testfielddatatype#testfielddatatype1#testfielddatatype2",
            "ui_fieldname": "testfieldui_fieldname#testui_fieldname1#testui_fieldname2",
            "fieldname": "testfieldname#testfieldname1#testfieldname2",
            "fieldoptions": "testfieldoptions#testfieldoptions1#testfieldoptions2",
            "fieldrequired": "testfieldrequired#testfieldrequired1#testfieldrequired2",
            "fieldtype": "testfieldtype#testfieldtype1#testfieldtype2"
        }]; //for testing purpose
        successFnc(fields); //for testing purpose

        function error(error) {
            window.location.href = "#login";
        }
    }
}


function editModel(arr) {

    // requestHTTP("POST", 14, arr, success, error);

    function success(msg, a, b) {
        if (b.status === 201) {
            window.location.href = "#models";
        } else if (msg.error != '') {
            setAlertDialog("Error", msg.error, invalidType);

            function invalidType() {
                return true;
            }
        }
    }

    function error(error) {
        if (error.status === 406) {
            setAlertDialog("Error", "Couldn't edit Entries exists", success);

            function success() {
                return true;
            }
        } else {
            window.location.href = "#login";
        }
    }
}
