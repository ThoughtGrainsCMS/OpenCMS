describe('addProjectController', function() {
    var scope;
    beforeEach(angular.mock.module('addProjectController'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('addProjectController', {
            $scope: scope
        });
    }));

    it('should submitProject', function() {
        var spyOnsubmitProject = jasmine.createSpy("submitProject");
        spyOnsubmitProject.and.callFake(scope.submitProject);
        spyOnsubmitProject();
        scope.$root.$digest();

        expect(spyOnsubmitProject).toHaveBeenCalled();
    });

});
