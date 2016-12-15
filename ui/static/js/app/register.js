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

///   File Name   :   register.js                                                                                    ///

///   Description :   register.js                                                                                    ///

///                                                                                                                  ///

///   Date :   01/06/2016                                          Created By  :   Thoughtgrains Solutions           ///

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    $(".user-board").css("display", "none");
    Captcha();
});

function validateUser() {
    $("#user-error").text("");
    var error = 0;
    var username = $("#username1").val();
    var password = $("#password").val();
    var reTypePassword = $("#retypepassword").val();
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var email = $("#email").val();
    var gender = $("#gender").val();
    var add1 = $("#add1").val();
    var add2 = $("#add2").val();
    var city = $("#city").val();
    var country = $("#country").val();
    var postcode = $("#postcode").val();
    var phone = $("#phone").val();
    var txtInput = $("#txtInput").val();
    if (username === '') {
        $("#username1").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#username1").css("border", "1px solid #ccc");
    }

    if (password === '' || (/^[A-Za-z]\w{7,14}$/.test(password)) === false) {
        $("#password").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#password").css("border", "1px solid #ccc");
    }

    if (reTypePassword === '' || reTypePassword != password || (/^[A-Za-z]\w{7,14}$/.test(reTypePassword)) === false) {
        $("#retypepassword").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#retypepassword").css("border", "1px solid #ccc");
    }

    if (firstname === '') {
        $("#firstname").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#firstname").css("border", "1px solid #ccc");
    }

    if (email === '' || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) === false) {
        $("#email").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#email").css("border", "1px solid #ccc");
    }

    if (gender === '') {
        $("#gender").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#gender").css("border", "1px solid #ccc");
    }


    if (city === '') {
        $("#city").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#city").css("border", "1px solid #ccc");
    }


    if (country === '') {
        $("#country").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#country").css("border", "1px solid #ccc");
    }


    if (postcode === '') {
        $("#postcode").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#postcode").css("border", "1px solid #ccc");
    }

    if (txtInput === '' || validCaptcha() === false) {
        $("#txtInput").css("border", "1px solid red");
        error = 1;
    }
    else {
        $("#txtInput").css("border", "1px solid #ccc");
    }


    if (error === 0) {
        var arr = {
            username: username,
            password: password,
            retypepassword: reTypePassword,
            firstname: firstname,
            lastname: lastname,
            email: email,
            gender: gender,
            city: city,
            country: country,
            postcode: postcode,
            phone: phone
        };

        requestHTTP("POST", 1, arr, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                window.location.href = "#login?Registered=yes";
            }
        }

        function error(error) {
            if (error.status === 406) {
                setAlertDialog("Error", "Username already exists.", success);
                function success() {
                    return true;
                }
            }
            else if (error.status === 409) {
                setAlertDialog("Error", "Emailid already exists.", success);
                function success() {
                    return true;
                }
            }

            else {
                window.location.href = "#login";
            }
        }
    }
    else {
        return false;
    }
}