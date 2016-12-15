$(".user-board").css("display", "block");
$("#username").html(localStorage.getItem("username"));

function getProject(successFnc) {
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }
    var token = localStorage.getItem("token");
    var tokenObj = {
        username: token,
        password: ''
    };

    // requestHTTP("POST", 5, tokenObj, success, error);

    function success(msg, a) {
        successFnc(msg.Projects);
    }
    successFnc("successFnc"); // testing purpose

    function error(error) {
        window.location.href = "#login";
    }
}

function passProjecDelete(projectID) {
    var token = localStorage.token;
    setConfirmDialog("Delete Project", "Are you sure?", success, cancel);

    function success() {
        var deleteProjectID = {
            username: token,
            password: '',
            id: projectID
        };
        // requestHTTP("POST", 9, deleteProjectID, success, error);

        function success(msg, a, b) {
            if (b.status === 201) {
                window.location.href = '#projects';
            }
        }

        function error(error) {
            if (error.status === 403) {
                setAlertDialog("Error", "Couldn't delete the project, models exists", success);

                function success() {
                    return true;
                }
            } else {
                window.location.href = "#login";
            }
        }

        return true;
    }

    function cancel() {
        return true;
    }
}
