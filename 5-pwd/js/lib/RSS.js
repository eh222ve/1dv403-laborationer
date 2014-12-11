/**
 * Created by Erik.
 */
"use strict";

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
        }else{
            self.feedUrl = value;
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
