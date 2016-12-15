describe('projectsController', function() {
    var scope, location;

    beforeEach(angular.mock.module('projectsController'));

    beforeEach(inject(function($controller, $rootScope, $location, $window) {
        scope = $rootScope.$new();
        location = $location;
        controller = $controller('projectsController', {
            $scope: scope
        });

        spyOn(localStorage, 'setItem').and.callThrough();
    }));

    it('should call getProject()', function() {

        spyOn(window, "getProject").and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(window.getProject).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should go to addproject page when addProject function is called', function() {
        spyOn(location, 'path').and.callThrough();
        scope.addProject();
        scope.$root.$digest();
        expect(location.path).toHaveBeenCalledWith('addproject');
    });

    it('should set projectName to local storage when viewModels function is called', function() {
        var projectName = 'demoProject'; //testing pupose

        var spyOnviewModels = jasmine.createSpy("viewModels");
        spyOnviewModels.and.callFake(scope.viewModels);
        spyOnviewModels(projectName);
        scope.$digest();

        expect(spyOnviewModels).toHaveBeenCalledWith(projectName);

        expect(localStorage.setItem).toHaveBeenCalledWith("projectName", projectName);
    });

    it('should go to models page', function() {
        var projectName = 'demoProject'; //testing pupose

        spyOn(location, 'path').and.callThrough();

        var spyOnviewModels = jasmine.createSpy("viewModels");
        spyOnviewModels.and.callFake(scope.viewModels);
        spyOnviewModels(projectName);
        scope.$root.$digest();

        expect(spyOnviewModels).toHaveBeenCalledWith(projectName);

        expect(location.path).toHaveBeenCalledWith('models');
    });

    it('should set projectID to local storage when editProject function is called', function() {
        var projectID = 'demoProjectID123'; //testing pupose

        var spyOneditProject = jasmine.createSpy("editProject");
        spyOneditProject.and.callFake(scope.editProject);
        spyOneditProject(projectID);
        scope.$root.$digest();

        expect(spyOneditProject).toHaveBeenCalledWith(projectID);

        expect(localStorage.setItem).toHaveBeenCalledWith("projectID", projectID);
    });

    it('should go to editproject page', function() {
        var projectID = 'demoID123'; //testing pupose

        spyOn(location, 'path').and.callThrough();

        var spyOneditProject = jasmine.createSpy("editProject");
        spyOneditProject.and.callFake(scope.editProject);
        spyOneditProject(projectID);
        scope.$root.$digest();

        expect(spyOneditProject).toHaveBeenCalledWith(projectID);

        expect(location.path).toHaveBeenCalledWith('editproject');
    });

    it('should call passProjecDelete function', function() {
        var ProjID = '123';
        var spyOnDeleteProject = jasmine.createSpy("deleteProject");

        spyOn(window, "passProjecDelete").and.callThrough();

        spyOnDeleteProject.and.callFake(scope.deleteProject);
        spyOnDeleteProject(ProjID);
        scope.$root.$digest();
        expect(spyOnDeleteProject).toHaveBeenCalledWith(ProjID);

        expect(window.passProjecDelete).toHaveBeenCalledWith(ProjID);
    });
});
