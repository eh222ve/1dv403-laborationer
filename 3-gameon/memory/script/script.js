"use strict";

function MemoryGame(rootId, rows, cols){
    this.getRows = function(){return rows;};
    this.getCols = function(){return cols;};
    this.rootId = document.getElementById(rootId);
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.renderBoard();
    this.flippedImage;
}

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
            img.id = that.rootId+"-"+col['id'];
            a.appendChild(img);
            a.onclick = function(e){
                e.preventDefault();
                tmpImg = this.firstChild;
                tmpImg.className = "flipped";

                setTimeout(function(){
                    tmpImg.src = "pics/" + col['value'] + ".png";
                }, 125);

                if(that.flippedImage === undefined) {
                    that.flippedImage = [];
                    that.flippedImage['elementId'] = tmpImg.id;
                    that.flippedImage['value'] = col['value'];
                }else{
                    if(that.flippedImage['elementId'] != tmpImg.id && that.flippedImage['value'] === col['value']){
                        alert('hooray');
                        that.flippedImage = undefined;
                    }else if(that.flippedImage['elementId'] === tmpImg.id){
                        //Do nothing
                    }
                    else{
                        alert('wrong');
                        that.flippedImage = undefined;
                    }

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

var mem = new MemoryGame("test1", 4, 4);
