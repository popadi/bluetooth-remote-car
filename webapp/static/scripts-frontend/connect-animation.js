function resetAnimation() {
    $("#connection-animation").css("display", "block");
    $(".path").removeClass("path-complete success error");
    $(".fill").removeClass("fill-complete success error");

    k = $("#connection-animation").html();
    $("#connection-animation").empty();
    $("#connection-animation").append(k);

    $("#success-graphics").css("display", "none");
    $("#error-graphics").css("display", "none");

    $("#get-devices-btn").hide();
    $("#circle-logo").hide();
    $("#radar").hide();
}


function toggleAnimationEnd(connectionStatus) {
    if (connectionStatus) {
        $(".check").attr("class", "check check-complete");
        $(".fill").attr("class", "fill fill-complete");

        setTimeout(function () {
            $(".check").attr("class", "check check-complete success");
            $(".fill").attr("class", "fill fill-complete success");
            $(".path").attr("class", "path path-complete");
        }, 500);
    } else {
        $(".xmark").attr("class", "xmark xmark-complete");
        $(".fill").attr("class", "fill fill-complete");

        setTimeout(function () {
            $(".xmark").attr("class", "xmark xmark-complete errror");
            $(".fill").attr("class", "fill fill-complete error");
            $(".path").attr("class", "path path-complete");
        }, 500);
    }
}

