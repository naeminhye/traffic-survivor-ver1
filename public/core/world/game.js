var GAME = GAME || {};
GAME.status = "READY";
GAME.passedSignList = [];

GAME.endGame = () => {
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    // Attempt to unlock
    document.exitPointerLock();
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

    toastr.error(message);
    $("#floating-info").addClass("shown");
    $("#floating-info").append("<span>-" + money + "VNĐ</span>");
    $('#floating-info').animateCss('fadeOutUp', function () {
        // hide after animation
        var oldNum = Number($($(".money-number")[0]).text());
        var newNum = -money;
        $($(".money-number")[0]).text(oldNum + newNum);
        $("#floating-info").empty();
        $("#floating-info").removeClass("shown");
    });
}