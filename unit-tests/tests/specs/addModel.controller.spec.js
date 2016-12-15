describe('addModelController', function() {
    var scope;
    beforeEach(angular.mock.module('addModelController'));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('addModelController', {
            $scope: scope
        });
    }));

    it("should able to get projectName from localStorage", function() {
        spyOn(localStorage, "getItem");
        var projectName = localStorage.getItem("projectName");
        expect(localStorage.getItem).toHaveBeenCalledWith("projectName");
    });

    it("should redirect to projects page if projectName is undefined", function() {
        var projectName = undefined //for testing purpose

        if (projectName === undefined) {
            window.location.href = "#projects";
        };

        expect(projectName).toBe(undefined);
        expect(location.href).toContain('#projects');
    });

    it("should able to all addMore funct with count and push the variables to fieldList when scope.fieldList is null", function() {
        scope.fieldList = []; //for testing purpose
        var count = 5 //for testing purpose
        var fielddatatype = "" //for testing purpose
        var fieldname = "" //for testing purpose
        var fieldoptions = "" //for testing purpose
        var fieldrequired = "" //for testing purpose
        var fieldtype = "" //for testing purpose
        var oldfieldname = "" //for testing purpose
        var edit = true //for testing purpose

        spyOn(scope.fieldList, 'push').and.callThrough();

        var spyOnaddMore = jasmine.createSpy("addMore");
        spyOnaddMore.and.callFake(scope.addMore);
        spyOnaddMore(count);
        scope.$digest();

        expect(spyOnaddMore).toHaveBeenCalledWith(count);

        expect(scope.fieldList.push).toHaveBeenCalledWith({
            "fielddatatype": fielddatatype,
            "fieldname": fieldname,
            "fieldoptions": fieldoptions,
            "fieldrequired": fieldrequired,
            "fieldtype": fieldtype,
            "oldfieldname": oldfieldname,
            "edit": true
        });

    });

    it("should able to all addMore funct with count and push the variables to fieldList when scope.fieldList is not null", function() {
        scope.fieldList = ["test", "test1", "test2", "test3"]; //for testing purpose
        var count = 5 //for testing purpose

        var spyOnaddMore = jasmine.createSpy("addMore");
        spyOnaddMore.and.callFake(scope.addMore);
        spyOnaddMore(count);
        scope.$digest();

        expect(spyOnaddMore).toHaveBeenCalledWith(count);

        expect(scope.fieldList).not.toBe(null);

        expect(scope.fieldList.edit).toBeFalsy();
    });

    it("should slice the the index value from fieldList", function() {
        scope.fieldList = ["test", "test1", "test2", "test3"]; //for testing purpose
        var index = 4 //for testing purpose

        spyOn(scope.fieldList, 'splice').and.callThrough();

        var spyOnremoveField = jasmine.createSpy("removeField");
        spyOnremoveField.and.callFake(scope.removeField);
        spyOnremoveField(index);
        scope.$digest();

        expect(spyOnremoveField).toHaveBeenCalledWith(index);

        expect(scope.fieldList.splice).toHaveBeenCalledWith(index, 1);
    });

    it("shold call addMore function on $scope.$on", function() {

        spyOn(scope, "addMore").and.callThrough();

        scope.$broadcast('$viewContentLoaded');

        expect(scope.addMore).toHaveBeenCalled();
    });

    it("should able to call addModel function", function() {
        scope.fieldList = [{
            "fieldname": "testfieldname",
            "fielddatatype": "testfielddatatype",
            "fieldtype": "testfieldtype",
            "fieldrequired": "testfieldrequired"
        }, {
            "fieldname": "testfieldname1",
            "fielddatatype": "testfielddatatype1",
            "fieldtype": "testfieldtype1",
            "fieldrequired": "testfieldrequired"
        }]; //for testing purpose

        var token = localStorage.getItem("token");

        var arr = {
            username: token,
            password: '',
            projectname: "demoProject",
            count: "",
            modelname: scope.modelname,
            fieldobj: scope.fieldList
        };

        spyOn(localStorage, "getItem").and.callThrough();
        var token = window.localStorage.getItem('token');
        scope.$digest();
        expect(localStorage.getItem).toHaveBeenCalledWith("token");

        spyOn(window, "addModel").and.callThrough();

        var spyOnaddSubmit = jasmine.createSpy("addSubmit");
        spyOnaddSubmit.and.callFake(scope.addSubmit);
        spyOnaddSubmit();
        scope.$digest();
        expect(spyOnaddSubmit).toHaveBeenCalled();

        for (var i = 0; i < scope.fieldList.length; i++) {
            expect(scope.fieldList[i].fieldname, scope.fieldList[i].fielddatatype, scope.fieldList[i].fieldtype, scope.fieldList[i].fieldrequired).not.toBe(null);
        }

        expect(window.addModel).toHaveBeenCalled();
    });

});
