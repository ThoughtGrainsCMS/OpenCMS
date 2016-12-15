////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///------------------------------------------------------------------------------------------------------------------///

///                                   Copyright © 2015-2017 Thought Grains Solutions.                                ///

///                                               All Rights Reserved.                                               ///

///                                                                                                                  ///

///             This software is the confidential and proprietary information of Thought Grains Solutions.           ///

///                                          (Confidential Information)                                              ///

///  --------------------------------------------------------------------------------------------------------------  ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///                                                                                                                  ///

///   File Name   :   router.js                                                                                      ///

///   Description :   router.js                                                                                      ///

///                                                                                                                  ///

///   Date :   18/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

'use strict';
var cmsApp = angular.module("cmsApp", ["ngRoute", "ngDragDrop"]);
cmsApp.config(["$routeProvider", function ($routeProvider) {

    $routeProvider
        .when('/addentry', {
            templateUrl: 'templates/AddEntry.html',
            controller: 'addEntryController'
        })
        .when('/addmodel', {
            templateUrl: 'templates/AddModel.html',
            controller: 'addModelController'
        })
        .when('/addproject', {
            templateUrl: 'templates/AddProject.html',
            controller: 'addProjectController'
        })
        .when('/changepassword', {
            templateUrl: 'templates/ChangePassword.html'
        })
        .when('/editentry', {
            templateUrl: 'templates/EditEntry.html',
            controller: 'editEntryController'
        })
        .when('/editmodel', {
            templateUrl: 'templates/EditModel.html',
            controller: 'editModelController'
        })
        .when('/editproject', {
            templateUrl: 'templates/EditProject.html',
            controller: 'editProjectController'
        })
        .when('/entries', {
            templateUrl: 'templates/Entries.html',
            controller: 'entriesController'
        })
        .when('/forgotpassword', {
            templateUrl: 'templates/ForgotPassword.html'
        })
        .when('/layout', {
            templateUrl: 'templates/Layout.html',
            controller: "layoutController"
        })
        .when('/login', {
            templateUrl: 'templates/Login.html'
        })
        .when('/models', {
            templateUrl: 'templates/Models.html',
            controller: "modelsController"
        })
        .when('/projects', {
            templateUrl: 'templates/Projects.html',
            controller: "projectsController"
        })
        .when('/register', {
            templateUrl: 'templates/Register.html'
        })
        .otherwise({redirectTo: '/login'});
}]);