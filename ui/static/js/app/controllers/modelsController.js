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

///   File Name   :   modelsController.js                                                                            ///

///   Description :   modelsController.js                                                                            ///

///                                                                                                                  ///

///   Date :   16/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cmsApp.controller("modelsController", ['$scope', '$location', function ($scope, $location) {

    var projectName = localStorage.getItem("projectName");

    $scope.$on('$viewContentLoaded', function () {
        getModels(projectName, function (models) {
            $scope.modelsList = models;
        })
    });

    $scope.addModel = function () {
        localStorage.setItem("projectName", projectName);
        $location.path('addmodel');

    };

    $scope.viewEntries = function (projectName, modelName, modelID) {
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("modelName", modelName);
        localStorage.setItem("modelID", modelID);
        $location.path('entries');
    };

    $scope.editModel = function (modelName, projectName, modelID) {
        localStorage.setItem("modelName", modelName);
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("modelID", modelID);
        $location.path('editmodel');
    };

    $scope.deleteModel = function (ModelID, projectName) {
        passModelDelete(ModelID, projectName);
    };

    $scope.uiDownload = function () {
        uiDownload(projectName);
    };

    $scope.downloadProject = function () {
        databaseDownload(projectName);
    };

}]);
