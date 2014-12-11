/**
 * Created by Erik.
 */
"use strict";

MemoryGame.prototype = new Window();
MemoryGame.prototype.constructor = MemoryGame;
function MemoryGame(self, xPos, yPos) {
    var rows = 2, cols = 4;

    this.WindowConstruct("Memory", false, self, xPos, yPos);

    this.app.classList.add("GameOn-Memory");
    this.imageLocation = "images/memory/";

    this.getRows = function(){return rows;};
    this.setRows = function(value){rows = value;};

    this.getCols = function(){return cols;};
    this.setCols = function(value){cols = value;};

    this.isActive = false;

    this.flippedImage, this.pictureArray, this.structuredArray, this.flippedCards, this.turnCounter;
    this.resetGame([this.getRows(), this.getCols()]);
}
MemoryGame.prototype.resetGame              = function(settings){
    var RandomGenerator = {

        /*
         Denna metod tar antalet rader och columner som inparameter.

         Metoden returnerar en array inneh�llandes utslumpade tal mellan 1 och (rows*cols)/2. Varje tal representeras tv�
         g�nger och motsvarar s�ledes en spelbricka.

         I en 4*4 matris kan Arrayen t.ex. se ut s� h�r:
         [1,2,6,8,6,2,5,3,1,3,7,5,8,4,4,7]

         I en 2*4 matris kan Arrayen t.ex. se ut s� h�r:
         [3,4,4,1,2,1,2,3]
         */

        getPictureArray: function(rows, cols)
        {
            var numberOfImages = rows*cols;
            var maxImageNumber = numberOfImages/2;

            var imgPlace = [];

            //Utplacering av bilder i Array
            for(var i=0; i<numberOfImages; i++)
                imgPlace[i] = 0;

            for(var currentImageNumber=1; currentImageNumber<=maxImageNumber; currentImageNumber++)
            {
                var imageOneOK = false;
                var imageTwoOK = false;

                do
                {
                    if(imageOneOK == false)
                    {
                        var randomOne = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                        if( imgPlace[randomOne] == 0 )
                        {
                            imgPlace[randomOne] = currentImageNumber;
                            imageOneOK = true;
                        }
                    }

                    if(imageTwoOK == false)
                    {
                        var randomTwo = Math.floor( (Math.random() * (rows*cols-0) + 0) );

                        if( imgPlace[randomTwo] == 0 )
                        {
                            imgPlace[randomTwo] = currentImageNumber;
                            imageTwoOK = true;
                        }
                    }
                }
                while(imageOneOK == false || imageTwoOK == false);
            }

            return imgPlace;
        }
    };
    if(settings[0] !== undefined){
        this.setRows(settings[0]);
    }
    if(settings[1] !== undefined){
        this.setCols(settings[1]);
    }
    this.app.innerHTML = '';
    this.pictureArray = RandomGenerator.getPictureArray(this.getRows(), this.getCols());
    this.structuredArray = this.getStructuredArray();
    this.flippedImage = undefined;
    this.flippedCards = [];
    this.turnCounter = 0;
    this.renderBoard();
};
MemoryGame.prototype.renderBoard            = function(){
    var div, a, img;
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
        that.app.appendChild(div);
    });
};
MemoryGame.prototype.getStructuredArray     = function(){
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
MemoryGame.prototype.getSettings            = function(header, body) {
    var div = document.createElement("div");
    div.className = "overlay";

    var h = document.createElement("h1");
    h.innerHTML = header;
    div.appendChild(h);

    var p = document.createElement("p");
    p.innerHTML = body;
    div.appendChild(p);

    var button = document.createElement("button");
    button.innerHTML = "Starta spel";
    var that = this;
    button.onclick = function(){
        that.resetGame([that.getRows(), that.getCols()]);
    };
    div.appendChild(button);

    this.app.appendChild(div);
};
MemoryGame.prototype.flipCards              = function(aTag, col){
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
MemoryGame.prototype.contextMenu            = function(){
    var that = this;

    var option1 = document.createElement("ul");
    option1.dataset.name = "Options";

    var level = document.createElement("li");
    var aTag = document.createElement("a");
    aTag.href = "#";
    aTag.innerHTML = "<img src='images/refresh.png'> Reset";
    aTag.onclick = function(e){
        e.preventDefault();
        that.resetGame([that.getRows(), that.getCols()]);
    };
    level.appendChild(aTag);
    option1.appendChild(level);


    var option2 = document.createElement("ul");
    var difficulties = [[1,4],[2,4],[3,4],[4,4]];

    option2.dataset.name = "Difficulties";
    difficulties.forEach(function(difficulty){
        level = document.createElement("li");
        aTag = document.createElement("a");
        aTag.href = "#";
        aTag.innerHTML = "<img src='images/tiles.png'> " + difficulty[0] + "x" + difficulty[1];
        aTag.onclick = function(e){
            e.preventDefault();
            that.resetGame(difficulty);
        };
        level.appendChild(aTag);
        option2.appendChild(level);
    });
    return [option1, option2];
};
