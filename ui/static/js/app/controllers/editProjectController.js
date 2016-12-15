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

///   File Name   :   editProjectController.js                                                                       ///

///   Description :   editProjectController.js                                                                       ///

///                                                                                                                  ///

///   Date :   14/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cmsApp.controller("editProjectController", ['$scope', function ($scope) {

    var projectID = localStorage.getItem("projectID");
    $scope.$on('$viewContentLoaded', function () {
        getProjectByID(projectID, function (editProject) {
            editProject[0].projectcompletiondate = new Date(editProject[0].projectcompletiondate);
            editProject[0].projectstartdate = new Date(editProject[0].projectstartdate);
            $scope.editProjectList = editProject[0];
        })
    });

    $scope.convertDate = function (date) {
        return new Date(date);
    }

}]);
