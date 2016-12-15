describe('editProjectController', function() {
    var scope;

    beforeEach(angular.mock.module('editProjectController'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('editProjectController', {
            $scope: scope
        });
        spyOn(localStorage, "getItem").and.callThrough();
    }));

    it("should able to get projectName and modelName from localStorage", function() {
        var projectID = localStorage.getItem("projectID");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectID");
    });

    it("should call getProjectByID on load", function() {

        var projectID = localStorage.getItem("projectID");

        spyOn(window, "getProjectByID").and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(window.getProjectByID).toHaveBeenCalledWith(projectID, jasmine.any(Function));

    });

});
