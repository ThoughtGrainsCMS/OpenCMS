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

///   File Name   :   entriesController.js                                                                           ///

///   Description :   entriesController.js                                                                           ///

///                                                                                                                  ///

///   Date :   24/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cmsApp.controller("entriesController", ['$scope', '$location', function ($scope, $location) {

    var projectName = localStorage.getItem("projectName");
    var modelName = localStorage.getItem("modelName");
    var modelID = localStorage.getItem("modelID");

    $scope.$on('$viewContentLoaded', function () {
        getEntries(projectName, modelName, modelID, function (entries) {
            for (var i in entries) {
                entries[i].allEntries = "";
                for (var k in entries[i]) {
                    if (k !== "iid" && k !== "allEntries") {
                        entries[i].allEntries = entries[i].allEntries + "," + entries[i][k];
                    }
                }
                entries[i].allEntries = entries[i].allEntries.slice(1);
            }
            $scope.entryList = entries;
        })
    });

    $scope.addEntry = function () {
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("modelName", modelName);
        $location.path('addentry');
    };

    $scope.editEntries = function (entryID) {
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("modelName", modelName);
        localStorage.setItem("modelID", modelID);
        localStorage.setItem("entryID", entryID);
        $location.path('editentry');
    };

    $scope.deleteEntries = function (entryID) {

        var projectName = localStorage.getItem("projectName");
        var modelName = localStorage.getItem("modelName");

        passEntryDelete(entryID, projectName, modelName);
    };

    $scope.uiDownload = function () {
        uiDownload(projectName);
    };

    $scope.downloadProject = function () {
        databaseDownload(projectName);
    };

}]);