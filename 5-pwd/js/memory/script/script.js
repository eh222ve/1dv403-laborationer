"use strict";

function MemoryGame(rootId, rows, cols){
    this.rootId = document.getElementById(rootId);
    this.rootId.classList.add("GameOn-Memory");
    this.imageLocation = "js/memory/images/";
    this.getRows = function(){return rows;};
    this.setRows = function(value){rows = value;};
    this.getCols = function(){return cols;};
    this.setCols = function(value){cols = value;};
    this.isActive = false;

    this.flippedImage, this.pictureArray, this.structuredArray, this.flippedCards, this.turnCounter;

    this.getSettings("Memory", "Välj layout och klicka på Starta spel");
}
MemoryGame.prototype.resetGame = function(settings){
    settings = settings.split(",");
    if(settings[0] !== undefined){
        this.setRows(settings[0]);
    }
    if(settings[1] !== undefined){
        this.setCols(settings[1]);
    }
    this.rootId.innerHTML = '';
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.flippedImage = undefined;
    this.flippedCards = [];
    this.turnCounter = 0;
    this.renderBoard();
};

MemoryGame.prototype.renderBoard = function(){
    var div, a, img, tmpImg;
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
        that.rootId.appendChild(div);
    });
};

MemoryGame.prototype.getStructuredArray = function(){
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

MemoryGame.prototype.getSettings = function(header, body) {
    var div = document.createElement("div");
    div.className = "overlay";

    var h = document.createElement("h1");
    h.innerHTML = header;
    div.appendChild(h);

    var p = document.createElement("p");
    p.innerHTML = body;
    div.appendChild(p);

    var select = document.createElement("select");
    var options = "";

    for(var i = 1; i <= 4; i++) {
        for(var j = 1; j <= 4; j++) {
            if((i*j)%2 ==0) {
                var s = ((this.getRows() == i) && this.getCols() == j) ? " selected " : "";
                options += "<option value=\"" + i + "," + j + "\"" + s + ">" + i + "x" + j + "</option>";
            }
        }
    }
    select.innerHTML = options;
    div.appendChild(select);

    var button = document.createElement("button");
    button.innerHTML = "Starta spel";
    var that = this;
    button.onclick = function(){
        that.resetGame(select.value);
    };
    div.appendChild(button);

    this.rootId.appendChild(div);
};

MemoryGame.prototype.flipCards = function(aTag, col){
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



//var mem = new MemoryGame("test2", 1, 4);


