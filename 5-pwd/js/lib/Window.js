"use strict";
var PWD = PWD || {};
PWD.Window = function(){
    this.dragY = 0;
    this.dragX = 0;
    this.dragging = false;
    this.imageFolder = "images/";
};
PWD.Window.prototype.focusWindow        = function(){
    var allApps = document.querySelectorAll(".application");
    for(var i = 0; i < allApps.length; i++){
        allApps[i].style.zIndex = "1";
    }
    this.style.zIndex = "5";
};
PWD.Window.prototype.createHTML         = function(){
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
        if(!divApp.classList.contains("fullscreen") && e.target != closeWindow && e.target != fullsize && e.target != minimizewindow){
            self.dragY = (e.pageY - divApp.offsetTop);
            self.dragX = (e.pageX - divApp.offsetLeft);
            header.style.cursor = "move";
            self.dragging = true;
            divApp.classList.add("dragging");
            self.DisableSelection(self.desktop.element);
            header.addEventListener("mouseleave", disableDragging);
            header.addEventListener("mousemove", function(e){
                if (self.dragging) {
                    divApp.style.top = (e.clientY - self.dragY)  + "px";
                    divApp.style.left = (e.clientX - self.dragX) + "px";
                }
            });
        }
    };
    var disableDragging = function(e){
        if((e.clientY - self.dragY + 200) > window.innerHeight) {
            divApp.style.top = (window.innerHeight - 200) + "px";
        }else if(e.clientY - self.dragY < 0){
            divApp.style.top = "20px";
        }

        if((e.clientX - self.dragX + 200) > window.innerWidth) {
            divApp.style.left = (window.innerWidth - 200) + "px";
        }else if(e.clientX - self.dragX < 0){
            divApp.style.left = "20px";
        }

        self.dragging = false;
        divApp.classList.remove("dragging");
        header.style.removeProperty("cursor");
        self.EnableSelection(self.desktop.element);
    };
    header.onmouseup = disableDragging;



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
    fullsize.onclick = function(e){
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

            var Options = document.createElement("ul");
            Options.classList.add("contextMenu");
            var menuOptions = document.createElement("a");
            menuOptions.href = "#";
            menuOptions.innerHTML = contextMenu.dataset.name;

            var hideFunction = function(){
                contextMenu.classList.add("hide");
                document.documentElement.removeEventListener('mouseup', hideFunction, false);
            };

            menuOptions.onclick = function(e){
                e.preventDefault();
                contextMenu.classList.remove("hide");
                document.documentElement.addEventListener('mouseup', hideFunction, false);
            };
            contextMenu.onclick = hideFunction;

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
PWD.Window.prototype.setStatus          = function(message){
    this.statusBar.innerHTML = message;
};
PWD.Window.prototype.WindowConstruct    = function(type, resizable, self, xPos, yPos){
    this.resizable = resizable;
    this.desktop = self;
    this.xPos = xPos;
    this.yPos = yPos;
    this.type = type;
    this.createHTML();
};
PWD.Window.prototype.DisableSelection   = function(element){
    element.onselectstart = function() {return false;};
    element.unselectable = "on";
    element.style.MozUserSelect = "none";
    element.style.cursor = "default";
};
PWD.Window.prototype.EnableSelection    = function(element){
    element.onselectstart = function() {return true;};
    element.unselectable = "off";
    element.style.MozUserSelect = "text";
    element.style.cursor = "auto";
};