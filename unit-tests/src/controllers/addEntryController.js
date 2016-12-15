angular.module('addEntryController', []).controller("addEntryController", ['$scope', function($scope) {

    var projectName = localStorage.getItem("projectName");
    var modelName = localStorage.getItem("modelName");

    $scope.$on('$viewContentLoaded', function() {
        getModelFields(projectName, modelName, function(fields) {
            var field = fields[0];
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

    $scope.submitEntry = function() {
        var fieldKey = [];
        var fieldvalues = [];
        var filefields = [];
        var fileDataType = [];
        var checkIndex = 0;

        $("#Formfields").find(".form-group").each(function(n, a) {
            fieldKey.push({
                fieldKey: $($(this).children()[0]).data("fieldname")
            });
            fileDataType.push({
                fileDataType: $($(this).children()[1]).data("fielddatatype")
            });
            if ($(this).children().length > 2) {
                $(this).children().each(function(n, elem) {
                    if (n !== 0) {
                        var valueElem = $(elem).children();
                        if (valueElem.is(":radio")) {
                            if (valueElem.is(":checked")) {
                                fieldvalues.push({
                                    FieldVals: $(elem).text()
                                });
                            }
                        } else if (valueElem.is(":checkbox")) {
                            if (checkIndex === 0) {
                                fieldvalues.push({
                                    FieldVals: ""
                                });
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

                fieldvalues.push({
                    FieldVals: inputChildren.val()
                });
            }
        });
        if (checkIndex !== 0) {
            fieldvalues[checkIndex]["FieldVals"] = fieldvalues[checkIndex]["FieldVals"].slice(1);
        }

        var token = window.localStorage.getItem('token');
        var arr = {
            username: token,
            password: '',
            count: fieldvalues.length,
            projectname: projectName,
            fieldkeys: fieldKey,
            modelname: modelName,
            fieldvalues: fieldvalues,
            filefields: filefields,
            filedatatype: fileDataType
        };

        addEntry(arr)
    };

}]);
