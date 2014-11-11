"use strict";

function MemoryGame(rootId, rows, cols){
    this.getRows = function(){return rows;};
    this.getCols = function(){return cols;};
    this.rootId = document.getElementById(rootId);
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.renderBoard();
    console.log(this.structuredArray);
}

MemoryGame.prototype.renderBoard = function(){
    var div, a, img;

    var that = this;
    this.structuredArray.forEach(function(row){
        div = document.createElement("div");
        div.className = "row";

        row.forEach(function(col){
            console.log(col);
            a = document.createElement("a");
            a.href = "#";
            img = document.createElement("img");
            img.src = "pics/0.png";
            a.appendChild(img);
            a.onclick = function(e){
                e.preventDefault();
                this.firstChild.src = "pics/" + col + ".png";
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
            output[rows][cols] = this.pictureArray[(this.getCols() * rows) + cols];
        }
    }
    return output;
};

var mem = new MemoryGame("test1", 4, 4);
