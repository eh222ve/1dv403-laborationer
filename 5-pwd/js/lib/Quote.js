/**
 * Created by Erik.
 */
"use strict";
var PWD = PWD ||{};

PWD.QuoteWindow = function(self, xPos, yPos) {
    this.WindowConstruct("Quote", false, self, xPos, yPos);

    this.timer;
    this.connection;
    this.refreshRate = 10000;

    this.render();
};

PWD.QuoteWindow.prototype = new PWD.Window();
PWD.QuoteWindow.prototype.constructor = PWD.QuoteWindow;

PWD.QuoteWindow.prototype.render        = function(){
    var self = this;
    self.app.classList.add("Quote");
    var timer;

    var refresh = function(){
        var handler = function(response){
            clearTimeout(timer);
            self.setStatus("");
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
        timer = setTimeout(function(){self.setStatus("Laddar... <img src='images/loader_white.gif'/>");}, 300);
        self.connection = new PWD.AjaxCon("http://erikhamrin.se/projects/quotes.php", handler, "GET");
    };
    var getQuote = function (){
        self.timer = setTimeout(refresh, self.refreshRate);
    };
    refresh();
};
PWD.QuoteWindow.prototype.ClearTimers   = function(){
    console.log("QUOTE: Removing all timers");
    clearTimeout(this.timer);

    console.log("QUOTE: Removing connection");
    this.connection.abort();
};