describe('entriesController', function() {

    var scope, spyOnLocalStorageSetItem, spyOnLocalStorageGetItem, location;

    beforeEach(angular.mock.module('entriesController'));

    beforeEach(inject(function($controller, $rootScope, $location) {
        scope = $rootScope.$new();
        location = $location;
        controller = $controller('entriesController', {
            $scope: scope
        });

        spyOn(localStorage, "getItem").and.callThrough();
        spyOn(localStorage, "setItem").and.callThrough();

    }));

    it("should able to get projectName and modelName from localStorage", function() {

        var projectName = localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");

        var modelName = localStorage.getItem("modelName");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelName");

        var modelID = localStorage.getItem("modelID");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelID");

    });

    it("should call getEntires with projectName, modelName, modelID on load", function() {

        var projectName = localStorage.getItem("projectName");
        var modelName = localStorage.getItem("modelName");
        var modelID = localStorage.getItem("modelID");

        spyOn(window, 'getEntries').and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(window.getEntries).toHaveBeenCalledWith(projectName, modelName, modelID, jasmine.any(Function));

    });

    it("1)should call addEntry and redirect to addEntry page 2)should set projectName and modelName to localStorage", function() {

        var projectName = "demoProject"; //testing purpose
        var modelName = "demoModel"; //testing purpose

        spyOn(location, 'path');
        var spyOnAddEntry = jasmine.createSpy("addEntry");
        spyOnAddEntry.and.callFake(scope.addEntry);
        spyOnAddEntry();

        expect(spyOnAddEntry).toHaveBeenCalled();

        expect(location.path).toHaveBeenCalledWith('addentry');

        expect(localStorage.setItem).toHaveBeenCalledWith("projectName", projectName);

        expect(localStorage.setItem).toHaveBeenCalledWith("modelName", modelName);

    });

    it("1)should call editEntry and redirect to editEntry page 2)should set projectName, modelName, modelID, entryID to localStorage", function() {

        var projectName = "demoProject"; //testing purpose
        var modelName = "demoModel"; //testing purpose
        var modelID = "demoModelID123"; //testing purpose
        var entryID = "demoEntryID123"; //testing purpose

        spyOn(location, 'path');
        var spyOnEditEntry = jasmine.createSpy("editEntries");
        spyOnEditEntry.and.callFake(scope.editEntries);
        spyOnEditEntry(entryID);

        expect(spyOnEditEntry).toHaveBeenCalledWith(entryID);

        expect(location.path).toHaveBeenCalledWith('editentry');

        expect(localStorage.setItem).toHaveBeenCalledWith("projectName", projectName);

        expect(localStorage.setItem).toHaveBeenCalledWith("modelName", modelName);

        expect(localStorage.setItem).toHaveBeenCalledWith("modelID", modelID);

        expect(localStorage.setItem).toHaveBeenCalledWith("entryID", entryID);

    });

    it("should able to call passEntryDelete with entryID, projectName, modelName using localStorage", function() {

        var projectName = "testProjectName"; //testing purpose
        var modelName = "testModelName"; //testing purpose
        var entryID = "testEntryID123"; //testing purpose

        var projectName = localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");


        var modelName = localStorage.getItem("modelName");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelName");


        spyOn(window, 'passEntryDelete').and.callThrough();

        var spyOnDeleteEntries = jasmine.createSpy("deleteEntries");
        spyOnDeleteEntries.and.callFake(scope.deleteEntries);
        spyOnDeleteEntries(entryID);

        expect(spyOnDeleteEntries).toHaveBeenCalledWith(entryID);

        expect(window.passEntryDelete).toHaveBeenCalledWith(entryID, projectName, modelName);

    });

    it("should call uiDownload functiopn with projectName", function() {
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
