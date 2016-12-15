function getEditEntryFields(projectName, model, modelID, entryID, successFnc) {
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
            projectname: projectName,
            entryid: entryID
        };

        // requestHTTP("POST", 20, tokenObj, success, error);

        function success(msg, a, b) {
            successFnc(msg.Columns, msg.Entries);
        }
        var Columns = [{
            "fielddatatype": "testfielddatatype#testfielddatatype1#testfielddatatype2",
            "ui_fieldname": "testfieldui_fieldname#testui_fieldname1#testui_fieldname2",
            "fieldname": "testfieldname#testfieldname1#testfieldname2",
            "fieldoptions": "testfieldoptions,a,b#testfieldoptions,c,d1#testfieldoptions2,e,f",
            "fieldrequired": "testfieldrequired#testfieldrequired1#testfieldrequired2",
            "fieldtype": "radio#testfieldtype1#testfieldtype2"
        }]; //for testing purpose
        var Entries = [{
            "key": "test",
            "key1": "test1",
            "key2": "test2",
            "key3": "test3",
            "key4": "test4",
            "key5": "test5"
        }]; //for testing purpose
        successFnc(Columns, Entries); //for testing purpose

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

    // requestHTTP("POST", 21, formData, success, error);

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
        resetAjaxRequest();
    }

    return false;
}
