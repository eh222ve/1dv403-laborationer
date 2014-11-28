"use strict";
function Application(self, type, xPos, yPos, resize){
    this.resizable = resize;
    this.desktop = self;
    this.type = type;
    this.imageFolder = "js/application/images/";
    this.xPos = xPos;
    this.yPos = yPos;
    this.dragY = 0;
    this.dragX = 0;
    this.app;
    this.createHTML();
    this.resize = false;
    this.dragging = false;
}
Application.prototype.focusWindow = function(e){
  var allApps = document.querySelectorAll(".application");
    for(var i = 0; i < allApps.length; i++){
        allApps[i].style.zIndex = "1";
    }
    this.style.zIndex = "5";
};
Application.prototype.createHTML = function(){
    var self = this;
    var divApp = document.createElement("div");
        divApp.classList.add("application");
        divApp.style.left = this.xPos + "px";
        divApp.style.top = this.yPos + "px";
        divApp.onmousedown = this.focusWindow;

    var header = document.createElement("header");
        header.classList.add("appHeader");
        header.onmousedown = function(e){
            self.dragY = (e.pageY - divApp.offsetTop);
            self.dragX = (e.pageX - divApp.offsetLeft);
            header.style.cursor = "move";
            self.dragging = true;
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
                if(typeof self.app.ClearTimers == "function"){
                    self.app.ClearTimers();
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
                }else{
                    self.xPos = divApp.offsetLeft;
                    self.yPos = divApp.offsetTop;
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

    var application = document.createElement("div");
    //TODO Break out into separate objects
    switch(this.type){
        case "Memory":
            this.app = new MemoryGame(application, 4, 4);
            break;
        case "Chat":
            this.app = new MessageBoard(application, "Chatt");
            break;
        case "Minesweeper":
            this.app = new Minesweeper(application);
            break;
        case "Quiz":
            this.app = new Questioner(application);
            break;
    }

    main.appendChild(application);
    divApp.appendChild(main);
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
            divApp.style.minWidth = (startWidth + e.clientX - startX) + 'px';
            divApp.style.minHeight = (startHeight + e.clientY - startY) + 'px';
        };
        var stopDrag = function(e) {
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
