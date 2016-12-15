function submitProject(arr) {
    // requestHTTP("POST", 6, arr, success, error);

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
        } else {
            window.location.href = "#login";
        }
    }
}
