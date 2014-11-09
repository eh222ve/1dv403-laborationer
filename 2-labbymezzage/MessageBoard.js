"use strict";

function MessageBoard(containerId, title){
    var that = this;
    this.title = (title !== null ? title : 'LabbyMezzages');

    this.rootId = document.getElementById(containerId);

    this.messages = [];

    this.CreateHTMLLayout();

    this.renderMessages();

    setInterval(function () {
        that.renderMessages();
    }, 1000);

}

MessageBoard.prototype.CreateHTMLLayout = function(){
    var that = this;

    var labbyHeader = document.createElement("header");
    var labbyHeaderText = document.createElement("h1");
    labbyHeaderText.innerHTML = this.title;
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
    labbyTextArea.onkeypress = function(e){
        if(e.keyCode == 13){
            if(!e.shiftKey){
                e.preventDefault();
                that.addMessage();
            }
        }
    };

    this.rootId.appendChild(labbyTextArea);

    var labbySubmit = document.createElement("button");
    labbySubmit.className = "submitBtn";
    var submitText = document.createTextNode("Send");
    labbySubmit.appendChild(submitText);

    this.rootId.appendChild(labbySubmit);

    labbySubmit.onclick = function(){
        that.addMessage();
        that.rootId.getElementsByClassName("labbyMezzageContent")[0].focus();
    };
};

MessageBoard.prototype.numberOfMessages = function(){
        return this.messages.length + " messages";
};

MessageBoard.prototype.renderMessage = function(message, count){
    var that = this;
    var messageMain = document.createElement("section");

    var messageRemove = document.createElement("img");
    messageRemove.alt="Close Message";
    messageRemove.src ="images/Close.png";
    messageRemove.onclick = function(){
        if (window.confirm("Do you want to remove the message?")) {
            that.messages.splice(count, 1);
            that.renderMessages();
            that.scrollToBottom();
        }
    };
    messageMain.appendChild(messageRemove);

    var messageTime = document.createElement("img");
    messageTime.alt="View time information";
    messageTime.src ="images/Clock.png";
    messageTime.onclick = function(){
        alert("Message created on: (" + message.getDate() + ")");
    };
    messageMain.appendChild(messageTime);

    var messageText = document.createElement("p");
    messageText.innerHTML = message.getHTMLText();
    messageMain.appendChild(messageText);

    var messageDate = document.createElement("date");
    messageDate.innerHTML = message.getDateText();
    messageMain.appendChild(messageDate);

    return messageMain;
};

MessageBoard.prototype.renderMessages = function(){
    var messageArea = this.rootId.getElementsByClassName("labbyMezzageArea")[0];
    var messageCount = this.rootId.getElementsByClassName("labbyMezzageCount")[0];

    messageArea.innerHTML = "";
    var count = 0;

    var messageContent = '';
    var that = this;
    this.messages.forEach(function(message){
        messageArea.appendChild(that.renderMessage(message, count));
        count++;
    });
    messageCount.innerHTML = this.numberOfMessages();
};
MessageBoard.prototype.scrollToBottom = function(){
    var messageArea = this.rootId.getElementsByClassName("labbyMezzageArea")[0];
    messageArea.scrollTop = messageArea.scrollHeight;
};

MessageBoard.prototype.addMessage = function(){
    var textArea = this.rootId.getElementsByClassName("labbyMezzageContent")[0];
    console.log(textArea.value);

    if(textArea.value != "") {
        this.messages.push(new Message(textArea.value, new Date()));
    }
    textArea.value = '';

    this.renderMessages();
    this.scrollToBottom();
};