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

///   File Name   :   forgotPassword.js                                                                              ///

///   Description :   forgotPassword.js                                                                              ///

///                                                                                                                  ///

///   Date :   03/07/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    $(".user-board").css("display", "none");
    Captcha();
});

function validateUser() {
    var error = 0;

    var email = $("#email").val();


    if (email === '' || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) === false) {
        $("#email").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#email").css("border", "1px solid #ccc");
    }


    var txtInput;
    if (txtInput === '' || validCaptcha() === false) {
        $("#txtInput").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#txtInput").css("border", "1px solid #ccc");
    }


    if (error === 0) {
        var arr = {email: email};

        requestHTTP("POST", 2, arr, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                setAlertDialog("Mail sent", "Temporary password has been sent to the entered email address.", success);
                function success() {
                    window.location.href = "#login?Registered=yes";
                }
            }
        }

        function error(error) {
            if (error.status === 404) {
                setAlertDialog("Error", "The entered email is not registered with your account. Please try again.", cancel);
            }

            else {
                window.location.href = "#login";
            }
        }

        function cancel() {
            return true;
        }
    }
    else {
        return false;
    }
}
