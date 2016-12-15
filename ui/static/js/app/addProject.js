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

///   File Name   :   addProject.js                                                                                  ///

///   Description :   addProject.js                                                                                  ///

///                                                                                                                  ///

///   Date :   12/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function submitProject(arr) {

    requestHTTP("POST", 6, arr, success, error);

    function success(msg, a, b) {
        if (b.status === 201) {
            window.location.href = '#projects';
        }
    }

    function error(error) {
        if (error.status === 409) {
            setAlertDialog("Error", "Project already exist.", success);
            function success() {
                return true;
            }
        }
        else {
            window.location.href = "#login";
        }
    }
}