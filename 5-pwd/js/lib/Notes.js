/**
 * Created by Erik.
 */
"use strict";

NoteWindow.prototype = new Window();
NoteWindow.prototype.constructor = NoteWindow;
function NoteWindow(self, xPos, yPos) {
    this.startHeight = 300;
    this.startWidth = 300;
    this.WindowConstruct("Note", true, self, xPos, yPos);
    this.render();
}
NoteWindow.prototype.render = function(){
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
