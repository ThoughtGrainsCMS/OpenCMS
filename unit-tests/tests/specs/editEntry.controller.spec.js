describe('editEntryController', function() {

    var scope, spyOnLocalStorageSetItem, spyOnLocalStorageGetItem, location;

    beforeEach(angular.mock.module('editEntryController'));

    beforeEach(inject(function($controller, $rootScope, $location) {
        scope = $rootScope.$new();
        location = $location;
        controller = $controller('editEntryController', {
            $scope: scope
        });

        spyOn(localStorage, "getItem").and.callThrough();

    }));

    it("should able to get projectName and modelName from localStorage", function() {
        var projectName = localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");

        var modelName = localStorage.getItem("modelName");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelName");

        var modelID = localStorage.getItem("modelID");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelID");

        var entryID = localStorage.getItem("entryID");
        expect(localStorage.getItem).toHaveBeenCalledWith("entryID");
    });

    it("on load should able to call getEditEntryFields", function() {

        var projectName = localStorage.getItem("projectName");

        var modelName = localStorage.getItem("modelName");

        var modelID = localStorage.getItem("modelID");

        var entryID = localStorage.getItem("entryID");

        spyOn(window, "getEditEntryFields").and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(window.getEditEntryFields).toHaveBeenCalledWith(projectName, modelName, modelID, entryID, jasmine.any(Function));

    });


    it("should able to call addEntry when $('#Formfields') length is greater than 2", function() {

        var fieldKey = [];
        var fieldvalues = [];
        var filefields = [];
        var fileDataType = [];
        var checkIndex = [];

        form = $('<div id="Formfields">' +
            '<div class="form-group" ng-repeat="fields in modelFields" ng-switch on="fields.fieldtype">' +
            '<label ng-bind="fields.ui_fieldname" data-fieldname="{{ fields.fieldname }}"></label>' +
            '<label ng-switch-when="radio" class="radio-inline" ng-repeat="opt in fields.fieldoptions" data-fielddatatype="{{ fields.fielddatatype }}"><input name="fields.fieldname" type="radio" class="Radio" ng-model="radios" checked>{{ opt }}</label>' +
            '<label ng-switch-when="checkbox" class="checkbox-inline" ng-repeat="opt in fields.fieldoptions" data-fielddatatype="{{ fields.fielddatatype }}"><input name="fields.fieldname" type="checkbox" class="Check" ng-model="checks" checked>{{ opt }}</label>' +
            '<select ng-switch-when="dropdown" name="fields.fieldname" class="form-control" title="" data-fielddatatype="{{ fields.fielddatatype }}"><option ng-repeat="opt in fields.fieldoptions track by $index">{{ opt }}</option></select>' +
            '</div>' +
            '</div>');

        $(document.body).append(form);

        spyOn(window, 'editEntry').and.callThrough();

        spyOn(fieldKey, "push").and.callThrough();

        var spyOnSubmitEntry = jasmine.createSpy("submitEntry");
        spyOnSubmitEntry.and.callFake(scope.submitEntry);
        spyOnSubmitEntry();

        expect(spyOnSubmitEntry).toHaveBeenCalled();

        $("#Formfields").find(".form-group").each(function(n, a) {

            fieldKey.push({
                fieldKey: $($(this).children()[0]).data("fieldname")
            });

            expect(fieldKey.push).toHaveBeenCalledWith({
                fieldKey: $($(this).children()[0]).data("fieldname")
            })

            expect($(this).children().length).toBeGreaterThan(2);

            var token = localStorage.getItem("token");
            expect(localStorage.getItem).toHaveBeenCalledWith("token");

            var arr = {
                username: token,
                password: '',
                count: fieldvalues.length,
                projectname: "projectName",
                fieldkeys: fieldKey,
                modelname: "modelName",
                fieldvalues: fieldvalues,
                filefields: filefields,
                filedatatype: fileDataType
            };

            expect(window.editEntry).toHaveBeenCalled();

            form.remove();
            form = null;

        });
    });

    it("should able to call addEntry", function() {

        var fieldKey = []; //testing purpose
        var fieldvalues = []; //testing purpose
        var filefields = []; //testing purpose
        var fileDataType = []; //testing purpose
        var checkIndex = 0; //testing purpose

        form = $('<form name="entryForm" id="entryForm" autocomplete="off" enctype="multipart/form-data" action="" method="POST">' +
            '<div id="Formfields">' +
            '<div class="form-group" ng-repeat="fields in modelFields" ng-switch on="fields.fieldtype">' +
            '<label ng-bind="fields.ui_fieldname" data-fieldname="{{ fields.fieldname }}"></label>' +
            '<input ng-switch-when="header" type="text" class="form-control" placeholder="{{ fields.fieldoptions }}" name="{{ fields.fieldname }}" ng-model="fieldtext" data-fielddatatype="{{ fields.fielddatatype }}" ng-required="true"/>' +
            '</div>' +
            '</form>');

        $(document.body).append(form);

        spyOn(window, 'editEntry').and.callThrough();

        spyOn(fieldvalues, "push").and.callThrough();

        var spyOnSubmitEntry = jasmine.createSpy("submitEntry");
        spyOnSubmitEntry.and.callFake(scope.submitEntry);
        spyOnSubmitEntry();

        expect(spyOnSubmitEntry).toHaveBeenCalled();

        var inputChildren = $($(this).children()[1]);

        fieldvalues.push({
            FieldVals: inputChildren.val()
        });

        expect(fieldvalues.push).toHaveBeenCalledWith({
            FieldVals: inputChildren.val()
        });


        var token = localStorage.getItem("token");
        expect(localStorage.getItem).toHaveBeenCalledWith("token");

        var arr = {
            username: token,
            password: '',
            count: fieldvalues.length,
            projectname: "projectName",
            fieldkeys: fieldKey,
            modelname: "modelName",
            fieldvalues: fieldvalues,
            filefields: filefields,
            filedatatype: fileDataType
        };

        expect(window.editEntry).toHaveBeenCalled();

        form.remove();
        form = null;

    });

});
