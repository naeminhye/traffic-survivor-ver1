var GAME = GAME || {};
GAME.status = "READY";
GAME.passedSignList = [];
GAME.startTime;
GAME.endTime;

GAME.blocker = $('#blocker');
GAME.instructions = $('#instructions');
GAME.menu = $("#game-menu");
GAME.controllers = $("#controllers");

GAME.hornSound = new Audio('/audio/horn/horn.mp3');

//Audio tags
GAME.audio = {
    sfx: {
        horn: new Audio('/audio/horn/horn.mp3'),//document.getElementById("sfx-horn"),
        select: new Audio('/audio/menu-select/menu-select.wav')//	document.getElementById("sfx-select")
    }
};

// GAME.results = {
//     signList: [],
//     lostMoney: 0,
//     violations: []
// }

GAME.resumeGame = () => {

    GAME.status = "PLAYING";
    GAME.menu.css("display", "none");
    GAME.controllers.css("display", "block");
};

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
    GAME.endTime = new Date();

    if($("#signListContainer").children().length === 0) {
        var _ol = "<ol>"
        if(GAME.passedSignList.length > 0) {
            GAME.passedSignList.forEach((info) => {
                _ol += ("<li>Biển báo " + info.sign.object.name + ", số hiệu " + info.sign.sign_id + ", thời gian: " + info.time.toLocaleString("en-US", { timeZone: 'UTC' }) + "</li>")
            });
        };
        _ol += "</ol>";
        $("#signListContainer").append(_ol);
    }

    var passedSigns = GAME.numOfSign + "/" + GAME.totalNumOfSign;
    $("#passedSigns").text(passedSigns);
    $("#lostMoney").text($($(".money-number")[0]).text());

    $(".screen-element").css("display", "none");
    $("#gameBoard").css("display", "block");

    // save passed lesson
    var passedLessons = localStorage.getObject("passedLessons") ? localStorage.getObject("passedLessons") : [];
    if(!passedLessons.includes(currentChapter)){
        passedLessons.push(currentChapter)
        localStorage.setObject("passedLessons", passedLessons);
    }
  
    let timeDiff = GAME.endTime - GAME.startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    // get seconds 
    var _seconds = Math.round(timeDiff);
    $("#timeDiff").text(_seconds);

}

GAME.handleFining = (message, money, callback) => {

    //var date = new Date();

    var oldNum = Number($($(".money-number")[0]).text());
    var newNum = -money;
    
    toastr.error(message);
    $("#floating-info").addClass("shown");
    $("#floating-info").append("<span>-" + money + "K VNĐ</span>");
    $('#floating-info').animateCss('fadeOutUp', function () {
        // hide after animation
        $($(".money-number")[0]).text(oldNum + newNum);
        $("#floating-info").empty();
        $("#floating-info").removeClass("shown");
    });
}