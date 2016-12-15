//Processing Indicator
$(function() {
    var loader = jQuery(".loader");
    loader.show();
    $(window).on("load", function() {
        loader.fadeOut(500);
    });
});

function loader() {
    var loader = jQuery(".loader");
    loader.show();
    setTimeout(function() {
        loader.fadeOut(500);
    }, 1000);
}

//Confirmation Dialog Function
function setConfirmDialog(title, msg, successFnc, cancelFnc) {
    $(".confirmation-model").show();
    $("#actionConfirm").unbind("click").click(function() {
        successFnc();
        hideConfirmDialog();
    });
    $("#actionCancel").unbind("click").click(function() {
        hideConfirmDialog();
        cancelFnc();
    });
    $(".confirm-title").text(title);
    $(".confirm-msg").text(msg);
}

function setAlertDialog(title, msg, successFnc) {
    $(".alert-model").show();
    $("#alertConfirm").unbind("click").click(function() {
        successFnc();
        hideAlertDialog();
    });
    $(".alert-title").text(title);
    $(".alert-msg").text(msg);
}

function hideConfirmDialog() {
    $(".confirmation-model").hide();
    $(".confirm-title").text("");
    $(".confirm-msg").text("");
}

function hideAlertDialog() {
    $(".alert-model").hide();
    $(".alert-title").text("");
    $(".alert-msg").text("");
}


//Only Alphabets
function onlyAlphabets() {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        } else {
            return true;
        }
        return !!((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123));
    } catch (err) {

    }
}

//Captcha
function Captcha() {
    var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var i;
    for (i = 0; i < 6; i++) {
        var a = alpha[Math.floor(Math.random() * alpha.length)];
        var b = alpha[Math.floor(Math.random() * alpha.length)];
        var c = alpha[Math.floor(Math.random() * alpha.length)];
        var d = alpha[Math.floor(Math.random() * alpha.length)];
        var e = alpha[Math.floor(Math.random() * alpha.length)];
        var f = alpha[Math.floor(Math.random() * alpha.length)];
        var g = alpha[Math.floor(Math.random() * alpha.length)];
    }
    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
    $("#main-captcha").html(code);
    jQuery(".loader").fadeOut(500);
}

function validCaptcha() {
    var string1 = removeSpaces($("#main-captcha").html());
    var string2 = removeSpaces($('#txtInput').val());
    return string1 === string2;
}

function removeSpaces(string) {
    return string.split(' ').join('');
}

//Ajax Reset
function resetAjaxRequest() {
    $.ajaxSetup({
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        processData: true
    });
}
