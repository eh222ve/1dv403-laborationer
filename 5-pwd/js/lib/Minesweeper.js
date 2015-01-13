/**
 * Created by Erik.
 */
"use strict";

PWD.Minesweeper = function(self, xPos, yPos) {
    this.difficulties = [["Beginner", 9], ["Intermidiate", 15], ["Expert", 20]];

    this.WindowConstruct("Minesweeper", false, self, xPos, yPos);

    this.app.classList.add("GameOn-Minesweeper");
    this.imagePrefix = "images/minesweeper/";
    this.GameWidth = 9;
    this.PictureWidth = 20;

    this.gameOver, this.board = [], this.numberOfMines, this.mines, this.turnedImages, this.markedImages, this.timer, this.clock, this.bombsCounter;
    this.startGame();
};

PWD.Minesweeper.prototype = new PWD.Window();
PWD.Minesweeper.prototype.constructor = PWD.Minesweeper;

PWD.Minesweeper.prototype.ClearTimers       = function(){
    clearInterval(this.timer);
};
PWD.Minesweeper.prototype.startGame         = function(){
    this.setDefaultValues();
    this.drawGame();
    this.calculateMines();
};
PWD.Minesweeper.prototype.resetGame         = function(){
    this.resetAllTiles();
    this.setDefaultValues();
    this.bombsCounter.innerHTML = this.numberOfMines;
    this.calculateMines();
    this.startTimer();
};
PWD.Minesweeper.prototype.setDefaultValues  = function(){
    this.gameOver = false;
    this.numberOfMines = Math.floor(this.GameWidth*this.GameWidth *0.25);
    this.mines = [];
    this.turnedImages = 0;
    this.markedImages = 0;
};
PWD.Minesweeper.prototype.drawGame          = function(){
    var that = this;
    var i;
    that.app.innerHTML = '';

    function clicked(e){
        e.preventDefault();
        if(that.gameOver === false) {
            var col = Math.floor((e.pageX -this.getBoundingClientRect().left) / that.PictureWidth);
            var row = Math.floor((e.pageY -this.getBoundingClientRect().top) / that.PictureWidth);
            if (that.isTurned(row, col) === false) {
                if (e.which === 3) {                                //Right-click
                    if(that.isMarked(row, col) === false) {             //Set marker
                        that.setMarker(row, col);
                    }else if(that.isMarked(row, col) === true) {        //Remove marker
                        that.removeMarker(row, col);
                    }
                } else {                                            //Left-click
                    if (that.hasMine(row, col)) {                       //MINE! Game over :(
                        that.mines.forEach(function (mine) {
                            that.setImage(mine[0], mine[1], that.imagePrefix + "bomb.png");
                        });
                        that.setImage(row, col, that.imagePrefix + "bombred.png");
                        clearTimeout(that.timer);
                        that.gameOver = true;
                    }else {                                             //Show tiles
                        that.showEmptyTiles(row, col);
                    }
                }
                that.bombsCounter.innerHTML = that.numberOfMines - that.markedImages;   //Update marker counter
                if (that.markedImages + that.turnedImages >= that.GameWidth * that.GameWidth && that.markedImages === that.numberOfMines) { //Are we there yet?
                    alert('Congratz! You won!');
                    clearTimeout(that.timer);
                    that.gameOver = true;

                }
            }
        }
    }

    var gameArea = document.createElement("div");                           //Game area
    this.app.style.width = this.GameWidth * this.PictureWidth + "px";
    gameArea.style.width = this.GameWidth * this.PictureWidth + "px";           //Set size according to #tiles and size of tiles
    gameArea.onclick = clicked;                                                 //Left-click
    gameArea.addEventListener('contextmenu', clicked);                              //Right-click

    var header = document.createElement("header");                          //Header

    var newButton = document.createElement("button");                           //New game button
    newButton.innerHTML = "New Game";
    newButton.onclick = function(){
        that.resetGame();
    };

    this.bombsCounter = document.createElement("div");                              //Remaining bomb counter
    this.bombsCounter.className = "bombsLeft";
    this.bombsCounter.innerHTML = this.numberOfMines;

    this.clock = document.createElement("div");                                  //Timer
    this.clock.className = "timer";

    this.startTimer();

    header.appendChild(this.bombsCounter);
    header.appendChild(newButton);
    header.appendChild(this.clock);
    this.app.appendChild(header);
    this.app.appendChild(gameArea);

    this.board = [];

    for(i = 0; i < this.GameWidth; i++){                                        //Render HTML and create array
        var row = document.createElement("div");                                // with elements
        row.className = "row";

        var imageArray = [];

        for(var j = 0; j < this.GameWidth; j++){
            var img = document.createElement("img");
            img.src = this.imagePrefix + "standard.png";
            row.appendChild(img);
            imageArray.push({
                image: img,
                mine: false,
                turned: false,
                marked: false
            });
        }

        this.board.push({
            rowDiv: row,
            rowArray: imageArray
        });
        gameArea.appendChild(row);
    }

};
PWD.Minesweeper.prototype.resetAllTiles     = function(){
    var that = this,i,j;

    for(i = 0; i < this.GameWidth; i++) {
        for (var j = 0; j < this.GameWidth; j++) {
            var tile = this.board[i].rowArray[j];
            tile.mine = false;
            tile.turned = false;
            tile.marked = false;

            if(tile.image.src.split('/').indexOf('standard.png') < 0){
                tile.image.src = that.imagePrefix + "standard.png";
            }
        }
    }
};
PWD.Minesweeper.prototype.calculateMines    = function(){                              //Calculate position of mines
    for(var i = 0; i < this.numberOfMines; i++){
        var mineRow = Math.floor((Math.random() * this.GameWidth));
        var mineCol = Math.floor((Math.random() * this.GameWidth));

        if(this.hasMine(mineRow, mineCol) === false){
            this.setMine(mineRow, mineCol);
            this.mines.push([mineRow, mineCol]);
        }else{
            i--;
        }
    }
};
PWD.Minesweeper.prototype.startTimer        = function(){
    clearTimeout(this.timer);
    var that = this;
    this.clock.innerHTML = 0;
    var time = 1;
    this.timer = setInterval(function(){                                       //Interval
        that.clock.innerHTML = time;
        time++;
    }, 1000);
};
PWD.Minesweeper.prototype.contextMenu       = function(){
    var that = this;
    var ul = document.createElement("ul");
    ul.dataset.name = "Difficulties";
    that.difficulties.forEach(function(difficulty){
        var level = document.createElement("li");
        var aTag = document.createElement("a");
        aTag.href = "#";
        aTag.innerHTML = difficulty[0];
        aTag.onclick = function(){
            that.GameWidth = difficulty[1];
            that.startGame();
        };
        level.appendChild(aTag);
        ul.appendChild(level);
    });
    return [ul];
};
PWD.Minesweeper.prototype.showEmptyTiles    = function(row, col){                 //Recursive function to show empty tiles
    if(row >= this.GameWidth || row < 0 || col >= this.GameWidth || col < 0 || this.isTurned(row, col) === true || this.hasMine(row,col)) {
        return;
    }
    this.turnImage(row, col);
    this.turnedImages++;
    if(this.hasNeighborMines(row, col) > 0){
        this.setImage(row, col, this.imagePrefix + this.hasNeighborMines(row, col) + ".png");
        return;
    }
    this.setImage(row, col, this.imagePrefix + "empty.png");
    this.showEmptyTiles(row-1, col);
    this.showEmptyTiles(row-1, col+1);
    this.showEmptyTiles(row-1, col-1);
    this.showEmptyTiles(row+1, col);
    this.showEmptyTiles(row+1, col+1);
    this.showEmptyTiles(row+1, col-1);
    this.showEmptyTiles(row, col-1);
    this.showEmptyTiles(row, col+1);

};
PWD.Minesweeper.prototype.isMarked          = function(row, col){
    return this.board[row].rowArray[col].marked;
};
PWD.Minesweeper.prototype.setMarker         = function(row, col){
    this.board[row].rowArray[col].marked = true;
    if(this.markedImages < this.numberOfMines) {
        this.markedImages++;
        this.setImage(row, col, this.imagePrefix + "marked.png");
    }
};
PWD.Minesweeper.prototype.removeMarker      = function(row, col){
    this.board[row].rowArray[col].marked = false;
    if(this.markedImages > 0) {
        this.markedImages--;
        this.setImage(row, col, this.imagePrefix + "standard.png");
    }
};
PWD.Minesweeper.prototype.hasMine           = function(row, col){
    return this.board[row].rowArray[col].mine;
};
PWD.Minesweeper.prototype.isTurned          = function(row, col){
    return this.board[row].rowArray[col].turned;
};
PWD.Minesweeper.prototype.turnImage         = function(row, col){
    if(this.isMarked(row,col)){
        this.removeMarker(row,col);
    }
    this.board[row].rowArray[col].turned = true;
};
PWD.Minesweeper.prototype.setImage          = function(row, col, imagePath){
    this.board[row].rowArray[col].image.src = imagePath;
};
PWD.Minesweeper.prototype.setMine           = function(row, col){
    this.board[row].rowArray[col].mine = true;
};
PWD.Minesweeper.prototype.hasNeighborMines  = function(row, col){
    var count = 0, i, j;
    for(i = row-1; i <= row+1; i++){
        for(j = col-1; j <= col+1; j++){
            if((i < this.GameWidth && i >= 0) && (j < this.GameWidth && j >= 0)){
                if(this.hasMine(i, j)){
                    count++;
                }
            }
        }
    }
    return count;
};