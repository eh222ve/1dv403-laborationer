"use strict";

function MessageBoard(containerId, title){
    this.title = (title !== undefined ? title : 'LabbyMezzages');
    this.rootId = document.getElementById(containerId);
    this.messages = [];

    //Run methods on creation
    this.CreateHTMLLayout();
    this.renderMessages();
}

//Create HTML structure and keypress events for application
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

//Return number of messages in array messages[]
MessageBoard.prototype.numberOfMessages = function(){
        return this.messages.length + " messages";
};

//Render one message and onclick-event for images
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

    //Update messages every second
    setInterval(function () {
        messageDate.innerHTML = message.getDateText();
    }, 1000*15);

    messageMain.appendChild(messageDate);

    return messageMain;
};

//Render all messages
MessageBoard.prototype.renderMessages = function(){

        var messageArea = this.rootId.getElementsByClassName("labbyMezzageArea")[0];
        var messageCount = this.rootId.getElementsByClassName("labbyMezzageCount")[0];

        messageArea.innerHTML = "";
        var count = 0;

        var messageContent = '';
        var that = this;
        this.messages.forEach(function (message) {
            messageArea.appendChild(that.renderMessage(message, count));
            count++;
        });
        messageCount.innerHTML = this.numberOfMessages();
};

//Scroll to bottom of messages
MessageBoard.prototype.scrollToBottom = function(){
    var messageArea = this.rootId.getElementsByClassName("labbyMezzageArea")[0];
    messageArea.scrollTop = messageArea.scrollHeight;
};

//Add message to array messages[], then scroll to bottom
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