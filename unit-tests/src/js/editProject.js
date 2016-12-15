function getProjectByID(projectID, successFnc) {
    //Cookie checker
    if (localStorage.getItem("token") === '') {
        window.location.href = "#login";
    }

    var token = localStorage.getItem("token");
    var projectEditID = {
        username: token,
        password: '',
        id: projectID
    };

    // requestHTTP("POST", 7, projectEditID, success, error);

    function success(msg) {
        successFnc(msg.Projects);
    }
    successFnc("a") // testing puropse

    function error(error) {
        window.location.href = "#login";
    }


    $("#EditProjectbtn").click(function editProject() {
        var err = 0;
        var ui_projectname = $("#uiname").val();
        var status = $("#status").val();
        var startDate = $("#startdate").val();
        var endDate = $("#enddate").val();
        var author = $("#author").val();
        var details = tinyMCE.get('details').getContent();
        var projectname = ui_projectname.replace(/ /g, '');
        projectname = projectname.toLowerCase();

        if (ui_projectname === '') {
            $("#uiname").css("border", "1px solid red");
            err = 1;
        }

        if (status === '') {
            $("#status").css("border", "1px solid red");
            err = 1;
        }

        if (startDate === '') {
            $("#startdate").css("border", "1px solid red");
            err = 1;
        }

        if (endDate === '') {
            $("#enddate").css("border", "1px solid red");
            err = 1;
        }

        if (author === '') {
            $("#author").css("border", "1px solid red");
            err = 1;
        }


        if (err === 0) {
            var arr = {
                username: token,
                password: '',
                id: projectID,
                ui_projectname: ui_projectname,
                projectname: projectname,
                projectstatus: status,
                projectstartdate: startDate,
                projectcompletiondate: endDate,
                projectauthor: author,
                projectdetails: details
            };

            // requestHTTP("POST", 8, arr, success, error);


            function success(msg, a, b) {
                if (b.status === 201) {
                    window.location.href = '#projects';
                }
            }

            function error(error) {
                window.location.href = "#login";
            }
        }

        return false;

    });
}
