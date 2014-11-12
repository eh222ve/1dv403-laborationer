"use strict";

function MemoryGame(rootId, rows, cols){
    this.getRows = function(){return rows;};
    this.getCols = function(){return cols;};
    this.rootIdText = rootId;
    this.flippedImage = undefined;
    this.isActive = false;
    this.rootId = document.getElementById(rootId);
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.flippedCards = [];
    this.turnCounter = 0;


    this.initGame();

}
MemoryGame.prototype.initGame = function(){
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
            img.src = "pics/0.png";
            img.id = that.rootIdText+"-"+col['id'];
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
MemoryGame.prototype.finishedGame = function() {
    var div = document.createElement("div");
    div.className = "overlay";
    var h = document.createElement("h1");
    h.innerHTML = "Grattis!";
    var p = document.createElement("p");
    p.innerHTML = "Du klarade av spelet på " + this.turnCounter + " omgångar, vill du spela igen?";
    var button = document.createElement("button");
    button.innerHTML = "starta spel";
    var that = this;
    button.onclick = function(){
        that.initGame();
    };
    div.appendChild(h);
    div.appendChild(p);
    div.appendChild(button);
    this.rootId.appendChild(div);
};
MemoryGame.prototype.flipCards = function(that, col){
    var img;

    img = that.firstChild;

    that = this;
    that.isActive = true;

    img.className = "flipped";

    setTimeout(function () {
        img.src = "pics/" + col['value'] + ".png";

        if (that.flippedImage === undefined) {
            that.flippedImage = [];
            that.flippedImage['elementId'] = img.id;
            that.flippedImage['value'] = col['value'];
            that.isActive = false;
        } else {
            that.isActive = true;
            that.turnCounter++;
            if (that.flippedImage['elementId'] != img.id && that.flippedImage['value'] === col['value']) {

                that.flippedCards.push(col['value']);
                if(that.flippedCards.length >= (that.pictureArray.length/2)){
                    that.finishedGame();
                }
                that.flippedImage = undefined;
                that.isActive = false;
            } else if (that.flippedImage['elementId'] === img.id) {
                that.isActive = false;
            }
            else {
                setTimeout(function () {
                    var images = [img, document.getElementById(that.flippedImage['elementId'])];
                    images.forEach(function(im){
                        im.className  = "";
                        setTimeout(function () {
                            im.src = "pics/0.png";
                        }, 125);
                    });

                    that.flippedImage = undefined;
                    that.isActive = false;
                }, 500);
            }

        }
    }, 125);

};

var mem = new MemoryGame("test1", 3, 4);
