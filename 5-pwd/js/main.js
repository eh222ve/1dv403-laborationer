"use strict";
function Desktop(id){
    this.windows = [];
    this.minimizedApps = 0;
    this.element = document.getElementById(id);
    this.navbar = document.createElement("nav");
    var self = this;

    var getPositionX = function(){
        var position = 30 * self.windows.length + 30;
        if(position / (window.innerWidth - 200) > 1){
            return position - (Math.floor(position / (window.innerWidth - 200)) * (window.innerWidth - 200));
        }else{
            return 30 * self.windows.length + 30;
        }
    };
    var getPositionY = function () {
        var position = 30 * self.windows.length + 30;
        if(position / (window.innerHeight - 300) > 1){
            return position - (Math.floor(position / (window.innerHeight - 300)) * (window.innerHeight - 300));
        }else{
            return 30 * self.windows.length + 30;
        }
    };

    this.element.appendChild(this.navbar);

    var applications = [
        [MemoryGame, "images/appIcons/Memory_Large.png"],
        [Minesweeper, "images/appIcons/Minesweeper_Large.png"],
        [QuizWindow, "images/appIcons/Quiz_Large.png"],
        [QuoteWindow, "images/appIcons/Quote_Large.png"],
        [MessageBoard, "images/appIcons/Chat_Large.png"],
        [RSSWindow, "images/appIcons/RSS_Large.png"],
        [GalleryWindow, "images/appIcons/Gallery_Large.png"]
    ];

    applications.forEach(function(app){
        var aTag = document.createElement("a");
        aTag.href = "#";
        aTag.classList.add("appLauncher");
        aTag.onclick = function(e){
            e.preventDefault();
            self.windows.push(new app[0](self, getPositionX(), getPositionY()));
        };

        var image = document.createElement("img");

        image.src = app[1];

        aTag.appendChild(image);
        self.element.appendChild(aTag);
    });

    this.hideApp = function(application, url){
        self.navbar.classList.add("showNav");
        application = application.parentNode.parentNode;
        application.classList.add("hidden");

        self.minimizedApps++;
        var appImage = document.createElement("img");
        appImage.src = url;
        appImage.className = "minimizedWindow";
        appImage.onclick = function(){
            application.classList.remove("hidden");
            self.navbar.removeChild(appImage);

            if(--self.minimizedApps <= 0){
                self.navbar.classList.remove("showNav");
            }
        };
        self.navbar.appendChild(appImage);
    };
}

