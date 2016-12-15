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

///   File Name   :   projectsController.js                                                                          ///

///   Description :   projectsController.js                                                                          ///

///                                                                                                                  ///

///   Date :   10/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cmsApp.controller("projectsController", ['$scope', '$location', function ($scope, $location) {

    $scope.$on('$viewContentLoaded', function () {
        getProject(function (projects) {
            $scope.projectsList = projects;
        })
    });

    $scope.addProject = function () {
        $location.path('addproject');
    };

    $scope.viewModels = function (projectName) {
        localStorage.setItem("projectName", projectName);
        $location.path('models');
    };

    $scope.editProject = function (projectID) {
        localStorage.setItem("projectID", projectID);
        $location.path('editproject');
    };

    $scope.deleteProject = function (projectID) {
        passProjecDelete(projectID)
    };

}]);