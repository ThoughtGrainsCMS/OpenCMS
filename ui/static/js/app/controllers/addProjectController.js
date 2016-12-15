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

///   File Name   :   addProjectController.js                                                                        ///

///   Description :   addProjectController.js                                                                        ///

///                                                                                                                  ///

///   Date :   12/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cmsApp.controller("addProjectController", ['$scope', function ($scope) {
    $scope.uiname = "";
    $scope.dbname = "";
    $scope.status = "";
    $scope.author = "";


    $scope.submitProject = function () {
        var startDate = $("#startdate").val();
        var endDate = $("#enddate").val();
        var details = tinyMCE.get('details').getContent();


        var token = window.localStorage.getItem('token');
        var arr = {
            username: token,
            password: '',
            ui_projectname: $scope.uiname,
            projectname: $scope.dbname.replace(/ /g, '').toLowerCase(),
            projectstatus: $scope.status,
            projectstartdate: startDate,
            projectcompletiondate: endDate,
            projectauthor: $scope.author,
            projectdetails: details
        };

        submitProject(arr)
    }
}]);