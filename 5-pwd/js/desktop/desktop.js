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


    var memory = document.createElement("img");
    memory.classList.add("appLauncher");
    memory.src = "js/application/images/appIcons/Memory_Large.png";
    memory.onclick = function(){
        self.windows.push(new MemoryGame(self, getPositionX(), getPositionY()));
    };
    this.element.appendChild(memory);

    var minesweeper = document.createElement("img");
    minesweeper.classList.add("appLauncher");
    minesweeper.src = "js/application/images/appIcons/Minesweeper_Large.png";
    minesweeper.onclick = function () {
        self.windows.push(new Minesweeper(self, getPositionX(), getPositionY()));
    };
    this.element.appendChild(minesweeper);

    var quiz = document.createElement("img");
    quiz.classList.add("appLauncher");
    quiz.src = "js/application/images/appIcons/Quiz_Large.png";
    quiz.onclick = function () {
        self.windows.push(new QuizWindow(self, getPositionX(), getPositionY()));
    };
    this.element.appendChild(quiz);

    var quote = document.createElement("img");
    quote.classList.add("appLauncher");
    quote.src = "js/application/images/appIcons/Quote_Large.png";
    quote.onclick = function () {
        self.windows.push(new QuoteWindow(self, getPositionX(), getPositionY(), true));
    };
    this.element.appendChild(quote);

    var chat = document.createElement("img");
    chat.classList.add("appLauncher");
    chat.src = "js/application/images/appIcons/Chat_Large.png";
    chat.onclick = function(){
        self.windows.push(new MessageBoard(self, getPositionX(), getPositionY()));
    };
    this.element.appendChild(chat);

    var rss = document.createElement("img");
    rss.classList.add("appLauncher");
    rss.src = "js/application/images/appIcons/RSS_Large.png";
    rss.onclick = function () {
        self.windows.push(new RSSWindow(self, getPositionX(), getPositionY()));
    };
    this.element.appendChild(rss);

    var gallery = document.createElement("img");
    gallery.classList.add("appLauncher");
    gallery.src = "js/application/images/appIcons/Gallery_Large.png";
    gallery.onclick = function () {
        self.windows.push(new GalleryWindow(self, getPositionX(), getPositionY()));
    };
    this.element.appendChild(gallery);

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

