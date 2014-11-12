"use strict";

function MemoryGame(rootId, rows, cols){
    this.getRows = function(){return rows;};
    this.setRows = function(value){rows = value;};
    this.getCols = function(){return cols;};
    this.rootIdText = rootId;
    this.flippedImage = undefined;
    this.isActive = false;
    this.rootId = document.getElementById(rootId);
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.flippedCards = [];
    this.turnCounter = 0;

    this.renderBoard();
}
MemoryGame.prototype.initGame = function(rows){
    if(rows !== undefined){
        this.setRows(rows);
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
            img.src = "pics/0.png";
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
    div.appendChild(h);

    var p = document.createElement("p");
    p.innerHTML = "Du klarade av spelet på " + this.turnCounter + " omgångar, vill du spela igen?";
    div.appendChild(p);

    var select = document.createElement("select");
    var options = "";
    //option.innerHTML = 'test';
    //select.appendChild(option);
    for(var i = 0; i < 4; i++) {
        var s = (this.getRows() == (i+1)) ? " selected " : "" ;
        var option = "<option value=\"" + (i+1) + "\"" + s + ">4x" + (i+1) + "</option>";
        options += option;
    }
    select.innerHTML = options;
    div.appendChild(select);

    var button = document.createElement("button");
    button.innerHTML = "Starta spel";
    var that = this;
    button.onclick = function(){
        that.initGame(select.value);
    };
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
            that.flippedImage['element'] = img;
            that.flippedImage['value'] = col['value'];
            that.isActive = false;
        } else {
            that.isActive = true;
            if (that.flippedImage['element'] != img && that.flippedImage['value'] === col['value']) {
                that.turnCounter++;
                that.flippedCards.push(col['value']);
                if(that.flippedCards.length >= (that.pictureArray.length/2)){
                    that.finishedGame();
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

var mem2 = new MemoryGame("test1", 1, 4);

var mem = new MemoryGame("test2", 3, 4);


