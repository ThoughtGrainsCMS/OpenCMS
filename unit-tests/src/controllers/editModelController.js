angular.module('editModelController', []).controller("editModelController", ['$scope', function($scope) {

    var oldmodelname = '';
    $scope.$on('$viewContentLoaded', function() {
        var modelName = localStorage.getItem("modelName");
        var projectName = localStorage.getItem("projectName");
        var modelID = localStorage.getItem("modelID");
        getModelByID(modelName, projectName, modelID, function(fields) {
            $scope.modelname = fields[0].ui_modelname;
            $scope.projectname = fields[0].projectname;
            $scope.id = fields[0].id;
            oldmodelname += fields[0].modelname;

            var field = fields[0];
            field["fielddatatype"] = field["fielddatatype"].split("#");
            field["ui_fieldname"] = field["ui_fieldname"].split("#");
            field["fieldname"] = field["fieldname"].split("#");
            field["fieldoptions"] = field["fieldoptions"].split("#");
            field["fieldrequired"] = field["fieldrequired"].split("#");
            field["fieldtype"] = field["fieldtype"].split("#");

            var tempArray = [];
            for (var k = 0; k < field["fielddatatype"].length; k++) {
                var arr = {};
                for (var f in field) {
                    if (typeof field[f] === "object") {
                        arr[f] = field[f][k];
                        if (f === "fielddatatype")
                            arr['old_fielddatatype'] = field[f][k];
                    }
                }
                tempArray.push(arr);
            }
            $scope.modelFields = tempArray;
            $scope.addMore("first");
        });

        $scope.typeList = ["header", "subheader", "textbox", "text", "dropdown", "textarea", "password", "datetime", "datetime-local", "date", "month", "time", "week", "number", "email", "url", "tel", "color", "radio", "checkbox"];

        $scope.dataTypeList = ["varchar", "int", "bigint", "blob", "boolean", "decimal", "double", "float", "text", "timestamp", "uuid", "varint"];
    });

    $scope.addMore = function(count) {
        if (count !== "first") {
            $scope.modelFields[$scope.modelFields.length - 1].edit = false;
        }
        $scope.modelFields.push({
            fielddatatype: "",
            fieldname: "",
            fieldoptions: "",
            fieldrequired: "",
            fieldtype: "",
            oldfieldtype: "",
            edit: true
        });
    };

    $scope.removeField = function(index) {
        $scope.modelFields.splice(index, 1);
    };

    $scope.editSubmit = function() {
        var token = window.localStorage.getItem('token');
        var arr = {
            username: token,
            password: '',
            projectname: $scope.projectname,
            count: "",
            oldmodelname: oldmodelname.toLowerCase(),
            modelname: $scope.modelname,
            id: $scope.id,
            fieldobj: []
        };

        for (var i = 0; i < $scope.modelFields.length; i++) {
            if ($scope.modelFields[i].fieldname === "") {
                $scope.modelFields[i].fieldname = $scope.modelFields[i].ui_fieldname;
            } else if ($scope.modelFields[i].fieldname === undefined) {
                $scope.modelFields[i].fieldname = $scope.modelFields[i].ui_fieldname;
            }

            if ($scope.modelFields[i].ui_fieldname !== "" && $scope.modelFields[i].fieldname !== "" && $scope.modelFields[i].fieldname !== undefined && $scope.modelFields[i].fielddatatype !== "" && $scope.modelFields[i].fieldtype !== "" && $scope.modelFields[i].fieldrequired !== "") {
                arr.fieldobj.push($scope.modelFields[i]);
            }
        }

        arr.fieldobj = JSON.stringify(arr.fieldobj);
        editModel(arr)
    };

    var exists = [];
    $scope.checkDuplicate = function(index, event) {

        if ($scope.modelFields[index].edit !== undefined) {
            var e = $.inArray(index, exists);
            if (e !== -1) {
                exists.splice(e, 1);
            }
        }

        var fieldNameVal = event.target.value;
        for (var i = 0; i < $scope.modelFields.length; i++) {
            if ($scope.modelFields[index].edit !== undefined) {
                if (fieldNameVal === $scope.modelFields[i].fieldname && index !== i) {
                    exists.push(index);
                }
                if (fieldNameVal === $scope.modelFields[i].ui_fieldname && index !== i && $scope.modelFields[i].edit !== undefined) {
                    exists.push(index);
                }
            }
        }
        if (exists.length > 0 && $scope.modelFields[index].edit !== undefined) {
            $('#Editmodel').attr('disabled', 'disabled');
        } else if ($scope.modelFields[index].edit !== undefined) {
            $('#Editmodel').removeAttr('disabled');
        }
    };

}]);
