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

///   File Name   :   login.js                                                                                       ///

///   Description :   login.js                                                                                       ///

///                                                                                                                  ///

///   Date :   02/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {
    $(".user-board").css("display", "none");
    if (getParameterByName("Registered") === "yes") {
        $("#user-success").html("You have been Registered. Please Login here");
    }


    $("#LoginBtn").click(function () {
        var username = $("#input-username").val();
        var password = $("#input-password").val();
        var err = 0;
        if (username === '') {
            $("#input-username").css("border", "1px solid red");
            err = 1;
        }
        else {
            $("#input-username").css("border", "1px solid #ccc");
        }
        if (password === '') {
            $("#input-password").css("border", "1px solid red");
            err = 1;
        }
        else {
            $("#input-password").css("border", "1px solid #ccc");
        }

        if (err === 1) {
            return false;
        }
        else {
            $("#LoginBtn").attr("disabled", true);
        }


        var arr = {username: username, password: password};
        requestHTTP("POST", 3, arr, success, error);

        function success(msg, a, b) {
            if (msg.token) {
                localStorage.setItem("token", msg.token);
                localStorage.setItem("username", username);
                if (msg.passwordrequest === 1) {
                    window.location.href = "#changepassword";
                }
                else {
                    window.location.href = "#projects";
                }
            }
        }

        function error() {
            $("#user-error").html("Authentication failed");
            $("#LoginBtn").attr("disabled", false);
        }


    });
});