function Window(){
    this.dragY = 0;
    this.dragX = 0;
    this.dragging = false;
    this.imageFolder = "images/";
}
Window.prototype.focusWindow        = function(){
    var allApps = document.querySelectorAll(".application");
    for(var i = 0; i < allApps.length; i++){
        allApps[i].style.zIndex = "1";
    }
    this.style.zIndex = "5";
};
Window.prototype.createHTML         = function(){
    var self = this;
    var divApp = document.createElement("div");
    divApp.classList.add("application");
    divApp.style.left = this.xPos + "px";
    divApp.style.top = this.yPos + "px";
    divApp.style.zIndex = "6";
    if(this.startWidth !== undefined){
        divApp.style.width = this.startWidth + "px";
    }
    if(this.startHeight !== undefined){
        divApp.style.height = this.startHeight + "px";
    }

    divApp.onmousedown = this.focusWindow;

    var header = document.createElement("header");
    header.classList.add("appHeader");
    header.onmousedown = function(e){
        if(!divApp.classList.contains("fullscreen")) {
            self.dragY = (e.pageY - divApp.offsetTop);
            self.dragX = (e.pageX - divApp.offsetLeft);
            header.style.cursor = "move";
            self.dragging = true;
            self.DisableSelection(self.desktop.element);
        }
    };
    var disableDragging = function(e){
        if((e.clientY - self.dragY + 200) > window.innerHeight) {
            divApp.style.top = (window.innerHeight - 200) + "px";
        }
        if((e.clientX - self.dragX + 200) > window.innerWidth) {

            divApp.style.left = (window.innerWidth - 200) + "px";
        }
        self.dragging = false;
        header.style.removeProperty("cursor");
        self.EnableSelection(self.desktop.element);
    };
    header.onmouseup = disableDragging;

    header.addEventListener("mouseleave", disableDragging);
    header.addEventListener("mousemove", function(e){
        if (self.dragging) {
            divApp.style.top = (e.clientY - self.dragY)  + "px";
            divApp.style.left = (e.clientX - self.dragX) + "px";
        }
    });

    var appIcon = document.createElement("img");
    appIcon.src = this.imageFolder + "appIcons/" + this.type + ".png";
    appIcon.alt = "Icon";
    appIcon.ondragstart = function() { return false; };
    appIcon.classList.add("appIcon");
    header.appendChild(appIcon);

    var title = document.createElement("h2");
    title.innerHTML = this.type;
    header.appendChild(title);

    var closeWindow = document.createElement("img");
    closeWindow.classList.add("appController");
    closeWindow.alt = "Close window";
    closeWindow.src = this.imageFolder + "closewindow.png";
    closeWindow.onclick = function(){
        if(typeof self.ClearTimers == "function"){
            self.ClearTimers();
        }
        document.querySelector("#desktopApplication").removeChild(divApp);
    };
    header.appendChild(closeWindow);

    var fullsize = document.createElement("img");
    fullsize.classList.add("appController");
    fullsize.alt = "Fullscreen";
    fullsize.src = this.imageFolder + "fullsize.png";
    fullsize.onclick = function(){
        if(divApp.classList.contains("fullscreen")){
            divApp.style.left = self.xPos + "px";
            divApp.style.top = self.yPos + "px";
            if(self.startWidth !== undefined){
                divApp.style.width = self.startWidth + "px";
            }
            if(self.startHeight !== undefined){
                divApp.style.height = self.startHeight + "px";
            }
        }else{
            self.xPos = divApp.offsetLeft;
            self.yPos = divApp.offsetTop;
            divApp.style.removeProperty('width');
            divApp.style.removeProperty('height');
            divApp.style.removeProperty('top');
            divApp.style.removeProperty('left');
        }
        divApp.classList.toggle("fullscreen");
    };
    header.appendChild(fullsize);

    var minimizewindow = document.createElement("img");
    minimizewindow.classList.add("appController");
    minimizewindow.alt = "Minimize";
    minimizewindow.src = this.imageFolder + "minimizewindow.png";
    minimizewindow.onclick = function(){
        self.desktop.hideApp(this, self.imageFolder + "appIcons/" + self.type + "_Large.png");
    };
    header.appendChild(minimizewindow);


    divApp.appendChild(header);

    var main = document.createElement("main");

    if(typeof this.contextMenu !== "undefined"){
        var Menu = document.createElement("div");
        Menu.classList.add("Menu");
        this.contextMenu().forEach(function(menu){
            var contextMenu = menu;
            contextMenu.classList.add("hide");
            contextMenu.addEventListener('mouseleave', function(){
                contextMenu.classList.add("hide");
            }, false);
            var Options = document.createElement("ul");
            Options.classList.add("contextMenu");
            var menuOptions = document.createElement("a");
            menuOptions.href = "#";
            menuOptions.innerHTML = contextMenu.dataset.name;
            var toggleHide = function(e){
                e.preventDefault();
                contextMenu.classList.toggle("hide");
            };
            menuOptions.onclick = toggleHide;
            contextMenu.onclick = toggleHide;

            Menu.appendChild(Options);
            Options.appendChild(menuOptions);
            Options.appendChild(contextMenu);
        });
        main.appendChild(Menu);
    }
    this.app = document.createElement("div");
    main.appendChild(this.app);
    divApp.appendChild(main);

    self.statusBar = document.createElement("footer");
    self.statusBar.classList.add("statusBar");

    divApp.appendChild(self.statusBar);

    if(this.resizable) {
        var startX, startY, startWidth, startHeight;
        var initDrag = function(e) {
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(divApp).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(divApp).height, 10);
            document.documentElement.addEventListener('mousemove', doDrag, false);
            document.documentElement.addEventListener('mouseup', stopDrag, false);
        };
        var doDrag = function(e) {
            if((startWidth + e.clientX - startX) < window.innerWidth - 300) {
                divApp.style.minWidth = (startWidth + e.clientX - startX) + 'px';
            }
            if((startHeight + e.clientY - startY) < window.innerHeight - 200 ){
                divApp.style.minHeight = (startHeight + e.clientY - startY) + 'px';
            }
        };
        var stopDrag = function() {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        };

        var resize = document.createElement("img");
        resize.alt = "Resize";
        resize.src = this.imageFolder + "resize.png";
        resize.className = "resize noselect";
        resize.ondragstart = function() { return false; };
        resize.addEventListener('mousedown', initDrag, false);

        divApp.appendChild(resize);
    }
    document.querySelector("#desktopApplication").appendChild(divApp);

};
Window.prototype.setStatus          = function(message){
    this.statusBar.innerHTML = "Status: " + message;
};
Window.prototype.WindowConstruct    = function(type, resizable, self, xPos, yPos){
    this.resizable = resizable;
    this.desktop = self;
    this.xPos = xPos;
    this.yPos = yPos;
    this.type = type;
    this.createHTML();
};
Window.prototype.DisableSelection   = function(element){
    element.onselectstart = function() {return false;};
    element.unselectable = "on";
    element.style.MozUserSelect = "none";
    element.style.cursor = "default";
};
Window.prototype.EnableSelection    = function(element){
    element.onselectstart = function() {return true;};
    element.unselectable = "off";
    element.style.MozUserSelect = "text";
    element.style.cursor = "auto";
};

