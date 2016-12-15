describe('editModelController', function() {

    var scope, spyOnLocalStorage;

    beforeEach(angular.mock.module('editModelController'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('editModelController', {
            $scope: scope
        });

        spyOn(localStorage, 'getItem').and.callThrough();
    }));

    it("should get modelName,projectName,modelID from localStorage and call function getModelByID on load", function() {

        var modelName = localStorage.getItem("modelName");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelName");

        var projectName = localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");

        var modelID = localStorage.getItem("modelID");
        expect(localStorage.getItem).toHaveBeenCalledWith("modelID");

        spyOn(window, "getModelByID").and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(window.getModelByID).toHaveBeenCalledWith(modelName, projectName, modelID, jasmine.any(Function));


    });

    it("should able to call addMore function with count and set $scope.modelFields.edit to false when count is not equal to 'first'", function() {

        var count = 2 //testing purpose
        scope.modelFields = [{
                "fielddatatype": "testfieldname",
                "fieldname": "testfielddatatype",
                "fieldoptions": "testfieldtype",
                "fieldrequired": "testfieldrequired",
                "fieldtype": "testfieldrequired",
                "oldfieldtype": "testfieldrequired",
                "edit": "testfieldrequired"
            }, {
                "fielddatatype": "testfieldname1",
                "fieldname": "testfielddatatype1",
                "fieldoptions": "testfieldtype1",
                "fieldrequired": "testfieldrequired1",
                "fieldtype": "testfieldrequired1",
                "oldfieldtype": "testfieldrequired1",
                "edit": "testfieldrequired1"
            }] //testing purpose

        var spyOnaddMore = jasmine.createSpy("addMore");
        spyOnaddMore.and.callFake(scope.addMore);
        spyOnaddMore(count);

        expect(spyOnaddMore).toHaveBeenCalledWith(count);

        expect(count).not.toEqual("first");

        if (count !== "first") {
            expect(scope.modelFields.edit).toBeFalsy();
        }

    });

    it("should able to call addMore function with count and push variable to $scope.modelFields", function() {

        var count = "first" //testing purpose

        scope.modelFields = [] //testing purpose

        spyOn(scope.modelFields, "push").and.callThrough();

        var spyOnaddMore = jasmine.createSpy("addMore");
        spyOnaddMore.and.callFake(scope.addMore);
        spyOnaddMore(count);

        expect(spyOnaddMore).toHaveBeenCalledWith(count);

        expect(count).toEqual("first");

        expect(scope.modelFields.push).toHaveBeenCalledWith({
            fielddatatype: "",
            fieldname: "",
            fieldoptions: "",
            fieldrequired: "",
            fieldtype: "",
            oldfieldtype: "",
            edit: true
        });

    });

    it("should able to call removeField with index", function() {

        var index = 2 //testing purpose
        scope.modelFields = ["test1", "test2"] //testing purpose

        spyOn(scope.modelFields, "splice").and.callThrough();

        var spyOnremoveField = jasmine.createSpy("removeField");
        spyOnremoveField.and.callFake(scope.removeField);
        spyOnremoveField(index);

        expect(spyOnremoveField).toHaveBeenCalledWith(index);

        expect(scope.modelFields.splice).toHaveBeenCalledWith(index, 1);
    });

    describe('$scope.editSubmit function', function() {

        var spyOneditModel, arr;


        beforeEach(function() {
            scope.projectname = "testProject"; //testing purpose
            scope.modelname = "testmodelname" //testing purpose
            scope.id = "testID123" //testing purpose
            var oldmodelname = "testmodelname" //testing purpose

            var token = localStorage.getItem('token');
            arr = {
                username: token,
                password: '',
                projectname: scope.projectname,
                count: "",
                oldmodelname: oldmodelname.toLowerCase(),
                modelname: scope.modelname,
                id: scope.id,
                fieldobj: []
            }; //testing purpose
        })

        it("calls editModel function with arr when scope.modelFields is empty", function() {

            scope.modelFields = [{
                "fielddatatype": "",
                "ui_fieldname": "",
                "fieldname": "",
                "fieldoptions": "",
                "fieldrequired": "",
                "fieldtype": ""
            }]; // testing purpose

            spyOn(window, 'editModel').and.callThrough();

            spyOneditModel = jasmine.createSpy("editSubmit");
            spyOneditModel.and.callFake(scope.editSubmit);
            spyOneditModel();
            expect(spyOneditModel).toHaveBeenCalled();

            var token = localStorage.getItem('token');
            expect(localStorage.getItem).toHaveBeenCalledWith("token");

            for (var i = 0; i < scope.modelFields.length; i++) {
                expect(scope.modelFields[i].fieldname).toBe("");
                expect(scope.modelFields[i].fieldname).toEqual(scope.modelFields[i].ui_fieldname);

                expect(scope.modelFields[i].fieldname).not.toBeUndefined();

                if (scope.modelFields[i].ui_fieldname !== "" && scope.modelFields[i].fieldname !== "" && scope.modelFields[i].fieldname !== undefined && scope.modelFields[i].fielddatatype !== "" && scope.modelFields[i].fieldtype !== "" && scope.modelFields[i].fieldrequired !== "") {
                    arr.fieldobj.push(scope.modelFields[i]);
                }
            }

            arr.fieldobj = JSON.stringify(arr.fieldobj);

            expect(window.editModel).toHaveBeenCalled();

        });

        it("calls editModel function with arr when scope.modelFields is undefined", function() {

            scope.modelFields = [{
                "fielddatatype": undefined,
                "ui_fieldname": undefined,
                "fieldname": undefined,
                "fieldoptions": undefined,
                "fieldrequired": undefined,
                "fieldtype": undefined
            }]; // testing purpose

            spyOn(window, 'editModel').and.callThrough();

            spyOneditModel = jasmine.createSpy("editSubmit");
            spyOneditModel.and.callFake(scope.editSubmit);
            spyOneditModel();
            expect(spyOneditModel).toHaveBeenCalled();

            var token = localStorage.getItem('token');
            expect(localStorage.getItem).toHaveBeenCalledWith("token");

            for (var i = 0; i < scope.modelFields.length; i++) {
                expect(scope.modelFields[i].fieldname).not.toBe("");

                expect(scope.modelFields[i].fieldname).toBeUndefined();
                expect(scope.modelFields[i].fieldname).toEqual(scope.modelFields[i].ui_fieldname);

                if (scope.modelFields[i].ui_fieldname !== "" && scope.modelFields[i].fieldname !== "" && scope.modelFields[i].fieldname !== undefined && scope.modelFields[i].fielddatatype !== "" && scope.modelFields[i].fieldtype !== "" && scope.modelFields[i].fieldrequired !== "") {
                    arr.fieldobj.push(scope.modelFields[i]);
                }
            }

            expect(window.editModel).toHaveBeenCalled();

        });

        it("calls editModel function with arr when scope.modelFields is not empty", function() {

            scope.modelFields = [{
                "fielddatatype": "testfielddatatype#testfielddatatype1#testfielddatatype2",
                "ui_fieldname": "testfieldui_fieldname#testui_fieldname1#testui_fieldname2",
                "fieldname": "testfieldname#testfieldname1#testfieldname2",
                "fieldoptions": "testfieldoptions#testfieldoptions1#testfieldoptions2",
                "fieldrequired": "testfieldrequired#testfieldrequired1#testfieldrequired2",
                "fieldtype": "testfieldtype#testfieldtype1#testfieldtype2"
            }]; // testing purpose

            spyOn(arr.fieldobj, "push").and.callThrough();

            spyOneditModel = jasmine.createSpy("editSubmit");
            spyOneditModel.and.callFake(scope.editSubmit);
            spyOneditModel();
            expect(spyOneditModel).toHaveBeenCalled();

            var token = localStorage.getItem('token');
            expect(localStorage.getItem).toHaveBeenCalledWith("token");

            for (var i = 0; i < scope.modelFields.length; i++) {
                expect(scope.modelFields[i].ui_fieldname !== "" && scope.modelFields[i].fieldname !== "" && scope.modelFields[i].fieldname !== undefined && scope.modelFields[i].fielddatatype !== "" && scope.modelFields[i].fieldtype !== "" && scope.modelFields[i].fieldrequired !== "").not.toBe("");

                arr.fieldobj.push(scope.modelFields[i]);
                expect(arr.fieldobj.push).toHaveBeenCalledWith(scope.modelFields[i]);

            }

        });

    });

    describe('$scope.checkDuplicate', function() {

        var index, event, exists;

        beforeEach(function() {

            jasmine.getFixtures().fixturesPath = 'base';
            loadFixtures('tests/fixtures/EditModel.html');

            index = "0" // testing purpose

            exists = [] // testing purpose

            event = $.Event('keyup'); // testing purpose
            event.which = 65; // testing purpose

            var keyUpTrigger = '<input class="form-control form-fields" value="testValue" type="text" placeholder="Field Name"/>'; // testing purpose

            $(keyUpTrigger).trigger(event); // testing purpose

        });

        it("checks for duplicates, if any duplicates exists button will be disabled when scope.modelFields.edit is not undefined and fieldNameVal === scope.modelFields.fieldname", function() {

            scope.modelFields = [{
                "fielddatatype": "testfielddatatype",
                "ui_fieldname": "testfieldui_fieldname",
                "fieldname": "testValue",
                "fieldrequired": "testfieldrequired",
                "fieldtype": "testfieldtype",
                "edit": ""
            }]; // testing purpose

            spyOn(exists, "push").and.callThrough();

            var spyOnCheckDuplicate = jasmine.createSpy("checkDuplicate");
            spyOnCheckDuplicate.and.callFake(scope.checkDuplicate);
            spyOnCheckDuplicate(index, event);
            expect(spyOnCheckDuplicate).toHaveBeenCalledWith(index, event);

            var fieldNameVal = event.target.value;
            expect(fieldNameVal).toBeDefined();

            for (var i = 0; i < scope.modelFields.length; i++) {
                expect(scope.modelFields[index].edit).not.toBeUndefined();

                expect(fieldNameVal).toEqual(scope.modelFields[i].fieldname);

                exists.push(index);
                expect(exists.push).toHaveBeenCalledWith(index);
            }
            expect(scope.modelFields[index].edit).not.toBeUndefined();
            expect(exists.length).toBeGreaterThan(0);

            $("#Editmodel").attr("disabled", true);
            var EditmodelBtn = $('#Editmodel');
            expect($(EditmodelBtn).is(":disabled")).toEqual(true);

        });

        it("checks for duplicates, if any duplicates exists button will be disabled when scope.modelFields.edit is not undefined and fieldNameVal === scope.modelFields.ui_fieldname", function() {

            scope.modelFields = [{
                "fielddatatype": "testfielddatatype",
                "ui_fieldname": "testValue",
                "fieldname": "testfieldname",
                "fieldrequired": "testfieldrequired",
                "fieldtype": "testfieldtype",
                "edit": ""
            }]; // testing purpose

            spyOn(exists, "push").and.callThrough();

            var spyOnCheckDuplicate = jasmine.createSpy("checkDuplicate");
            spyOnCheckDuplicate.and.callFake(scope.checkDuplicate);
            spyOnCheckDuplicate(index, event);
            expect(spyOnCheckDuplicate).toHaveBeenCalledWith(index, event);

            var fieldNameVal = event.target.value;
            expect(fieldNameVal).toBeDefined();

            for (var i = 0; i < scope.modelFields.length; i++) {
                expect(scope.modelFields[index].edit).not.toBeUndefined();

                expect(fieldNameVal).toEqual(scope.modelFields[i].ui_fieldname);

                exists.push(index);
                expect(exists.push).toHaveBeenCalledWith(index);
            }
            expect(scope.modelFields[index].edit).not.toBeUndefined();

        });

        it("checks for duplicates, if any duplicates exists button will be disabled", function() {

            scope.modelFields = [{
                "fielddatatype": "testfielddatatype",
                "ui_fieldname": "testui_fieldname",
                "fieldname": "testfieldname",
                "fieldrequired": "testfieldrequired",
                "fieldtype": "testfieldtype",
                "edit": ""
            }]; // testing purpose

            var spyOnCheckDuplicate = jasmine.createSpy("checkDuplicate");
            spyOnCheckDuplicate.and.callFake(scope.checkDuplicate);
            spyOnCheckDuplicate(index, event);
            expect(spyOnCheckDuplicate).toHaveBeenCalledWith(index, event);

            var fieldNameVal = event.target.value;
            expect(fieldNameVal).toBeDefined();

            expect(scope.modelFields[index].edit).not.toBeUndefined();
            $("#Editmodel").removeAttr("disabled");
            var EditmodelBtn = $('#Editmodel');
            expect($(EditmodelBtn).is(":disabled")).toEqual(false);

        });

    });

});
