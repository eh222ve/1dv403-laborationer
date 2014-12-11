/**
 * Created by Erik.
 */
"use strict";
function Message(message, date, author){
    this.getText = function(){
        return message;
    };

    this.setText = function(_text){
        message = _text;
    };

    this.getDate = function(){
        return date;
    };

    this.setDate = function(_date){
        date = _date;
    };

    this.getAuthor = function(){
        return author;
    };

    this.setAuthor = function(_author){
        author = _author;
    };
}
Message.prototype.getHTMLText       = function(){
    return this.getText();//.replace(/[\n\r]/g, "</br>");
};
Message.prototype.getDateText       = function(){
    var now = new Date();
    var milliseconds = now - this.getDate();
    var seconds = Math.round(milliseconds/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = now.getUTCDate() - this.getDate().getUTCDate();
    var months = now.getUTCMonth() - this.getDate().getUTCMonth();

    var formattedTime = this.getDate().getHours() + ":" + (this.getDate().getMinutes() < 10 ? '0' : '') + this.getDate().getMinutes() + ":" + (this.getDate().getSeconds() < 10 ? '0' : '') + this.getDate().getSeconds();

    if(seconds < 60 && months < 1){
        return "just now";
    }
    else if(minutes == 1 && months === 0){
        return minutes + " minute ago";
    }
    else if(minutes < 60 && months === 0){
        return minutes + " minutes ago";
    }
    else if(days < 1 && months === 0){
        return "Today " + formattedTime;
    }
    else if(days < 2 && months === 0){
        return "Yesterday " + formattedTime;
    }
    else
    {
        return this.getDate().getUTCDate() + "/" + (this.getDate().getMonth() + 1) + "-" + this.getDate().getFullYear();
    }
};

MessageBoard.prototype = new Window();
MessageBoard.prototype.constructor  = MessageBoard;
function MessageBoard(self, xPos, yPos) {
    this.WindowConstruct("Chat", false, self, xPos, yPos);

    this.title = 'Chat';
    this.app.classList.add("labbymezzage");
    this.messages = [];
    this.imageLocation = "images/chat";
    this.timer = undefined;

    var settings = this.getCookie();

    if(typeof settings === "object"){
        this.refreshRate = settings[0];
        this.username = settings[1];
        this.history = settings[2];
    }else{
        this.refreshRate = 10000;
        this.username = "Anonymous";
        this.history = 20;
    }

    this.connection = undefined;

    //Run methods on creation
    this.CreateHTMLLayout();
    this.getMessagesFromServer();
}
MessageBoard.prototype.ClearTimers              = function(){
    clearInterval(this.timer);
    if(typeof this.connection !== "undefined") {
        this.connection.abort();
    }
};
MessageBoard.prototype.CreateHTMLLayout         = function(){
    var that = this;

    var labbyMain = document.createElement("div");
    labbyMain.className = "labbyMezzageArea";
    this.app.appendChild(labbyMain);

    var labbymezzageCount = document.createElement("div");
    labbymezzageCount.className = "labbyMezzageCount";
    this.app.appendChild(labbymezzageCount);

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

    this.app.appendChild(labbyTextArea);

    var labbySubmit = document.createElement("button");
    labbySubmit.className = "submitBtn";
    var submitText = document.createTextNode("Send");
    labbySubmit.appendChild(submitText);

    this.app.appendChild(labbySubmit);

    labbySubmit.onclick = function(){
        that.addMessage();
        that.app.getElementsByClassName("labbyMezzageContent")[0].focus();
    };
};
MessageBoard.prototype.numberOfMessages         = function(){
    return this.messages.length + " messages";
};
MessageBoard.prototype.renderMessage            = function(message){
    var messageMain = document.createElement("section");

    var author = document.createElement("p");
    author.innerHTML = "Skrivet av: " + message.getAuthor();
    messageMain.appendChild(author);

    var messageText = document.createElement("p");
    messageText.innerHTML = message.getHTMLText();
    messageMain.appendChild(messageText);

    var messageDate = document.createElement("date");
    messageDate.innerHTML = message.getDateText();

    messageMain.appendChild(messageDate);

    return messageMain;
};
MessageBoard.prototype.getMessagesFromServer    = function(){
    var self = this, timer;
    var loadMessages = function(response){
        clearTimeout(timer);
        var parseXml;
        self.messages = [];
        if (typeof window.DOMParser != "undefined") {
            parseXml = function(xmlStr) {
                return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
            };
        } else if (typeof window.ActiveXObject != "undefined" &&
            new window.ActiveXObject("Microsoft.XMLDOM")) {
            parseXml = function(xmlStr) {
                var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlStr);
                return xmlDoc;
            };
        } else {
            throw new Error("No XML parser found");
        }
        self.setStatus("Messages received");
        var xml = parseXml(response);
        var messages = xml.getElementsByTagName("message");
        for(var i = 0; i < messages.length; i++){
            var message = messages[i];
            var text = message.querySelector("text").innerHTML;
            var time = message.querySelector("time").innerHTML;
            var author = message.querySelector("author").innerHTML;
            var id = message.querySelector("id").innerHTML;
            self.messages.push(new Message(text, new Date(parseInt(time)), author));
        }
        self.renderMessages();
    };
    self.setStatus("Retrieving messages");
    timer = setTimeout(function(){
        self.setStatus("Laddar meddelanden...<img src='images/loader_white.gif'>");
    }, 100);
    var history = (self.history !== undefined) ? "?history=" + self.history : "";
    self.connection = new AjaxCon("http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php" + history, loadMessages, "GET");

    this.timer = setInterval(function(){
        timer = setTimeout(function(){
            self.setStatus("Laddar meddelanden...<img src='images/loader_white.gif'>");
        }, 100);
        self.connection = new AjaxCon("http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php" + history, loadMessages, "GET");
    }, self.refreshRate)
};
MessageBoard.prototype.renderMessages           = function(){

    var messageArea = this.app.getElementsByClassName("labbyMezzageArea")[0];
    var messageCount = this.app.getElementsByClassName("labbyMezzageCount")[0];

    messageArea.innerHTML = "";
    var count = 0;

    var that = this;

    this.messages.forEach(function (message) {
        messageArea.appendChild(that.renderMessage(message, count));
        count++;
    });
    messageCount.innerHTML = this.numberOfMessages();
    this.scrollToBottom();
};
MessageBoard.prototype.scrollToBottom           = function(){
    var messageArea = this.app.getElementsByClassName("labbyMezzageArea")[0];
    messageArea.scrollTop = messageArea.scrollHeight;
};
MessageBoard.prototype.addMessage               = function(){
    var self = this;
    var textArea = this.app.getElementsByClassName("labbyMezzageContent")[0];
    var handleCallback = function(response){
        console.log(response);
        textArea.value = '';
        self.ClearTimers();
        self.getMessagesFromServer();
        self.scrollToBottom();
    };
    if(textArea.value != "") {
        /*var string = ({
         username: self.username,
         text: textArea.value
         });*/
        // new AjaxCon("http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php", handleCallback, "POST", string);
        $.ajax({
            type: "POST",
            url: "http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php",
            data: ({
                username: self.username,
                text: textArea.value
            }),
            success: handleCallback
        });
    }
};
MessageBoard.prototype.contextMenu              = function(){
    var that = this;

    var option1 = document.createElement("ul");
    option1.dataset.name = "Settings";

    var level = document.createElement("li");
    var aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/user.png'> Nickname";
    aTag.onclick = function(e){
        e.preventDefault();
        that.getNickSetting();
    };
    level.appendChild(aTag);
    option1.appendChild(level);

    level = document.createElement("li");
    aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/interval.png'> Time interval";
    aTag.onclick = function(e){
        e.preventDefault();
        that.getIntervalSetting();
    };
    level.appendChild(aTag);
    option1.appendChild(level);

    level = document.createElement("li");
    aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/messages.png'> Number of messages";
    aTag.onclick = function(e){
        e.preventDefault();
        that.getHistorySetting();
    };
    level.appendChild(aTag);
    option1.appendChild(level);

    level = document.createElement("li");
    aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/refresh.png'> Refresh";
    aTag.onclick = function(e){
        e.preventDefault();
        that.ClearTimers();
        that.getMessagesFromServer();
    };
    level.appendChild(aTag);
    option1.appendChild(level);

    return [option1];
};
MessageBoard.prototype.getIntervalSetting       = function(){
    var self = this;

    var popup = document.createElement("div");
    popup.classList.add("popup");

    var close = document.createElement("a");
    close.href = "#";
    var closeImg = document.createElement("img");
    closeImg.src = "images/closewindow.png";
    close.appendChild(closeImg);
    close.onclick = function(e){
        e.preventDefault();
        self.app.parentNode.removeChild(popup);
    };
    popup.appendChild(close);

    var input = document.createElement("select");
    var rates = [[10000, "10 sekunder"], [15000, "15 sekunder"], [30000, "30 sekunder"], [60000, "1 minut"], [300000, "5 minuter"], [600000, "10 minuter"]];
    input.innerHTML = "";
    rates.forEach(function(rate){
        var selected = (rate[0] == self.refreshRate) ? " selected" : "";
        input.innerHTML += "<option value='" + rate[0] + "'" + selected + ">" + rate[1] + "</option>";
    });
    input.innerHTML += "<option value='15000'>15 sekunder</option>";

    popup.appendChild(input);

    var submit = document.createElement("button");
    submit.innerHTML = "Ändra";
    submit.onclick = function(){
        self.ClearTimers();
        self.refreshRate = input.value;
        self.createCookie();
        self.getMessagesFromServer();
        self.app.parentNode.removeChild(popup);
    };
    popup.appendChild(submit);

    this.app.parentNode.appendChild(popup);
};
MessageBoard.prototype.getHistorySetting        = function(){
    var self = this;

    var popup = document.createElement("div");
    popup.classList.add("popup");

    var close = document.createElement("a");
    close.href = "#";
    var closeImg = document.createElement("img");
    closeImg.src = "images/closewindow.png";
    close.appendChild(closeImg);
    close.onclick = function(e){
        e.preventDefault();
        self.app.parentNode.removeChild(popup);
    };
    popup.appendChild(close);

    var input = document.createElement("select");
    var rates = [[5, "5 meddelanden"], [10, "10 meddelanden"], [20, "20 meddelanden"], [50, "50  meddelanden"], [undefined, "Alla  meddelanden"]];
    input.innerHTML = "";
    rates.forEach(function(rate){
        var selected = (rate[0] == self.history) ? " selected" : "";
        input.innerHTML += "<option value='" + rate[0] + "'" + selected + ">" + rate[1] + "</option>";
    });

    popup.appendChild(input);

    var submit = document.createElement("button");
    submit.innerHTML = "Ändra";
    submit.onclick = function(){
        self.ClearTimers();
        self.history = input.value;
        self.createCookie();
        self.getMessagesFromServer();
        self.app.parentNode.removeChild(popup);
    };
    popup.appendChild(submit);

    this.app.parentNode.appendChild(popup);
};
MessageBoard.prototype.getNickSetting           = function(){
    var self = this;

    var popup = document.createElement("div");
    popup.classList.add("popup");

    var close = document.createElement("a");
    close.href = "#";
    var closeImg = document.createElement("img");
    closeImg.src = "images/closewindow.png";
    close.appendChild(closeImg);
    close.onclick = function(e){
        e.preventDefault();
        self.app.parentNode.removeChild(popup);
    };
    popup.appendChild(close);

    var input = document.createElement("input");
    input.type = "text";
    input.value = self.username;

    popup.appendChild(input);

    var submit = document.createElement("button");
    submit.innerHTML = "Ändra";
    submit.onclick = function(){
        self.username = input.value;
        self.createCookie();
        self.app.parentNode.removeChild(popup);
    };
    popup.appendChild(submit);

    this.app.parentNode.appendChild(popup);
    input.focus();
    input.select();
};
MessageBoard.prototype.createCookie             = function(){
    var name = "setting";
    var value = this.refreshRate + "," + this.username + "," + this.history;
    var days = 1;

    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};
MessageBoard.prototype.getCookie                = function(){
    var c_name = "setting";
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }

            return decodeURI(document.cookie.substring(c_start, c_end)).split(',');

        }
    }
    return "";
};