function AjaxCon(url, callback, posttype, params){
    var READY_STATE_UNINITIALIZED = 0;
    var READY_STATE_OPENED      = 1;
    var READY_STATE_SENT        = 2;
    var READY_STATE_LOADING     = 3;
    var READY_STATE_COMPLETE    = 4;

    var  xhr = this.getXHR();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === READY_STATE_COMPLETE){
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 400){
                callback(xhr.responseText);
            }else{
                console.log('Läsfel, status: ' + xhr.status);
            }
        }
    };

    if(posttype === "get" || posttype === "GET"){
        xhr.open("get", url, true);
        xhr.send(null)

    }else{
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(params);
    }

    this.abort = function(){
        xhr.abort();
    };
}
AjaxCon.prototype.getXHR            = function(){
    var xhr = null;

    try{
        xhr = new XMLHttpRequest();
    }catch(error){
        try{
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }catch(error){
            throw new Error("No XHR object available");
        }
    }
    return xhr;
};

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
        console.log(settings);
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
    }, 400);
    var history = (self.history !== undefined) ? "?history=" + self.history : "";
    self.connection = new AjaxCon("http://homepage.lnu.se/staff/tstjo/labbyserver/getMessage.php" + history, loadMessages, "GET");

    this.timer = setInterval(function(){
        timer = setTimeout(function(){
            self.setStatus("Laddar meddelanden...<img src='images/loader_white.gif'>");
        }, 400);
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
        new AjaxCon("http://homepage.lnu.se/staff/tstjo/labbyserver/setMessage.php", handleCallback, "POST", JSON.stringify({text: textArea.value, username: self.username}));
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

ImageWindow.prototype = new Window();
ImageWindow.prototype.constructor = ImageWindow;
function ImageWindow(url, desktop, xPos, yPos) {
    var image = document.createElement("img");
    image.src = url;

    this.WindowConstruct("Gallery", false, desktop, xPos, yPos);
    this.app.appendChild(image);
}

GalleryWindow.prototype = new Window();
GalleryWindow.prototype.constructor = GalleryWindow;
function GalleryWindow(desktop, xPos, yPos) {
    this.WindowConstruct("Gallery", false, desktop, xPos, yPos);

    this.Url = "http://homepage.lnu.se/staff/tstjo/labbyServer/imgviewer/";
    this.thumbWidth = 0;
    this.thumbHeight = 0;
    this.timer = undefined;
    this.imageArr = undefined;
    this.app.classList.add("Gallery");
    this.OpenInNewWindow = function(url){
        new ImageWindow(url, desktop, xPos+5, yPos+5);
    };
    this.loadImages();
}
GalleryWindow.prototype.render      = function(){
    var self = this;
    this.imageArr.forEach(function(currentImage){
        var imageContainer = document.createElement("a");
        imageContainer.href="#";
        imageContainer.style.width = self.thumbWidth + "px";
        imageContainer.style.height = self.thumbHeight + "px";
        imageContainer.classList.add("imageContainer");
        imageContainer.onclick = function(e){
            e.preventDefault();
            self.OpenInNewWindow(currentImage.URL);
        };

        var image = document.createElement("img");
        image.src = currentImage.thumbURL;

        imageContainer.appendChild(image);
        self.app.appendChild(imageContainer);
    });
};
GalleryWindow.prototype.loadImages  = function(){
    var timer, self = this;

    var handler = function(response){
        //self.setStatus("Retrieved images from server");
        clearTimeout(timer);
        self.setStatus("Bilder laddade!");
        self.imageArr = JSON.parse(response);
        for(var i=0; i < self.imageArr.length; i++){
            if(self.imageArr[i].thumbWidth > self.thumbWidth){
                self.thumbWidth = self.imageArr[i].thumbWidth;
            }
            if(self.imageArr[i].thumbHeight > self.thumbHeight){
                self.thumbHeight = self.imageArr[i].thumbHeight;
            }
        }
        self.render()
    };
    self.setStatus("Laddar bilder...");
    timer = setTimeout(function(){
        self.setStatus("Laddar bilder...<img src='images/loader_white.gif'>");
    }, 1500);
    new AjaxCon(this.Url, handler, "GET");
};

var RandomGenerator = {

    /*
     Denna metod tar antalet rader och columner som inparameter.

     Metoden returnerar en array inneh�llandes utslumpade tal mellan 1 och (rows*cols)/2. Varje tal representeras tv�
     g�nger och motsvarar s�ledes en spelbricka.

     I en 4*4 matris kan Arrayen t.ex. se ut s� h�r:
     [1,2,6,8,6,2,5,3,1,3,7,5,8,4,4,7]

     I en 2*4 matris kan Arrayen t.ex. se ut s� h�r:
     [3,4,4,1,2,1,2,3]
     */

    getPictureArray: function(rows, cols)
    {
        var numberOfImages = rows*cols;
        var maxImageNumber = numberOfImages/2;

        var imgPlace = [];

        //Utplacering av bilder i Array
        for(var i=0; i<numberOfImages; i++)
            imgPlace[i] = 0;

        for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
        {
            var imageOneOK = false;
            var imageTwoOK = false;

            do
            {
                if(imageOneOK == false)
                {
                    var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                    if( imgPlace[randomOne] == 0 )
                    {
                        imgPlace[randomOne] = currentImageNumber;
                        imageOneOK = true;
                    }
                }

                if(imageTwoOK == false)
                {
                    var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                    if( imgPlace[randomTwo] == 0 )
                    {
                        imgPlace[randomTwo] = currentImageNumber;
                        imageTwoOK = true;
                    }
                }
            }
            while(imageOneOK == false || imageTwoOK == false);
        }

        return imgPlace;
    }
};
MemoryGame.prototype = new Window();
MemoryGame.prototype.constructor = MemoryGame;
function MemoryGame(self, xPos, yPos) {
    var rows = 2, cols = 4;

    this.WindowConstruct("Memory", false, self, xPos, yPos);

    this.app.classList.add("GameOn-Memory");
    this.imageLocation = "images/memory/";

    this.getRows = function(){return rows;};
    this.setRows = function(value){rows = value;};

    this.getCols = function(){return cols;};
    this.setCols = function(value){cols = value;};

    this.isActive = false;

    this.flippedImage, this.pictureArray, this.structuredArray, this.flippedCards, this.turnCounter;
    this.resetGame([this.getRows(), this.getCols()]);
}
MemoryGame.prototype.resetGame              = function(settings){
    // settings = settings.split(",");
    if(settings[0] !== undefined){
        this.setRows(settings[0]);
    }
    if(settings[1] !== undefined){
        this.setCols(settings[1]);
    }
    this.app.innerHTML = '';
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.flippedImage = undefined;
    this.flippedCards = [];
    this.turnCounter = 0;
    this.renderBoard();
};
MemoryGame.prototype.renderBoard            = function(){
    var div, a, img;
    var that = this;

    this.structuredArray.forEach(function(row){
        div = document.createElement("div");
        div.className = "row";

        row.forEach(function(col){
            a = document.createElement("a");
            a.href = "#";
            img = document.createElement("img");
            img.src = that.imageLocation + "0.png";
            a.appendChild(img);
            a.onclick = function(e){
                e.preventDefault();
                if(that.isActive === false && that.flippedCards.indexOf(col['value']) !== 0) {
                    that.flipCards(this, col);
                }
            };
            div.appendChild(a);
        });
        that.app.appendChild(div);
    });
};
MemoryGame.prototype.getStructuredArray     = function(){
    var rows, cols;
    var output = [];
    for(rows = 0; rows < this.getRows(); rows++){
        output[rows] = [];
        for(cols = 0; cols < this.getCols(); cols++){
            output[rows][cols] = [];
            output[rows][cols]['value'] = this.pictureArray[(this.getCols() * rows) + cols];
            output[rows][cols]['id'] = (this.getCols() * rows) + cols;
        }
    }
    return output;
};
MemoryGame.prototype.getSettings            = function(header, body) {
    var div = document.createElement("div");
    div.className = "overlay";

    var h = document.createElement("h1");
    h.innerHTML = header;
    div.appendChild(h);

    var p = document.createElement("p");
    p.innerHTML = body;
    div.appendChild(p);

    var button = document.createElement("button");
    button.innerHTML = "Starta spel";
    var that = this;
    button.onclick = function(){
        that.resetGame([that.getRows(), that.getCols()]);
    };
    div.appendChild(button);

    this.app.appendChild(div);
};
MemoryGame.prototype.flipCards              = function(aTag, col){
    var img;

    img = aTag.firstChild;

    var that = this;
    that.isActive = true;

    img.className = "flipped";

    setTimeout(function () {
        img.src = that.imageLocation + col['value'] + ".png";

        if (that.flippedImage === undefined) {
            that.flippedImage = [];
            that.flippedImage['element'] = img;
            that.flippedImage['value'] = col['value'];
            that.isActive = false;
        } else {
            that.isActive = true;
            if (that.flippedImage['element'] != img && that.flippedImage['value'] === col['value']) {
                that.turnCounter++;
                that.flippedCards.push(col['value']);
                if(that.flippedCards.length >= (that.pictureArray.length/2)){
                    that.getSettings("Grattis!", "Du klarade av spelet på " + that.turnCounter + " omgångar, vill du spela igen?");
                }
                that.flippedImage = undefined;
                that.isActive = false;
            } else if (that.flippedImage['element'] === img) {
                that.isActive = false;
            }
            else {
                that.turnCounter++;
                setTimeout(function () {
                    var images = [img, that.flippedImage['element']];
                    images.forEach(function(im){
                        im.className  = "";
                        setTimeout(function () {
                            im.src = that.imageLocation + "0.png";
                        }, 125);
                    });
                    that.flippedImage = undefined;
                    that.isActive = false;
                }, 500);
            }

        }
    }, 125);

};
MemoryGame.prototype.contextMenu            = function(){
    var that = this;

    var option1 = document.createElement("ul");
    option1.dataset.name = "Options";

    var level = document.createElement("li");
    var aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/refresh.png'> Reset";
    aTag.onclick = function(e){
        e.preventDefault();
        that.resetGame([that.getRows(), that.getCols()]);
    };
    level.appendChild(aTag);
    option1.appendChild(level);


    var option2 = document.createElement("ul");
    var difficulties = [[1,4],[2,4],[3,4],[4,4]];

    option2.dataset.name = "Difficulties";
    difficulties.forEach(function(difficulty){
        level = document.createElement("li");
        aTag = document.createElement("a");
        aTag.href = "#";
        aTag.innerHTML = "<img src='images/tiles.png'> " + difficulty[0] + "x" + difficulty[1];
        aTag.onclick = function(e){
            e.preventDefault();
            that.resetGame(difficulty);
        };
        level.appendChild(aTag);
        option2.appendChild(level);
    });
    return [option1, option2];
};

Minesweeper.prototype = new Window();
Minesweeper.prototype.constructor = Minesweeper;
function Minesweeper(self, xPos, yPos) {
    this.difficulties = [["Beginner", 9], ["Intermidiate", 15], ["Expert", 20]];

    this.WindowConstruct("Minesweeper", false, self, xPos, yPos);

    this.app.classList.add("GameOn-Minesweeper");
    this.imagePrefix = "images/minesweeper/";
    this.GameWidth = 9;
    this.PictureWidth = 20;

    this.gameOver, this.board = [], this.numberOfMines, this.mines, this.turnedImages, this.markedImages, this.timer, this.clock, this.bombsCounter;
    this.startGame();
}
Minesweeper.prototype.ClearTimers       = function(){
    clearInterval(this.timer);
};
Minesweeper.prototype.startGame         = function(){
    this.setDefaultValues();
    this.drawGame();
    this.calculateMines();
};
Minesweeper.prototype.resetGame         = function(){
    this.resetAllTiles();
    this.setDefaultValues();
    this.bombsCounter.innerHTML = this.numberOfMines;
    this.calculateMines();
    this.startTimer();
};
Minesweeper.prototype.setDefaultValues  = function(){
    this.gameOver = false;
    this.numberOfMines = Math.floor(this.GameWidth*this.GameWidth *0.25);
    this.mines = [];
    this.turnedImages = 0;
    this.markedImages = 0;
};
Minesweeper.prototype.drawGame          = function(){
    var that = this;
    var i;
    that.app.innerHTML = '';

    function clicked(e){
        e.preventDefault();
        if(that.gameOver === false) {
            var col = Math.floor((e.pageX -this.getBoundingClientRect().left) / that.PictureWidth);
            var row = Math.floor((e.pageY -this.getBoundingClientRect().top) / that.PictureWidth);
            if (that.isTurned(row, col) === false) {
                if (e.which === 3) {                                //Right-click
                    if(that.isMarked(row, col) === false) {             //Set marker
                        that.setMarker(row, col);
                    }else if(that.isMarked(row, col) === true) {        //Remove marker
                        that.removeMarker(row, col);
                    }
                } else {                                            //Left-click
                    if (that.hasMine(row, col)) {                       //MINE! Game over :(
                        that.mines.forEach(function (mine) {
                            that.setImage(mine[0], mine[1], that.imagePrefix + "bomb.png");
                        });
                        that.setImage(row, col, that.imagePrefix + "bombred.png");
                        clearTimeout(that.timer);
                        that.gameOver = true;
                    }else {                                             //Show tiles
                        that.showEmptyTiles(row, col);
                    }
                }
                that.bombsCounter.innerHTML = that.numberOfMines - that.markedImages;   //Update marker counter
                if (that.markedImages + that.turnedImages >= that.GameWidth * that.GameWidth && that.markedImages === that.numberOfMines) { //Are we there yet?
                    alert('Congratz! You won!');
                    clearTimeout(that.timer);
                    that.gameOver = true;

                }
            }
        }
    }

    var gameArea = document.createElement("div");                           //Game area
    this.app.style.width = this.GameWidth * this.PictureWidth + "px";
    gameArea.style.width = this.GameWidth * this.PictureWidth + "px";           //Set size according to #tiles and size of tiles
    gameArea.onclick = clicked;                                                 //Left-click
    gameArea.addEventListener('contextmenu', clicked);                              //Right-click

    var header = document.createElement("header");                          //Header

    var newButton = document.createElement("button");                           //New game button
    newButton.innerHTML = "New Game";
    newButton.onclick = function(){
        that.resetGame();
    };

    this.bombsCounter = document.createElement("div");                              //Remaining bomb counter
    this.bombsCounter.className = "bombsLeft";
    this.bombsCounter.innerHTML = this.numberOfMines;

    this.clock = document.createElement("div");                                  //Timer
    this.clock.className = "timer";

    this.startTimer();

    header.appendChild(this.bombsCounter);
    header.appendChild(newButton);
    header.appendChild(this.clock);
    this.app.appendChild(header);
    this.app.appendChild(gameArea);

    this.board = [];

    for(i = 0; i < this.GameWidth; i++){                                        //Render HTML and create array
        var row = document.createElement("div");                                // with elements
        row.className = "row";

        var imageArray = [];

        for(var j = 0; j < this.GameWidth; j++){
            var img = document.createElement("img");
            img.src = this.imagePrefix + "standard.png";
            row.appendChild(img);
            imageArray.push({
                image: img,
                mine: false,
                turned: false,
                marked: false
            });
        }

        this.board.push({
            rowDiv: row,
            rowArray: imageArray
        });
        gameArea.appendChild(row);
    }

};
Minesweeper.prototype.resetAllTiles     = function(){
    var that = this,i,j;

    for(i = 0; i < this.GameWidth; i++) {
        for (var j = 0; j < this.GameWidth; j++) {
            var tile = this.board[i].rowArray[j];
            tile.mine = false;
            tile.turned = false;
            tile.marked = false;

            if(tile.image.src.split('/').indexOf('standard.png') < 0){
                tile.image.src = that.imagePrefix + "standard.png";
            }
        }
    }
};
Minesweeper.prototype.calculateMines    = function(){                              //Calculate position of mines
    for(var i = 0; i < this.numberOfMines; i++){
        var mineRow = Math.floor((Math.random() * this.GameWidth));
        var mineCol = Math.floor((Math.random() * this.GameWidth));

        if(this.hasMine(mineRow, mineCol) === false){
            this.setMine(mineRow, mineCol);
            this.mines.push([mineRow, mineCol]);
        }else{
            i--;
        }
    }
};
Minesweeper.prototype.startTimer        = function(){
    clearTimeout(this.timer);
    var that = this;
    this.clock.innerHTML = 0;
    var time = 1;
    this.timer = setInterval(function(){                                       //Interval
        that.clock.innerHTML = time;
        console.log("timer");
        time++;
    }, 1000);
};
Minesweeper.prototype.contextMenu       = function(){
    var that = this;
    var ul = document.createElement("ul");
    ul.dataset.name = "Difficulties";
    that.difficulties.forEach(function(difficulty){
        var level = document.createElement("li");
        var aTag = document.createElement("a");
        aTag.href = "#";
        aTag.innerHTML = difficulty[0];
        aTag.onclick = function(){
            that.GameWidth = difficulty[1];
            that.startGame();
        };
        level.appendChild(aTag);
        ul.appendChild(level);
    });
    return [ul];
};
Minesweeper.prototype.showEmptyTiles    = function(row, col){                 //Recursive function to show empty tiles
    if(row >= this.GameWidth || row < 0 || col >= this.GameWidth || col < 0 || this.isTurned(row, col) === true || this.hasMine(row,col)) {
        return;
    }
    this.turnImage(row, col);
    this.turnedImages++;
    if(this.hasNeighborMines(row, col) > 0){
        this.setImage(row, col, this.imagePrefix + this.hasNeighborMines(row, col) + ".png");
        return;
    }
    this.setImage(row, col, this.imagePrefix + "empty.png");
    this.showEmptyTiles(row-1, col);
    this.showEmptyTiles(row-1, col+1);
    this.showEmptyTiles(row-1, col-1);
    this.showEmptyTiles(row+1, col);
    this.showEmptyTiles(row+1, col+1);
    this.showEmptyTiles(row+1, col-1);
    this.showEmptyTiles(row, col-1);
    this.showEmptyTiles(row, col+1);

};
Minesweeper.prototype.isMarked          = function(row, col){
    return this.board[row].rowArray[col].marked;
};
Minesweeper.prototype.setMarker         = function(row, col){
    this.board[row].rowArray[col].marked = true;
    if(this.markedImages < this.numberOfMines) {
        this.markedImages++;
        this.setImage(row, col, this.imagePrefix + "marked.png");
    }
};
Minesweeper.prototype.removeMarker      = function(row, col){
    this.board[row].rowArray[col].marked = false;
    if(this.markedImages > 0) {
        this.markedImages--;
        this.setImage(row, col, this.imagePrefix + "standard.png");
    }
};
Minesweeper.prototype.hasMine           = function(row, col){
    return this.board[row].rowArray[col].mine;
};
Minesweeper.prototype.isTurned          = function(row, col){
    return this.board[row].rowArray[col].turned;
};
Minesweeper.prototype.turnImage         = function(row, col){
    if(this.isMarked(row,col)){
        this.removeMarker(row,col);
    }
    this.board[row].rowArray[col].turned = true;
};
Minesweeper.prototype.setImage          = function(row, col, imagePath){
    this.board[row].rowArray[col].image.src = imagePath;
};
Minesweeper.prototype.setMine           = function(row, col){
    this.board[row].rowArray[col].mine = true;
};
Minesweeper.prototype.hasNeighborMines  = function(row, col){
    var count = 0, i, j;
    for(i = row-1; i <= row+1; i++){
        for(j = col-1; j <= col+1; j++){
            if((i < this.GameWidth && i >= 0) && (j < this.GameWidth && j >= 0)){
                if(this.hasMine(i, j)){
                    count++;
                }
            }
        }
    }
    return count;
};

QuizWindow.prototype = new Window();
QuizWindow.prototype.constructor = QuizWindow;
function QuizWindow(self, xPos, yPos) {
    this.WindowConstruct("Quiz", false, self, xPos, yPos);
    this.app = this.app;
    this.nextURL;
    this.moreQuestions = true;
    this.questionsArr;

    this.init();
}
QuizWindow.prototype.getScore       = function(){
    var that = this;

    var game = this.app.querySelector(".workArea");
    game.innerHTML = '';
    var scoreBoard = document.createElement("div");
    scoreBoard.className = "questionList";
    game.appendChild(scoreBoard);

    var score = 0;
    for(var i = 0; i < this.questionsArr.length; i++){
        var container = document.createElement("section");
        container.className = "result";
        if(this.questionsArr[i].response === "Correct answer!" && this.questionsArr[i].tries === 1){
            score++;
            container.classList.add("correct");
        }else if(this.questionsArr[i].response === "Wrong answer! :(" || this.questionsArr[i].tries > 1){
            container.classList.add("incorrect");
        }

        var question = document.createElement("header");
        var span = document.createElement("span");
        span.innerHTML = this.questionsArr[i].question;
        question.appendChild(span);

        var arrow = document.createElement("img");
        arrow.src = "images/quiz/arrow.svg";
        arrow.alt = "Arrow";
        if(container.classList.contains("incorrect")  || this.questionsArr[i].tries > 1) {
            arrow.className = "up";
        }
        question.appendChild(arrow);
        var aTag = document.createElement("a");
        aTag.href = "#";
        aTag.appendChild(question);
        aTag.onclick = function(e){
            e.preventDefault();
            var sibling = this.parentNode.querySelector(".answer");

            sibling.classList.toggle("hidden");
            this.parentNode.querySelector("img").classList.toggle("up");
        };
        container.appendChild(aTag);

        var answer = document.createElement("section");
        answer.classList.add("answer");
        if(!container.classList.contains("incorrect") && this.questionsArr[i].tries == 1) {
            answer.classList.add("hidden");

        }
        answer.innerHTML = "Du svarade: " + this.questionsArr[i].answer;
        if(this.questionsArr[i].tries > 1){
            answer.innerHTML += " efter " + this.questionsArr[i].tries + " försök"
        }
        container.appendChild(answer);

        scoreBoard.appendChild(container);
    }

    var total = document.createElement("div");
    total.innerHTML = "Du fick " + score + " av " + this.questionsArr.length + " rätt!";
    total.className = "totalScore";
    game.appendChild(total);

    var newGame = document.createElement("button");
    newGame.innerHTML = "Ny omgång";
    newGame.className = "btn newGame";
    newGame.onclick = function(){
        that.init();
    };
    game.appendChild(newGame);

};
QuizWindow.prototype.disableInput   = function(){
    var button = this.app.querySelector(".sendAnswer");
    var text = this.app.querySelector(".answerBox");

    text.readOnly = true;
    button.disabled = true;
};
QuizWindow.prototype.enableInput    = function(){
    var button = this.app.querySelector(".sendAnswer");
    var text = this.app.querySelector(".answerBox");

    text.readOnly = false;
    button.disabled = false;
};
QuizWindow.prototype.getQuestion    = function(url){
    var that = this;

    var handleMessage = function(jsonObj){
        var obj = JSON.parse(jsonObj);
        that.nextURL = obj.nextURL;
        var questionField = that.app.querySelector(".questionField");
        questionField.classList.toggle("opacity-0");
        setTimeout(function(){
            questionField.innerHTML = obj.question;

            questionField.classList.toggle("opacity-0");
        }, 250);

        that.addQuestion(obj.question);
        that.enableInput();
        that.setStatus("Waiting on input...");
    };
    that.setStatus("Waiting on question from server");
    new AjaxCon(url, handleMessage, "GET");
};
QuizWindow.prototype.sendAnswer     = function(answerInput){
    var that = this;

    that.addAnswer(answerInput);

    var handleMessage = function(jsonObj){

        var obj = JSON.parse(jsonObj);
        that.addResponse(obj.message);

        if(obj.nextURL != undefined){
            that.getQuestion(obj.nextURL);
        }else if(obj.message === "Wrong answer! :("){
            that.enableInput();
            that.addFailure();
            that.setStatus("Waiting on input...");
        }
        else{
            that.gameOver();
            that.setStatus("No more questions!");
        }
    };
    var url = this.nextURL;

    this.setStatus("Sending answer to server");
    new AjaxCon(url, handleMessage, "POST", JSON.stringify({answer: answerInput}));

};
QuizWindow.prototype.init           = function(){
    this.questionsArr = [];
    this.render();
    this.getQuestion("http://vhost3.lnu.se:20080/question/1");
};
QuizWindow.prototype.gameOver       = function(){
    this.getScore();
};
QuizWindow.prototype.render         = function(){
    var that = this;
    this.app.innerHTML = '';
    this.app.classList.add("thequiz");
    var questionDiv = document.createElement("div");
    questionDiv.className = "workArea";

    var questionField = document.createElement("div");
    questionField.className = "questionField";
    questionDiv.appendChild(questionField);

    var input = document.createElement("input");
    input.type = "text";
    input.className = "answerBox";
    questionDiv.appendChild(input);

    var button = document.createElement("button");
    button.className = "sendAnswer";
    button.innerHTML = "Skicka svar";
    var submitForm = function(e){
        if(input.value != ""){
            that.disableInput();
            that.sendAnswer(input.value);
            input.value = "";
        }
    };
    button.onclick = submitForm;
    input.onkeypress = function(e){
        if(e.keyCode == 13) {
            submitForm();
        }
    };
    questionDiv.appendChild(button);

    this.app.appendChild(questionDiv);
};
QuizWindow.prototype.addAnswer      = function(message){
    this.questionsArr[this.questionsArr.length - 1].answer = message;
};
QuizWindow.prototype.addResponse    = function(message){
    this.questionsArr[this.questionsArr.length - 1].response = message;
};
QuizWindow.prototype.addQuestion    = function(message){

    this.questionsArr.push({
        question: message,
        answer: undefined,
        response: undefined,
        tries: 1
    });
};
QuizWindow.prototype.error          = function(message){
    this.app.innerHTML = "<p>Någonting gick fel!</p><p>Testa att starta om applikationen</p>";
    console.log(message);
};
QuizWindow.prototype.addFailure     = function(){
    this.questionsArr[this.questionsArr.length - 1].tries++;
    var pTag = document.createElement("p");
    pTag.innerHTML = "Fel svar, försök igen!";
    this.app.querySelector(".questionField").appendChild(pTag);
};

QuoteWindow.prototype = new Window();
QuoteWindow.prototype.constructor = QuoteWindow;
function QuoteWindow(self, xPos, yPos) {
    this.WindowConstruct("Quote", false, self, xPos, yPos);

    this.timer;
    this.connection;
    this.refreshRate = 10000;

    this.render();
}
QuoteWindow.prototype.render        = function(){
    var self = this;
    self.app.classList.add("Quote");

    var refresh = function(){
        var handler = function(response){
            self.setStatus("OK");
            var obj = JSON.parse(response);

            self.app.innerHTML = "";

            if (typeof obj.Url !== "undefined") {
                var image = document.createElement("img");
                image.src = obj.Url;

                setTimeout(function () {
                    image.classList.add("active");

                    setTimeout(function () {
                        image.classList.remove("active");
                    }, self.refreshRate - 500);
                }, 250);

                self.app.appendChild(image);
            }

            var quote = document.createElement("blockquote");
            quote.innerHTML = obj.Quote.replace(/\r\n/g, '<br/><br/>');
            self.app.appendChild(quote);
            setTimeout(function(){
                quote.classList.add("active");

                setTimeout(function(){
                    quote.classList.remove("active");
                },self.refreshRate - 500);
            },250);

            var author = document.createElement("cite");
            author.innerHTML = obj.Author;
            quote.appendChild(author);

            getQuote();
        };

        self.setStatus("Loading quote from server...");

        self.connection = new AjaxCon("http://erikhamrin.se/projects/quotes.php", handler, "GET");
    };
    var getQuote = function (){
        self.timer = setTimeout(refresh, self.refreshRate);
    };
    refresh();
};
QuoteWindow.prototype.ClearTimers   = function(){
    console.log("QUOTE: Removing all timers");
    clearTimeout(this.timer);

    console.log("QUOTE: Removing connection");
    this.connection.abort();
};

RSSWindow.prototype = new Window();
RSSWindow.prototype.constructor = RSSWindow;
function RSSWindow(self, xPos, yPos) {
    this.startHeight = 600;
    this.startWidth = 300;
    this.WindowConstruct("RSS", true, self, xPos, yPos);

    this.feedUrl = "http://www.dn.se/m/rss/senaste-nytt";
    this.feed = undefined;
    this.timer = undefined;
    this.connection = undefined;
    this.refreshRate = 600000;
    this.reloadFeed();
    this.render();
}
RSSWindow.prototype.reloadFeed          = function(){
    var self = this;

    var ajaxCall = function(){
        var handler = function(response){
            var date = new Date();
            var minute = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
            self.setStatus("Uppdaterad " + date.getHours() + ":" + minute + ":" + seconds);
            self.feed.innerHTML = response;
        };
        self.setStatus("Laddar RSS-flöde");
        self.connection = new AjaxCon("http://homepage.lnu.se/staff/tstjo/labbyServer/rssproxy/?url=" + encodeURI(self.feedUrl), handler, "GET");

    };

    ajaxCall();
    this.timer = setInterval(ajaxCall, self.refreshRate);
};
RSSWindow.prototype.render              = function(){
    var self = this;
    self.app.className = "RSSWindow";

    self.feed = document.createElement("article");
    self.app.appendChild(self.feed);
};
RSSWindow.prototype.ClearTimers         = function(){
    console.log("RSS: Removing all timers");
    clearInterval(this.timer);
};
RSSWindow.prototype.contextMenu         = function(){
    var that = this;

    var option1 = document.createElement("ul");
    option1.dataset.name = "Settings";

    var level = document.createElement("li");
    var aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/interval.png'> Timer interval";
    aTag.onclick = function(e){
        e.preventDefault();
        that.getIntervalSetting();
    };
    level.appendChild(aTag);
    option1.appendChild(level);

    level = document.createElement("li");
    aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/setting.png'> Select RSS-feed";
    aTag.onclick = function(e){
        e.preventDefault();
        that.getRSSFeed();
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
        that.reloadFeed();
    };
    level.appendChild(aTag);
    option1.appendChild(level);

    return [option1];
};
RSSWindow.prototype.getIntervalSetting  = function(){
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
        self.app.removeChild(popup);
    };
    popup.appendChild(close);

    var input = document.createElement("select");
    var rates = [[10000, "10 sekunder"], [15000, "15 sekunder"], [30000, "30 sekunder"], [60000, "1 minut"], [300000, "5 minuter"], [600000, "10 minuter"], [1800000, "30 minuter"]];
    input.innerHTML = "";
    rates.forEach(function(rate){
        var selected = (rate[0] == self.refreshRate) ? " selected" : "";
        input.innerHTML += "<option value='" + rate[0] + "'" + selected + ">" + rate[1] + "</option>";
    });

    popup.appendChild(input);

    var submit = document.createElement("button");
    submit.innerHTML = "Ändra";
    submit.onclick = function(){
        self.ClearTimers();
        self.refreshRate = input.value;
        self.reloadFeed();
        self.app.removeChild(popup);
    };
    popup.appendChild(submit);

    this.app.appendChild(popup);
};
RSSWindow.prototype.getRSSFeed          = function(){
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
        self.app.removeChild(popup);
    };
    popup.appendChild(close);

    var inputContainer = document.createElement("div");
    inputContainer.classList.add("inputcontainer");

    var input = document.createElement("input");
    input.type = "radio";
    input.name = "rssRadio";
    input.value = "http://www.dn.se/m/rss/senaste-nytt";
    var radioText = document.createTextNode("DN - Senaste nytt");
    inputContainer.appendChild(input);
    inputContainer.appendChild(radioText);
    popup.appendChild(inputContainer);

    inputContainer = document.createElement("div");
    inputContainer.classList.add("inputcontainer");
    input = document.createElement("input");
    input.type = "radio";
    input.name = "rssRadio";
    input.value = "http://www.dn.se/ledare/m/rss";
    radioText = document.createTextNode("DN - Ledare");
    inputContainer.appendChild(input);
    inputContainer.appendChild(radioText);
    popup.appendChild(inputContainer);

    inputContainer = document.createElement("div");
    inputContainer.classList.add("inputcontainer");
    input = document.createElement("input");
    input.type = "radio";
    input.name = "rssRadio";
    input.value = "http://www.dn.se/ekonomi/m/rss/senaste-nytt";
    radioText = document.createTextNode("DN - Ekonomi");
    inputContainer.appendChild(input);
    inputContainer.appendChild(radioText);
    popup.appendChild(inputContainer);

    inputContainer = document.createElement("div");
    inputContainer.classList.add("inputcontainer");
    input = document.createElement("input");
    input.type = "radio";
    input.name = "rssRadio";
    input.value = "other";
    input.checked = true;
    radioText = document.createTextNode("Annat: ");
    inputContainer.appendChild(input);
    inputContainer.appendChild(radioText);
    popup.appendChild(inputContainer);
    input.onfocus = function(){
        textinput.focus();
        textinput.select();
    };


    var textinput = document.createElement("input");
    textinput.type = "text";
    textinput.value = self.feedUrl;
    inputContainer.appendChild(textinput);

    var submit = document.createElement("button");
    submit.innerHTML = "Skicka";
    submit.onclick = function(){
        var value = popup.querySelector('input[name="rssRadio"]:checked').value;
        if(value === "other"){
            self.feedUrl = textinput.value;
            console.log(textinput.value);
        }else{
            self.feedUrl = value;
            console.log(value);
        }
        self.ClearTimers();
        self.reloadFeed();
        self.app.removeChild(popup);
    };
    popup.appendChild(submit);

    this.app.appendChild(popup);
    textinput.focus();
    textinput.select();
};

window.onload = function(){
    new Desktop("desktopApplication");
};