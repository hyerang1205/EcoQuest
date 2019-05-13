$(document).ready(() => {
    let print = user => {
        console.log(JSON.stringify(user));
        // $("#userInfo").html("User Info: " + JSON.stringify(user));
    };

    $(".headerRight").click(() => {
        $(".headerLeft").css("border-bottom", "none");
        $(".headerRight").css("border-bottom", "2px solid #42A164");
        $(".headerLeftCon").css("display", "none");
        $(".headerRightCon").css("display", "inline");
    });

    $(".headerLeft").click(() => {
        $(".headerRight").css("border-bottom", "none");
        $(".headerLeft").css("border-bottom", "2px solid #42A164");
        $(".headerRightCon").css("display", "none");
        $(".headerLeftCon").css("display", "inline");
    });


    $("#submitUP").click(() => {
        if ($("#pass1").val() == $("#cpass1").val())
            $.ajax({
                type: "post",
                url: "/users",
                dataType: 'json',
                data: {
                    username: $("#uname1").val(),
                    email: $("#email1").val(),
                    password: $("#pass1").val()
                },
                success: user => {
                    print(user)
                    window.location.href="/";
                },
                error: err => {
                    $("#status").text(err.responseText);
                }
            });
    });

    $("#submitIN").click(() => {
        if($("#unameIN1").val()===("showmea")
            && $("#passIN1").val()===("sunset")){
            $('body').css('background-image', 'url("../images/sunset.png');
            $("#unameIN1").val("Anything else you would to see?");
            $("#passIN1").val(null);
            return;
        }

        $.ajax({
            type: "post",
            url: "/login",
            dataType: 'json',
            data: {
                username: $("#unameIN1").val(),
                password: $("#passIN1").val()
            },
            success: user => {
                localStorage.setItem('auth-token', user.token);
                    window.location.href="main";
            },
            error: err => {
                $("#status").text(err.responseText);
            }
        });
    });


});