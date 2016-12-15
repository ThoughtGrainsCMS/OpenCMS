angular.module('layoutController', []).controller("layoutController", ['$scope', function($scope) {

    var projectName = localStorage.getItem("projectName");
    var currentModel = '';
    var currentTab = "create";

    $scope.droppedList = [];

    $scope.$on('$viewContentLoaded', function() {
        loadPages(projectName, function(Pages) {
            $scope.pagesList = Pages;
        });
    });

    $scope.modelSection = function(event) {
        modelSection(event);
    };

    $scope.modelLayerSection = function(event) {
        var target = $(event.target);
        modelLayerSection(target);
    };

    $scope.pageSection = function(event) {
        pageSection(event);
    };

    $scope.addNewPage = function() {
        addNewPage();
    };

    $scope.addNewPageClose = function() {
        addNewPageClose();
    };

    $scope.submitNewPage = function() {
        var pageName = $scope.newPageName;
        // console.log(ad);
        addPages(projectName, currentModel, pageName, function() {
            loadPages(projectName, function(Pages) {
                $scope.pagesList = Pages;
            });
        });
        submitNewPage();
    };

    $scope.selectedPage = 'Pages';
    var selectedPageID = "";
    $scope.selectPage = function(event, pageID) {
        selectedPageID = pageID;
        // $scope.selectedPage = $(event.target).closest('.menu-layer-header').find('span').text(); //testing purpose
        loadPageFields(projectName, selectedPageID, function(dropArray) {
            $scope.droppedList = dropArray;
        });
        loadEntries(function(tempArray) {
            $scope.entryList = tempArray;
        });
        selectPage(event);
    };

    $scope.removePage = function(index, pageName, pageID) {
        removePage(pageName, pageID, projectName, function() {
            $scope.pagesList.splice(index, 1);
            $scope.selectedPage = 'Pages';
            $('.menu-layer-header').removeClass("selected-drag-side-header");
            $scope.$apply();
        });
    };

    $scope.linkModel = function(index, fieldtype) {
        linkModel(fieldtype, projectName, function(tempArray) {

        }, function(modelName) {
            $scope.modelList = modelName;

            $scope.linkList = modelName;

            // setTimeout(function() {
            //     var linkListIndex = '';
            //     var linkListKey = '';
            //     $(".link-drag").draggable({
            //         revert: "invalid",
            //         helper: "clone",
            //         start: function(event) {
            //             var target = $(event.target);
            //             linkListIndex = target.attr('data-id');
            //             linkListKey = target.attr('data-key');
            //             $('.drop-area').droppable('disable');
            //         }
            //     });
            //
            //     $(".content-text-input").droppable({
            //         drop: function(event) {
            //             $('.drop-area').droppable('enable');
            //             var target = $(event.target);
            //             var index = target.attr('data-index');
            //
            //             var linkLstFieldType = $scope.linkList[linkListKey][linkListIndex].fieldtype;
            //             var droppedLstFieldType = $scope.droppedList[index].fieldtype;
            //
            //             if (linkLstFieldType != droppedLstFieldType) {
            //                 return false;
            //             } else {
            //                 var tempObj = JSON.parse(JSON.stringify($scope.droppedList[index]));
            //                 tempObj.ui_fieldname = $scope.linkList[linkListKey][linkListIndex].ui_fieldname;
            //                 tempObj.fieldvalue = $scope.linkList[linkListKey][linkListIndex].fieldvalue;
            //                 tempObj.fielddate = $scope.linkList[linkListKey][linkListIndex].fielddate;
            //                 tempObj.fieldoptions = $scope.linkList[linkListKey][linkListIndex].fieldoptions;
            //
            //
            //                 $scope.droppedList[index] = tempObj;
            //                 $scope.$apply();
            //             }
            //         }
            //     });
            // }, 0);
        });
    };

    $scope.createTab = function(event) {
        if (currentTab === "create") {
            createTab(event);
        } else {
            pageFormSave($scope.selectedPage, selectedPageID, projectName, $scope.droppedList, function() {
                currentTab = "create";
                createTab(event);
            });

        }
    };

    $scope.previewTab = function() {
        currentTab = "preview";

        for (var i = 0; i < $scope.droppedList.length; i++) {
            if ($scope.droppedList.length === 0) {
                $scope.droppedList = [];
            } else if ($scope.droppedList[i].leftposition === undefined && $scope.droppedList[i].topposition === undefined) {
                tabFirstLoad($scope.droppedList, function(newPos) {
                    $scope.droppedList = newPos;

                    // $('.drop-preview').children().each(function(n) {
                    //     $(this).css({
                    //         top: $scope.droppedList[n].topPosition,
                    //         left: $scope.droppedList[n].leftPosition
                    //     })
                    // });
                });
            }
        }
        previewTab();
    };

    $scope.entryLink = function(event) {
        var target = $(event.target);
        entryLink(target);
    };

    $scope.saveForm = function() {
        if (currentTab === "create") {
            $scope.previewTab();
            pageFormSave($scope.selectedPage, selectedPageID, projectName, $scope.droppedList, function() {

            });
        } else {
            pageFormSave($scope.selectedPage, selectedPageID, projectName, $scope.droppedList, function() {
                currentTab = "create";
            });

        }
    };

    $scope.remove = function(index) {
        $scope.droppedList.splice(index, 1);
    };

    $scope.editInputText = '';

    var layoutInputIndex = '';
    $scope.editInput = function(event, index, ui_FieldName, fieldValue, fieldDate, fieldTime, fieldWeek, fieldNumber, fieldType, fieldOptions, projectName, inputValue) {

        layoutInputIndex = index;

        editInput(event);

        $scope.labelContents = {
            ui_FieldName: ui_FieldName,
            fieldValue: fieldValue,
            fieldDate: fieldDate,
            fieldTime: fieldTime,
            fieldWeek: fieldWeek,
            fieldNumber: fieldNumber,
            fieldType: fieldType,
            fieldOptions: fieldOptions,
            projectName: projectName,
            inputValue: inputValue
        };
    };

    $scope.editClose = function() {
        editClose();
    };

    $scope.linkClose = function() {
        linkClose();
    };

    $scope.layoutEdit = function(ui_FieldName, fieldValue, fieldType, fieldOptions, projectName, fieldDate, fieldNumber, fieldTime, fieldWeek, inputValue) {

        var token = window.localStorage.getItem('token');

        // var tempObj = JSON.parse(JSON.stringify($scope.droppedList[layoutInputIndex])); //testing purpose
        var tempObj = JSON.parse(JSON.stringify($scope.droppedList[0])); // testing purpose

        tempObj.ui_fieldname = ui_FieldName;
        tempObj.fieldvalue = fieldValue;
        tempObj.inputvalue = inputValue;
        tempObj.fielddate = fieldDate;
        tempObj.fieldtime = fieldTime;
        tempObj.fieldweek = fieldWeek;
        tempObj.fieldnumber = fieldNumber;

        try {
            tempObj.fieldoptions = fieldOptions.split(",");
        } catch (err) {
            $scope.droppedList[layoutInputIndex] = tempObj;
            editClose();
        }

        // $scope.droppedList[layoutInputIndex] = tempObj; // testing purpose
        $scope.droppedList[0] = tempObj; // testing purpose
        editClose();
    };

    $scope.uiDownload = function() {
        uiDownload(projectName);
    };

    $scope.downloadProject = function() {
        databaseDownload(projectName);
    };

}]);
