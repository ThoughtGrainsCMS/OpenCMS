angular.module('modelsController', []).controller("modelsController", ['$scope', '$location', function($scope, $location) {

    var projectName = localStorage.getItem("projectName");

    $scope.$on('$viewContentLoaded', function() {
        getModels(projectName, function(models) {
            $scope.modelsList = models;
        })
    });

    $scope.addModel = function() {
        localStorage.setItem("projectName", projectName);
        $location.path('addmodel');

    };

    $scope.viewEntries = function(projectName, modelName, modelID) {
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("modelName", modelName);
        localStorage.setItem("modelID", modelID);
        $location.path('entries');
    };

    $scope.editModel = function(modelName, projectName, modelID) {
        localStorage.setItem("modelName", modelName);
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("modelID", modelID);
        $location.path('editmodel');
    };

    $scope.deleteModel = function(ModelID, projectName) {
        passModelDelete(ModelID, projectName);
    };

    $scope.uiDownload = function() {
        uiDownload(projectName);
    };

    $scope.downloadProject = function() {
        databaseDownload(projectName);
    };

}]);
