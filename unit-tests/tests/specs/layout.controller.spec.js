describe('layoutController', function() {

    var scope, spyOnLocalStorageSetItem, spyOnLocalStorageGetItem, location;

    beforeEach(angular.mock.module('layoutController'));

    beforeEach(inject(function($controller, $rootScope, $location) {
        scope = $rootScope.$new();
        location = $location;
        controller = $controller('layoutController', {
            $scope: scope,
        });

        spyOn(localStorage, "getItem").and.callThrough();
        spyOn(localStorage, "setItem").and.callThrough();

    }));

    it("should able to get projectName from localStorage", function() {

        var projectName = localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");

    });

    it("on load should able call loadPages with projectName", function() {

        var projectName = localStorage.getItem("projectName");

        spyOn(window, 'loadPages').and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(window.loadPages).toHaveBeenCalledWith(projectName, jasmine.any(Function));

    });

    it('calls modelLayerSection with event', function() {

        var event = $.Event('click'); // testing purpose
        event.which = 65; // testing purpose

        var keyUpTrigger = '<input class="form-control form-fields" value="testValue" type="text" placeholder="Field Name"/>'; // testing purpose

        $(keyUpTrigger).trigger(event); // testing purpose

        spyOn(window, "modelSection").and.callThrough();

        var spyOnModelSection = jasmine.createSpy('modelSection');
        spyOnModelSection.and.callFake(scope.modelSection);
        spyOnModelSection(event);

        expect(spyOnModelSection).toHaveBeenCalledWith(event);

        expect(window.modelSection).toHaveBeenCalledWith(event);

    });

    it("should call modelLayerSection variable target", function() {

        var event = $.Event('click'); // testing purpose
        event.which = 65; // testing purpose

        var keyUpTrigger = '<input class="form-control form-fields" value="testValue" type="text" placeholder="Field Name"/>'; // testing purpose

        $(keyUpTrigger).trigger(event); // testing purpose

        var target = $(event.target);

        spyOn(window, "modelLayerSection").and.callThrough();

        var spyOnModelLayerSection = jasmine.createSpy('modelLayerSection');
        spyOnModelLayerSection.and.callFake(scope.modelLayerSection);
        spyOnModelLayerSection(event);

        expect(spyOnModelLayerSection).toHaveBeenCalledWith(event);

        expect(window.modelLayerSection).toHaveBeenCalledWith(target);

    });

    it('calls pageSection with event', function() {

        var event = $.Event('click'); // testing purpose
        event.which = 65; // testing purpose

        var keyUpTrigger = '<button id="sampleButton" type="button" ng-click="pageSection()"></button>'; // testing purpose

        $(keyUpTrigger).trigger(event); // testing purpose

        spyOn(window, "pageSection").and.callThrough();

        var spyOnPageSection = jasmine.createSpy('pageSection');
        spyOnPageSection.and.callFake(scope.pageSection);
        spyOnPageSection(event);

        expect(spyOnPageSection).toHaveBeenCalledWith(event);

        expect(window.pageSection).toHaveBeenCalledWith(event);

    });

    it('calls addNewPage', function() {

        spyOn(window, "addNewPage").and.callThrough();

        var spyOnAddNewPage = jasmine.createSpy('addNewPage');
        spyOnAddNewPage.and.callFake(scope.addNewPage);
        spyOnAddNewPage();

        expect(spyOnAddNewPage).toHaveBeenCalled();

        expect(window.addNewPage).toHaveBeenCalled();

    });

    it('calls addNewPageClose', function() {

        spyOn(window, "addNewPageClose").and.callThrough();

        var spyOnAddNewPageClose = jasmine.createSpy('addNewPageClose');
        spyOnAddNewPageClose.and.callFake(scope.addNewPageClose);
        spyOnAddNewPageClose();

        expect(spyOnAddNewPageClose).toHaveBeenCalled();

        expect(window.addNewPageClose).toHaveBeenCalled();

    });

    it('calls addPages,loadPages and submitNewPage ', function() {

        scope.newPageName = "testPage" //testing purpose

        var pageName = scope.newPageName;
        var currentModel = '';
        var projectName = localStorage.getItem("projectName");

        spyOn(window, "addPages").and.callThrough();
        spyOn(window, "loadPages").and.callThrough();
        spyOn(window, "submitNewPage").and.callThrough();

        var spyOnSubmitNewPage = jasmine.createSpy('submitNewPage');
        spyOnSubmitNewPage.and.callFake(scope.submitNewPage);
        spyOnSubmitNewPage();

        expect(spyOnSubmitNewPage).toHaveBeenCalled();

        expect(window.addPages).toHaveBeenCalledWith(projectName, currentModel, pageName, jasmine.any(Function));

        expect(window.loadPages).toHaveBeenCalledWith(projectName, jasmine.any(Function));

        expect(window.submitNewPage).toHaveBeenCalled();

    });

    it("should able to call loadPageFields,loadEntries and selectPage", function() {

        var pageID = "demoPageID123" //testing purpose
        scope.selectedPage = "demoPage" //testing purpose
        var projectName = localStorage.getItem("projectName"); //testing purpose
        var selectedPageID = pageID; //testing purpose

        var event = "testEvent" // testing purpose

        spyOn(window, "loadPageFields").and.callThrough();
        spyOn(window, "loadEntries").and.callThrough();
        spyOn(window, "selectPage").and.callThrough();

        var spyOnSelectPage = jasmine.createSpy('selectPage');
        spyOnSelectPage.and.callFake(scope.selectPage);
        spyOnSelectPage(event, pageID);

        expect(spyOnSelectPage).toHaveBeenCalledWith(event, pageID);

        expect(window.loadPageFields).toHaveBeenCalledWith(projectName, selectedPageID, jasmine.any(Function));

        expect(window.loadEntries).toHaveBeenCalledWith(jasmine.any(Function));

        expect(window.selectPage).toHaveBeenCalledWith(event);

    });

    it("should call removePage with index,pageName, pageID", function() {

        var pageID = "demoPageID123" //testing purpose
        var pageName = "demoPage"; //testing purpose
        var index = "1"; //testing purpose
        scope.pagesList = ["page", "page1", "page2"];

        spyOn(scope.pagesList, 'splice').and.callThrough();

        var spyOnRemovePage = jasmine.createSpy('removePage');
        spyOnRemovePage.and.callFake(scope.removePage);
        spyOnRemovePage(index, pageName, pageID);

        expect(spyOnRemovePage).toHaveBeenCalledWith(index, pageName, pageID);

        expect(scope.pagesList.splice).toHaveBeenCalledWith(index, 1);

        expect(scope.selectedPage).toEqual("Pages");

        expect($('.menu-layer-header')).not.toHaveClass('selected-drag-side-header');

    });

    it("should able to call linkModel", function() {

        var index = "1" //testing purpose
        var fieldtype = "varchar" //testing purpose

        spyOn(scope, "linkModel").and.callThrough();
        scope.linkModel(index, fieldtype);
        expect(scope.linkModel).toHaveBeenCalledWith(index, fieldtype);

    });

    it("calls createTab when currentTab is equals to create", function() {

        var event = "event"; //testing purpose
        var currentTab = "create" //testing purpose

        expect(currentTab).toEqual("create");

        spyOn(window, "createTab").and.callThrough();

        var spyOnCreateTab = jasmine.createSpy("creayeTab");
        spyOnCreateTab.and.callFake(scope.createTab);
        spyOnCreateTab(event);

        expect(spyOnCreateTab).toHaveBeenCalledWith(event);
        expect(window.createTab).toHaveBeenCalledWith(event);

    });

    it("should able to call previewTab", function() {

        scope.droppedList = ["test", "test1", "test2"];

        spyOn(window, "tabFirstLoad").and.callThrough();
        spyOn(window, "previewTab").and.callThrough();

        var spyOnPreviewtab = jasmine.createSpy("previewTab");
        spyOnPreviewtab.and.callFake(scope.previewTab);
        spyOnPreviewtab();

        expect(spyOnPreviewtab).toHaveBeenCalledWith();
        expect(window.tabFirstLoad).toHaveBeenCalledWith(scope.droppedList, jasmine.any(Function));
        expect(window.tabFirstLoad).toHaveBeenCalled();

    });

    it("should call entryLink", function() {

        var event = $.Event('click'); // testing purpose
        event.which = 65; // testing purpose

        var keyUpTrigger = '<input class="form-control form-fields" value="testValue" type="text" placeholder="Field Name"/>'; // testing purpose

        $(keyUpTrigger).trigger(event); // testing purpose

        var target = $(event.target); //testing purpose

        spyOn(window, "entryLink");

        var spyOnEntryLink = jasmine.createSpy("entryLink");
        spyOnEntryLink.and.callFake(scope.entryLink);
        spyOnEntryLink(event);

        expect(spyOnEntryLink).toHaveBeenCalledWith(event);
        expect(window.entryLink).toHaveBeenCalledWith(target);

    });

    it("should call saveForm ", function() {

        var currentTab = "create"; //testing purpose
        scope.selectedPage = "testPage"; //testing purpose
        var selectedPageID = ""; //testing purpose
        var projectName = "demoProject"; //testing purpose
        scope.droppedList = ["test", "test1", "test2"]; //testing purpose


        spyOn(window, "pageFormSave");

        var spyOnSaveForm = jasmine.createSpy("saveForm");
        spyOnSaveForm.and.callFake(scope.saveForm);
        spyOnSaveForm();

        expect(spyOnSaveForm).toHaveBeenCalled();

        expect(currentTab).toEqual("create");

        expect(window.pageFormSave).toHaveBeenCalledWith(scope.selectedPage, selectedPageID, projectName, scope.droppedList, jasmine.any(Function));

    });

    it("should able to call remove function with index", function() {

        var index = "1"; //testing purpose
        scope.droppedList = ["test", "test1", "test2"]; //testing purpose

        spyOn(scope.droppedList, "splice").and.callThrough();

        var spyOnRemove = jasmine.createSpy("remove");
        spyOnRemove.and.callFake(scope.remove);
        spyOnRemove(index);

        expect(spyOnRemove).toHaveBeenCalledWith(index);

        expect(scope.droppedList.splice).toHaveBeenCalledWith(index, 1);

    });

    it("should able to call editInput", function() {

        var index = "1"; //testing purpose
        var ui_FieldName = "test_ui_FieldName"; //testing purpose
        var fieldValue = "test_fieldValue"; //testing purpose
        var fieldDate = "24/11/2046"; //testing purpose
        var fieldTime = "11:05:00"; //testing purpose
        var fieldWeek = "24/11"; //testing purpose
        var fieldNumber = "24"; //testing purpose
        var fieldType = "varchar"; //testing purpose
        var fieldOptions = "testfieldOptions"; //testing purpose
        var projectName = "demoProject"; //testing purpose
        var inputValue = "testInputValue"; //testing purpose

        var spyOnEditInput = jasmine.createSpy("editInput");
        spyOnEditInput.and.callFake(scope.editInput);
        spyOnEditInput(event, index, ui_FieldName, fieldValue, fieldDate, fieldTime, fieldWeek, fieldNumber, fieldType, fieldOptions, projectName, inputValue);

        expect(spyOnEditInput).toHaveBeenCalledWith(event, index, ui_FieldName, fieldValue, fieldDate, fieldTime, fieldWeek, fieldNumber, fieldType, fieldOptions, projectName, inputValue);

        var spyOnEditClose = jasmine.createSpy("editClose");
        spyOnEditClose.and.callFake(scope.editClose);
        spyOnEditClose();

        expect(spyOnEditClose).toHaveBeenCalled();

        var spyOnLinkClose = jasmine.createSpy("linkClose");
        spyOnLinkClose.and.callFake(scope.linkClose);
        spyOnLinkClose();

        expect(spyOnLinkClose).toHaveBeenCalled();

    });

    it("should call layoutEdit", function() {

        var index = "1"; //testing purpose
        var ui_FieldName = "test_ui_FieldName"; //testing purpose
        var fieldValue = "test_fieldValue"; //testing purpose
        var fieldDate = "24/11/2046"; //testing purpose
        var fieldTime = "11:05:00"; //testing purpose
        var fieldWeek = "24/11"; //testing purpose
        var fieldNumber = "24"; //testing purpose
        var fieldType = "varchar"; //testing purpose
        var fieldOptions = "testfieldOptions"; //testing purpose
        var projectName = "demoProject"; //testing purpose
        var inputValue = "testInputValue"; //testing purpose
        scope.droppedList = [{
            "ui_FieldName": "test_ui_FieldName",
            "fieldValue": "test_fieldValue",
            "fieldDate": "24/11/2046",
            "fieldTime": "11:05:00",
            "fieldWeek": "24/11",
            "fieldNumber": "24",
            "fieldOptions": "testfieldOptions",
            "projectName": "demoProject",
            "inputValue": "testInputValue"
        }]; // testing purpose

        spyOn(window, "editClose").and.callThrough();

        var spyOnLayoutEdit = jasmine.createSpy("layoutEdit");
        spyOnLayoutEdit.and.callFake(scope.layoutEdit);
        spyOnLayoutEdit(event, index, ui_FieldName, fieldValue, fieldDate, fieldTime, fieldWeek, fieldNumber, fieldType, fieldOptions, projectName, inputValue);

        expect(spyOnLayoutEdit).toHaveBeenCalledWith(event, index, ui_FieldName, fieldValue, fieldDate, fieldTime, fieldWeek, fieldNumber, fieldType, fieldOptions, projectName, inputValue);

        expect(window.editClose).toHaveBeenCalled();

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

        spyOn(window, 'databaseDownload');

        var spyOndownloadProject = jasmine.createSpy("downloadProject");
        spyOndownloadProject.and.callFake(scope.downloadProject);
        spyOndownloadProject();
        scope.$digest();

        expect(spyOndownloadProject).toHaveBeenCalled();

        expect(window.databaseDownload).toHaveBeenCalledWith(projectName);

    });

});
