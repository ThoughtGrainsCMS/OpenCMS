angular.module('addProjectController', []).controller("addProjectController", ['$scope', function($scope) {
    $scope.uiname = "";
    $scope.dbname = "";
    $scope.status = "";
    $scope.author = "";


    $scope.submitProject = function() {
        var startDate = $("#startdate").val();
        var endDate = $("#enddate").val();
        // var details = tinyMCE.get('details').getContent();
        var details = "details" //testing purpose


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
