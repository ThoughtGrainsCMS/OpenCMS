function getModelFields(projectName, model, successFnc) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    } else if (projectName === undefined) {
        window.location.href = "#projects";
    } else {

        var token = localStorage.getItem("token");
        var tokenObj = {
            username: token,
            password: '',
            modelname: model,
            projectname: projectName
        };

        // requestHTTP("POST", 18, tokenObj, success, error);

        function success(msg, a, b) {
            successFnc(msg.columns);
        }
        var fields = [{
            "fielddatatype": "testfielddatatype#testfielddatatype1#testfielddatatype2",
            "ui_fieldname": "testfieldui_fieldname#testui_fieldname1#testui_fieldname2",
            "fieldname": "testfieldname#testfieldname1#testfieldname2",
            "fieldoptions": "testfieldoptions,a,b#testfieldoptions,c,d1#testfieldoptions2,e,f",
            "fieldrequired": "testfieldrequired#testfieldrequired1#testfieldrequired2",
            "fieldtype": "radio#testfieldtype1#testfieldtype2"
        }]; //for testing purpose
        successFnc(fields); //for testing purpose

        function error(error) {
            window.location.href = "#login";
        }
    }
}

function addEntry(arr) {

    var formData = new FormData($("form#entryForm")[0]);
    formData.append('username', arr.username);
    formData.append('password', '');
    formData.append('count', arr.count);
    formData.append('modelname', arr.modelname);
    formData.append('projectname', arr.projectname);
    formData.append('filefields', JSON.stringify(arr.filefields));
    formData.append('fieldvalues', JSON.stringify(arr.fieldvalues));
    formData.append('fieldkeys', JSON.stringify(arr.fieldkeys));
    formData.append('filedatatype', JSON.stringify(arr.filedatatype));

    $.ajaxSetup({
        contentType: false,
        processData: false
    });

    // requestHTTP("POST", 19, formData, success, error);

    function success(msg, a, b) {
        if (b.status === 201) {
            window.location.href = "#entries";
        } else if (msg.error != '') {
            setAlertDialog("Error", msg.error, invalidType);

            function invalidType() {
                return true;
            }
        }
        resetAjaxRequest();
    }

    function error(error) {
        resetAjaxRequest();
        if (error.status === 406) {
            setAlertDialog("Error", "Couldn't upload, invalid file type.", invalidType);

            function invalidType() {
                return true;
            }
        } else if (error.status === 409) {
            setAlertDialog("Error", "File already exist in entries.", fileExist);

            function fileExist() {
                return true;
            }
        } else {
            window.location.href = "#login";
        }
    }

    return false;
}
