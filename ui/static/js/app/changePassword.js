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

///   File Name   :   changePassword.js                                                                              ///

///   Description :   changePassword.js                                                                              ///

///                                                                                                                  ///

///   Date :   03/07/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    $(".user-board").css("display", "none");
    Captcha();

    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    $("#username").html(localStorage.getItem("username"));
});

function validateUser() {
    var err = 0;

    var password = $("#password").val();

    var reTypePassword = $("#password").val();


    if (password === '' || (/^[A-Za-z]\w{7,14}$/.test(password)) == false) {
        $("#password").css("border", "1px solid red");
        err = 1;
    }
    else {
        $("#password").css("border", "1px solid #ccc");
    }

    if (reTypePassword === '' || reTypePassword != password || (/^[A-Za-z]\w{7,14}$/.test(reTypePassword)) === false) {
        $("#retypepassword").css("border", "1px solid red");
        err = 1;
    }
    else {
        $("#retypepassword").css("border", "1px solid #ccc");
    }


    var txtInput;
    if (txtInput === '' || validCaptcha() === false) {
        $("#txtInput").css("border", "1px solid red");
        err = 1;
    }
    else {
        $("#txtInput").css("border", "1px solid #ccc");
    }


    if (err === 0) {

        var arr = {username: localStorage.token, password: '', newpassword: password};

        requestHTTP("POST", 4, arr, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                window.location.href = "#projects";
            } else {
                window.location.href = "#login";
            }
        }

        function error(error) {
            window.location.href = "#login";
        }
    }
    else {
        return false;
    }

}
