/**
 * Created by Erik.
 */
"use strict";

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
    this.startHeight = 600;
    this.startWidth = 400;
    this.WindowConstruct("Gallery", true, desktop, xPos, yPos);

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
        imageContainer.onmouseover = function(){
            self.setStatus("Bildstorlek: " + currentImage.width + "px X " + currentImage.height + "px");
        };
        imageContainer.onmouseleave = function(){
            self.setStatus("");
        };

        var image = document.createElement("img");
        image.src = currentImage.thumbURL;
        image.style.marginTop = ((self.thumbHeight-currentImage.thumbHeight)/2) + "px";

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