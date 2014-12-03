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
        [MemoryGame, "js/application/images/appIcons/Memory_Large.png"],
        [Minesweeper, "js/application/images/appIcons/Minesweeper_Large.png"],
        [QuizWindow, "js/application/images/appIcons/Quiz_Large.png"],
        [QuoteWindow, "js/application/images/appIcons/Quote_Large.png"],
        [MessageBoard, "js/application/images/appIcons/Chat_Large.png"],
        [RSSWindow, "js/application/images/appIcons/RSS_Large.png"],
        [GalleryWindow, "js/application/images/appIcons/Gallery_Large.png"]
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

