var GAME = GAME || {};
GAME.status = "READY";
GAME.passedSignList = [];

GAME.updateStatusChange = () => {
    if (GAME.status === "PLAYING") {
        WORLD.controls.enabled = true;
        GAME.blocker.css("display", "none");
    } else {
        WORLD.controls.enabled = false;
        if (GAME.status !== "END") {
            GAME.blocker.css("display", "-webkit-box");
            GAME.blocker.css("display", "-moz-box");
            GAME.blocker.css("display", "box");
            GAME.menu.css("display", "block");
        }
        if (GAME.status === "STOP") {
            GAME.menu.css("display", "none");
        }

        if (GAME.status === "READY") {
            $("#restart-btn").css("display", "none");
            $("#instruction-btn").css("display", "inline-block");
        } else {
            $("#restart-btn").css("display", "inline-block");
            $("#instruction-btn").css("display", "none");
        }
        GAME.controllers.css("display", "none");
    }
}

GAME.endGame = () => {
    GAME.status = "END";

    var _ol = "<ol>"
    if(GAME.passedSignList.length > 0) {
        GAME.passedSignList.forEach((info) => {
            _ol += ("<li>Sign's ID " + info.sign.sign_id + " at " + info.time.toLocaleDateString("en-US") + "</li>")
        });
    };
    _ol += "</ol>";
    $("#signListContainer").append(_ol);

    var passedSigns = GAME.numOfSign + "/" + GAME.totalNumOfSign;
    $("#passedSigns").text(passedSigns);
    $("#lostMoney").text($($(".money-number")[0]).text());

    $(".screen-element").css("display", "none");
    $("#gameBoard").css("display", "block");
}

GAME.handleFining = (message, money, callback) => {

    //var date = new Date();

    var oldNum = Number($($(".money-number")[0]).text());
    var newNum = -money;
    
    toastr.error(message);
    $("#floating-info").addClass("shown");
    $("#floating-info").append("<span>-" + money + "VNĐ</span>");
    $('#floating-info').animateCss('fadeOutUp', function () {
        // hide after animation
        $($(".money-number")[0]).text(oldNum + newNum);
        $("#floating-info").empty();
        $("#floating-info").removeClass("shown");
    });
}