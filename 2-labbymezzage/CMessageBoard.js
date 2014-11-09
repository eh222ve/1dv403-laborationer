"use strict";

function MessageBoard(containerId){

    this.rootId = document.getElementById(containerId);
    var that = this;
    this.messages = [];

    this.setMessage = function(message){
        alert('try to push');
        that.messages.push(message);
    };

    var labbyHeader = document.createElement("header");
    var labbyHeaderText = document.createElement("h1");
    labbyHeaderText.innerHTML = "LabbyMezzages";
    labbyHeader.appendChild(labbyHeaderText);
    this.rootId.appendChild(labbyHeader);

    var labbyMain = document.createElement("div");
    labbyMain.className = "labbyMezzageArea";
    this.rootId.appendChild(labbyMain);

    var labbymezzageCount = document.createElement("div");
    labbymezzageCount.className = "labbyMezzageCount";
    this.rootId.appendChild(labbymezzageCount);

    var labbyTextArea = document.createElement("textarea");
    labbyTextArea.className = "labbyMezzageContent";
    this.rootId.appendChild(labbyTextArea);

    var labbySubmit = document.createElement("button");
    labbySubmit.className = "submitBtn";
    var submitText = document.createTextNode("CLICK ME");
    labbySubmit.appendChild(submitText);

    this.rootId.appendChild(labbySubmit);


    labbySubmit.onclick = function(){
        var textArea = document.getElementsByClassName("labbyMezzageContent")[0];

        that.messages.push(new Message(textArea.value, new Date()));

        textArea.value = '';

        that.renderMessages();
    };

    this.renderMessage = function(message){
        return "<section><article>remove</article><p>" + message.getHTMLText() + "</p><date>" + message.getDateText() + "</date></section>";
    };

}

MessageBoard.prototype.numberOfMessages = function(){
    return this.messages.length;
};

MessageBoard.prototype.renderMessages = function(){
    var messageArea = this.rootId.getElementsByClassName("labbyMezzageArea")[0];
    var messageCount = this.rootId.getElementsByClassName("labbyMezzageCount")[0];

    messageArea.innerHTML = "";
    var count = 0;

    var messageContent = '';
    var that = this;
    this.messages.forEach(function(message){
        messageContent += that.renderMessage(message); //this?????
        count++;
    });

    messageArea.innerHTML = messageContent;
    messageCount.innerHTML = count;
};