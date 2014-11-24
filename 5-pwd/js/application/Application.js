function Application(type, xPos, yPos){
    this.type = type;
    this.imageFolder = "js/application/images/";
    this.xPos = xPos;
    this.yPos = yPos;
    this.dragY = 0;
    this.dragX = 0;
    this.createHTML();
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
            self.dragging = true;
        };
        header.onmouseup = function() {
            self.dragging = false;
        };
        header.addEventListener("mouseleave", function() {
            self.dragging = false;
        });
        header.addEventListener("mousemove", function(e){
            if (self.dragging) {
                divApp.style.top = (e.clientY - self.dragY)  + "px";
                divApp.style.left = (e.clientX - self.dragX)  + "px";
            }
        });

        var appIcon = document.createElement("img");
            appIcon.src = this.imageFolder + "appIcons/" + this.type + ".png";
            appIcon.alt = "Icon";
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
            header.appendChild(minimizewindow);

    divApp.appendChild(header);


    var main = document.createElement("main");

    var application = document.createElement("div");

    switch(this.type){
        case "Memory":
            new MemoryGame(application, 4, 4);
            break;
        case "Chat":
            new MessageBoard(application, "Chatt");
            break;
        case "Minesweeper":
            new Minesweeper(application);
            break;
        case "Quiz":
            new Questioner(application);
            break;
    }

    main.appendChild(application);
    divApp.appendChild(main);

    document.querySelector("#desktopApplication").appendChild(divApp);

};
