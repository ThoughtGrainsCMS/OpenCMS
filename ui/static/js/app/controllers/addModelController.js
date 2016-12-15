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

///   File Name   :   addModelController.js                                                                          ///

///   Description :   addModelController.js                                                                          ///

///                                                                                                                  ///

///   Date :   18/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
cmsApp.controller("addModelController", ['$scope', function ($scope) {

    var projectName = localStorage.getItem("projectName");
    if (projectName === undefined) {
        window.location.href = "#projects";
    }

    $scope.typeList = ["header","subheader","textbox","text", "dropdown", "textarea", "password", "datetime", "datetime-local", "date", "month", "time", "week", "number", "email", "url", "tel", "color", "radio", "checkbox"];

    $scope.dataTypeList = ["varchar", "int", "bigint", "blob", "boolean", "decimal", "double", "float", "text", "timestamp", "uuid", "varint"];

    $scope.fieldList = [];
    $scope.addMore = function (count) {
        if ($scope.fieldList.length !== 0)
            $scope.fieldList[$scope.fieldList.length - 1].edit = false;

        $scope.fieldList.push({
            fielddatatype: "",
            fieldname: "",
            fieldoptions: "",
            fieldrequired: "",
            fieldtype: "",
            oldfieldname: "",
            edit: true
        });
    };

    $scope.removeField = function (index) {
        $scope.fieldList.splice(index, 1);
    };

    $scope.$on('$viewContentLoaded', function () {
        $scope.addMore();
    });

    $scope.addSubmit = function () {
        var token = window.localStorage.getItem('token');
        var arr = {
            username: token,
            password: '',
            projectname: projectName,
            count: "",
            modelname: $scope.modelname,
            fieldobj: []
        };

        for (var i = 0; i < $scope.fieldList.length; i++) {
            if ($scope.fieldList[i].fieldname !== "" && $scope.fieldList[i].fielddatatype !== "" && $scope.fieldList[i].fieldtype !== "" && $scope.fieldList[i].fieldrequired !== "") {
                arr.fieldobj.push($scope.fieldList[i]);
            }
        }

        arr.fieldobj = JSON.stringify(arr.fieldobj);
        addModel(arr)
    }

}]);
