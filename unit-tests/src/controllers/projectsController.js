angular.module('projectsController', []).controller("projectsController", ['$scope', '$location', function($scope, $location) {

    $scope.$on('$viewContentLoaded', function() {
        getProject(function(projects) {
            $scope.projectsList = projects;
        })
    });

    $scope.addProject = function() {
        $location.path('addproject');
    };

    $scope.viewModels = function(projectName) {
        localStorage.setItem("projectName", projectName);
        $location.path('models');
    };

    $scope.editProject = function(projectID) {
        localStorage.setItem("projectID", projectID);
        $location.path('editproject');
    };

    $scope.deleteProject = function(projectID) {
        passProjecDelete(projectID)
    };

}]);
