describe('modelsController', function() {
    var scope, location;

    beforeEach(angular.mock.module('modelsController'));

    beforeEach(inject(function($controller, $rootScope, $location) {
        scope = $rootScope.$new();
        location = $location;
        controller = $controller('modelsController', {
            $scope: scope
        });

        spyOn(localStorage, "setItem").and.callThrough();
        spyOn(localStorage, "getItem").and.callThrough();

    }));

    it("should call getModels on load", function() {

        spyOn(window, "getModels").and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        var projectName = localStorage.getItem("projectName");

        expect(window.getModels).toHaveBeenCalledWith(projectName, jasmine.any(Function));
    });

    it("should get projectName from localstorage", function() {

        localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");
    });

    it("should call addModel and redirect to addmodel page", function() {
        var projectName = 'demoProject'; //testing pupose

        spyOn(location, 'path').and.callThrough();
        scope.addModel();

        expect(localStorage.setItem).toHaveBeenCalledWith("projectName", projectName);

        expect(location.path).toHaveBeenCalledWith('addmodel');
    });

    it("should call viewEntries function with projectName,modelName,modelID and set it to localStorage and redirect to entries", function() {
        var projectName = 'demoProject'; //testing pupose
        var modelName = "demoModel"; //testing pupose
        var modelID = "demoModelID123"; //testing pupose

        spyOn(location, 'path').and.callThrough();

        var spyOnviewEntries = jasmine.createSpy("viewEntries");
        spyOnviewEntries.and.callFake(scope.viewEntries);
        spyOnviewEntries(projectName, modelName, modelID);
        scope.$digest();

        expect(spyOnviewEntries).toHaveBeenCalledWith(projectName, modelName, modelID);

        expect(location.path).toHaveBeenCalledWith("entries");

        expect(localStorage.setItem).toHaveBeenCalledWith("projectName", projectName);

        expect(localStorage.setItem).toHaveBeenCalledWith("modelName", modelName);

        expect(localStorage.setItem).toHaveBeenCalledWith("modelID", modelID);
    });

    it("should call editModel with modelName, projectName, modelID, and set it to localstorege and redirect to editmodel page", function() {
        var projectName = 'demoProject'; //testing pupose
        var modelName = "demoModel"; //testing pupose
        var modelID = "demoModelID123"; //testing pupose

        spyOn(location, 'path').and.callThrough();

        var spyOneditModel = jasmine.createSpy("editModel");
        spyOneditModel.and.callFake(scope.editModel);
        spyOneditModel(modelName, projectName, modelID);
        scope.$digest();

        expect(spyOneditModel).toHaveBeenCalledWith(modelName, projectName, modelID);

        expect(location.path).toHaveBeenCalledWith("editmodel");

        expect(localStorage.setItem).toHaveBeenCalledWith("modelName", modelName);

        expect(localStorage.setItem).toHaveBeenCalledWith("projectName", projectName);

        expect(localStorage.setItem).toHaveBeenCalledWith("modelID", modelID);
    });

    it("should able to call passModelDlete function with modelID and projectName", function() {
        var modelID = "demoModelID123"; //testing purpose
        var projectName = "demoProject"; //testing purpose

        var spyOndeleteModel = jasmine.createSpy("deleteModel");
        spyOndeleteModel.and.callFake(scope.deleteModel);
        spyOndeleteModel(modelID, projectName);
        scope.$digest();

        expect(spyOndeleteModel).toHaveBeenCalledWith(modelID, projectName);
    });

    it("should call uiDownload function with projectName", function() {
        var projectName = "demoProject"; //testing purpose

        spyOn(window, 'uiDownload').and.callThrough();

        var spyOnuiDownload = jasmine.createSpy("uiDownload");
        spyOnuiDownload.and.callFake(scope.uiDownload);
        spyOnuiDownload();
        scope.$digest();

        expect(spyOnuiDownload).toHaveBeenCalled();

        expect(window.uiDownload).toHaveBeenCalledWith(projectName);

    });

    it("should call databaseDownload function with projectName", function() {
        var projectName = "demoProject"; //testing purpose

        spyOn(window, 'databaseDownload').and.callThrough();

        var spyOndownloadProject = jasmine.createSpy("downloadProject");
        spyOndownloadProject.and.callFake(scope.downloadProject);
        spyOndownloadProject();
        scope.$digest();

        expect(spyOndownloadProject).toHaveBeenCalled();

        expect(window.databaseDownload).toHaveBeenCalledWith(projectName);

    });

});
