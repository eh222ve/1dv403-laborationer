"use strict";

window.onload = function() {
    var boards = document.getElementsByClassName("labbymezzage");

    for(var i = 0; i < boards.length; i++){
        new MessageBoard(boards[i].id, boards[i].dataset.appName);
    }
};