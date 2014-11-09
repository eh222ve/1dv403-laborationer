"use strict";

var MessageBoard = {
    messages: [],

    renderMessages: function(){
      document.getElementById("labbymezzageArea").innerHTML = "";

        var messageContent = '';

        this.messages.forEach(function(message){
            messageContent += MessageBoard.renderMessage(message); //this?????
        });

        document.getElementById("labbymezzageArea").innerHTML = messageContent;
        document.getElementById("labbymezzageCount").innerHTML = this.numberOfMessages();
    },

    addMessage: function(){
        var textArea = document.getElementById("labbymezzageContent");
        this.messages.push(new Message(textArea.value, new Date()));
        textArea.value = '';
        this.renderMessages();
    },

    renderMessage: function(message){
        return "<section><p>" + message.getHTMLText() + "</p><date>" + message.getDateText() + "</date></section>";
    }

    numberOfMessages: function(){
        return this.messages.length;
    }
};