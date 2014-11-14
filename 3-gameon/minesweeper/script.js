"use strict";

function Minesweeper(id){
    this.rootId = document.getElementById(id);
    this.GameWidth = 15;
    this.PictureWidth = 25;
    this.board, this.numberOfMines, this.mines, this.turnedImages, this.markedImages, this.gameOver, this.timerClock;

    this.initGame();
}
Minesweeper.prototype.initGame = function(){
    this.rootId.innerHTML = '';
    this.gameOver = false;
    this.board = [];
    this.numberOfMines = Math.floor(this.GameWidth*this.GameWidth *0.25);
    this.mines = [];
    this.turnedImages = 0;
    this.markedImages = 0;
    this.drawGame();
    this.calculateMines();
};

Minesweeper.prototype.drawGame = function(){
    var that = this;
    var i;

    function clicked(e){
        e.preventDefault();
        if(that.gameOver === false) {
            var col = Math.floor((e.pageX - this.offsetLeft) / that.PictureWidth);
            var row = Math.floor((e.pageY - this.offsetTop) / that.PictureWidth);
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
                            that.setImage(mine[0], mine[1], "images/bomb.png");
                        });
                        that.setImage(row, col, "images/bombred.png");
                        clearTimeout(that.timerClock);
                        that.gameOver = true;
                    }else {                                             //Show tiles
                        that.showEmptyTiles(row, col);
                    }
                }
                bombsLeft.innerHTML = that.numberOfMines - that.markedImages;   //Update marker counter
                if (that.markedImages + that.turnedImages >= that.GameWidth * that.GameWidth && that.markedImages === that.numberOfMines) { //Are we there yet?
                    alert('Congratz! You won!');
                    clearTimeout(that.timerClock);
                    that.gameOver = true;

                }
            }
        }
    }

    var gameArea = document.createElement("div");                           //Game area
    this.rootId.style.width = this.GameWidth * this.PictureWidth + "px";
    gameArea.style.width = this.GameWidth * this.PictureWidth + "px";           //Set size according to #tiles and size of tiles
    gameArea.onclick = clicked;                                                 //Left-click
gameArea.addEventListener('contextmenu', clicked);                              //Right-click

    var header = document.createElement("header");                          //Header

    var newButton = document.createElement("button");                           //New game button
    newButton.innerHTML = "New Game";
    newButton.onclick = function(){
        that.initGame();
    };

    var bombsLeft = document.createElement("div");                              //Remaining bomb counter
    bombsLeft.className = "bombsLeft";
    bombsLeft.innerHTML = this.numberOfMines;

    var clock = document.createElement("div");                                  //Timer
    clock.className = "timer";
    clock.innerHTML = 0;
    var time = 1;
    this.timerClock = setInterval(function(){                                       //Interval
        clock.innerHTML = time;
        time++;
    }, 1000);

    header.appendChild(bombsLeft);
    header.appendChild(newButton);
    header.appendChild(clock);
    this.rootId.appendChild(header);
    this.rootId.appendChild(gameArea);

    for(i = 0; i < this.GameWidth; i++){                                        //Render HTML and create array
        var row = document.createElement("div");                                // with elements
        row.className = "row";

        var imageArray = [];

        for(var j = 0; j < this.GameWidth; j++){
            var img = document.createElement("img");
            img.src = "images/standard.png";
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

Minesweeper.prototype.calculateMines = function(){                              //Calculate position of mines
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

Minesweeper.prototype.showEmptyTiles = function(row, col) {                 //Recursive function to show empty tiles

    if(row >= this.GameWidth || row < 0 || col >= this.GameWidth || col < 0 || this.isTurned(row, col) === true || this.hasMine(row,col)) {
        return;
    }
    this.turnImage(row, col);
    this.turnedImages++;
    if(this.hasNeighborMines(row, col) > 0){
        this.setImage(row, col, "images/" + this.hasNeighborMines(row, col) + ".png");
        return;
    }
    this.setImage(row, col, "images/empty.png");
    this.showEmptyTiles(row-1, col);
    this.showEmptyTiles(row-1, col+1);
    this.showEmptyTiles(row-1, col-1);
    this.showEmptyTiles(row+1, col);
    this.showEmptyTiles(row+1, col+1);
    this.showEmptyTiles(row+1, col-1);
    this.showEmptyTiles(row, col-1);
    this.showEmptyTiles(row, col+1);

};

Minesweeper.prototype.isMarked = function(row, col) {
    return this.board[row].rowArray[col].marked;
};

Minesweeper.prototype.setMarker = function(row, col) {
    this.board[row].rowArray[col].marked = true;
    if(this.markedImages < this.numberOfMines) {
        this.markedImages++;
        this.setImage(row, col, "images/img2.png");
    }
};

Minesweeper.prototype.removeMarker = function(row, col) {
    this.board[row].rowArray[col].marked = false;
    if(this.markedImages > 0) {
        this.markedImages--;
        this.setImage(row, col, "images/standard.png");
    }
};

Minesweeper.prototype.hasMine = function(row, col){
    return this.board[row].rowArray[col].mine;
};
Minesweeper.prototype.isTurned = function(row, col) {
    return this.board[row].rowArray[col].turned;
};

Minesweeper.prototype.turnImage = function(row, col){
    if(this.isMarked(row,col)){
        this.removeMarker(row,col);
    }
    this.board[row].rowArray[col].turned = true;
};
Minesweeper.prototype.setImage = function(row, col, imagePath){
    this.board[row].rowArray[col].image.src = imagePath;
};
Minesweeper.prototype.setMine = function(row, col){
    this.board[row].rowArray[col].mine = true;
};
Minesweeper.prototype.hasNeighborMines = function(row, col){
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

new Minesweeper("test1");