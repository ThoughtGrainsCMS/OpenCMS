angular.module('editProjectController', []).controller("editProjectController", ['$scope', function($scope) {

    var projectID = localStorage.getItem("projectID");
    $scope.$on('$viewContentLoaded', function() {
        getProjectByID(projectID, function(editProject) {
            editProject[0].projectcompletiondate = new Date(editProject[0].projectcompletiondate);
            editProject[0].projectstartdate = new Date(editProject[0].projectstartdate);
            $scope.editProjectList = editProject[0];
        })
    });

    // $scope.convertDate = function (date) {
    //     return new Date(date);
    // }

}]);
