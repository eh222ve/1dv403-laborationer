
"use strict";
var PWD = PWD ||{};

PWD.NoteWindow = function(self, xPos, yPos) {
    this.startHeight = 300;
    this.startWidth = 300;
    this.WindowConstruct("Note", true, self, xPos, yPos);
    this.render();
};

PWD.NoteWindow.prototype = new PWD.Window();
PWD.NoteWindow.prototype.constructor = PWD.NoteWindow;

PWD.NoteWindow.prototype.render = function(){
    var self = this;
    self.app.classList.add("Note");

    var textarea = document.createElement("textarea");

    self.app.parentNode.style.position = "absolute";
    self.app.parentNode.style.right = "0";
    self.app.parentNode.style.left = "0";
    self.app.parentNode.style.top = "0";
    self.app.parentNode.style.bottom = "0";
    self.app.appendChild(textarea);
    textarea.focus();
};
