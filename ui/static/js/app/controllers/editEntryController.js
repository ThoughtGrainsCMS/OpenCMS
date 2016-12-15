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

///   File Name   :   editEntryController.js                                                                         ///

///   Description :   editEntryController.js                                                                         ///

///                                                                                                                  ///

///   Date :   29/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cmsApp.controller("editEntryController", ['$scope', '$location', function ($scope) {

    var projectName = localStorage.getItem("projectName");
    var modelName = localStorage.getItem("modelName");
    var modelID = localStorage.getItem("modelID");
    var entryID = localStorage.getItem("entryID");

    $scope.$on('$viewContentLoaded', function () {
        getEditEntryFields(projectName, modelName, modelID, entryID, function (columns, entries) {
            var field = columns[0];
            var entryField = entries;

            field["fielddatatype"] = field["fielddatatype"].split("#");
            field["fieldname"] = field["fieldname"].split("#");
            field["ui_fieldname"] = field["ui_fieldname"].split("#");
            field["fieldoptions"] = field["fieldoptions"].split("#");
            field["fieldrequired"] = field["fieldrequired"].split("#");
            field["fieldtype"] = field["fieldtype"].split("#");

            var tempArray = [];
            for (var k = 0; k < field["fielddatatype"].length; k++) {
                var arr = {};
                for (var f in field) {
                    if (typeof field[f] === "object") {
                        arr[f] = field[f][k];
                        if (f === "fieldname") {
                            arr['fieldvalue'] = entryField[arr.fieldname.toLowerCase()];
                            arr['filename'] = "http://10.10.1.30:10101/uploads/" + projectName + "-" + modelName + "-" + entryField[arr.fieldname.toLowerCase()] + "";
                        }
                    }
                }
                tempArray.push(arr);
            }

            for (var f in tempArray) {
                if (tempArray[f].fieldtype === "dropdown" || tempArray[f].fieldtype === "radio" || tempArray[f].fieldtype === "checkbox") {
                    tempArray[f].fieldoptions = tempArray[f].fieldoptions.split(",");
                }
            }
            $scope.modelFields = tempArray;
        })
    });

    $scope.submitEntry = function () {

        var fieldKey = [];
        var fieldvalues = [];
        var filefields = [];
        var fileDataType = [];
        var checkIndex = 0;
        $("#Formfields").find(".form-group").each(function (n, a) {
            fieldKey.push({fieldKey: $($(this).children()[0]).data("fieldname")});
            fileDataType.push({fileDataType: $($(this).children()[1]).data("fielddatatype")});
            if ($(this).children().length > 2) {
                $(this).children().each(function (n, elem) {
                    if (n !== 0) {
                        var valueElem = $(elem).children();
                        if (valueElem.is(":radio")) {
                            if (valueElem.is(":checked")) {
                                fieldvalues.push({FieldVals: $(elem).text()});
                            }
                        } else if (valueElem.is(":checkbox")) {
                            if (checkIndex === 0) {
                                fieldvalues.push({FieldVals: ""});
                                checkIndex = fieldvalues.length - 1;
                            }
                            if (valueElem.is(":checked")) {
                                fieldvalues[checkIndex]["FieldVals"] = fieldvalues[checkIndex]["FieldVals"] + "," + $(elem).text();
                            }
                        }
                    }
                });
            } else {
                var inputChildren = $($(this).children()[1]);
                if (inputChildren.is("label")) {
                    var fileInput = $(inputChildren).children()[0];
                    if ($(fileInput).val() !== "") {
                        filefields.push($(fileInput).attr("name"));
                        fieldvalues.push({FieldVals: $(fileInput)[0].files[0].name});
                    }
                    else {
                        var oldValue = $($(inputChildren).children()[1]).text();
                        filefields.push(oldValue);
                        fieldvalues.push({FieldVals: oldValue});
                    }
                }
                else {
                    fieldvalues.push({FieldVals: inputChildren.val()});
                }
            }
        });
        if (checkIndex !== 0) {
            fieldvalues[checkIndex]["FieldVals"] = fieldvalues[checkIndex]["FieldVals"].slice(1);
        }
        //fieldKey = fieldKey.slice(1);

        var token = window.localStorage.getItem('token');

        var arr = {
            username: token,
            password: '',
            count: fieldvalues.length,
            projectname: projectName,
            entryid: entryID,
            fieldkeys: fieldKey,
            modelname: modelName,
            filefields: filefields,
            fieldvalues: fieldvalues,
            filedatatype: fileDataType
        };

        editEntry(arr);
    }

}]);
