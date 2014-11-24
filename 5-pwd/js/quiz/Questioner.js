"use strict";

function Questioner(id){
    this.rootId = id;
    this.nextURL;
    this.moreQuestions = true;
    this.questionsArr;

    this.init();

}
Questioner.prototype.getScore = function(){
    var that = this;

    var game = this.rootId.querySelector(".workArea");
        game.innerHTML = '';
    var scoreBoard = document.createElement("div");
        scoreBoard.className = "questionList";
        game.appendChild(scoreBoard);

    var score = 0;
    for(var i = 0; i < this.questionsArr.length; i++){
        var container = document.createElement("section");
            container.className = "result";
        if(this.questionsArr[i].response === "Correct answer!"){
            score++;
            container.classList.add("correct");
        }else if(this.questionsArr[i].response === "Wrong answer! :("){
            container.classList.add("incorrect");
        }

        var question = document.createElement("header");
        var span = document.createElement("span");
            span.innerHTML = this.questionsArr[i].question;
            question.appendChild(span);

        var arrow = document.createElement("img");
            arrow.src = "js/quiz/images/arrow.svg";
            arrow.alt = "Arrow";
            if(container.classList.contains("incorrect")) {
                arrow.className = "up";
            }
            question.appendChild(arrow);
        var aTag = document.createElement("a");
            aTag.href = "#";
            aTag.appendChild(question);
            aTag.onclick = function(e){
                e.preventDefault();
                var sibling = this.parentNode.querySelector(".answer");

                sibling.classList.toggle("hidden");
                this.parentNode.querySelector("img").classList.toggle("up");
            };
            container.appendChild(aTag);

        var answer = document.createElement("section");
            answer.classList.add("answer");
            if(!container.classList.contains("incorrect")) {
                answer.classList.add("hidden");

            }
            answer.innerHTML = "Du svarade: " + this.questionsArr[i].answer;
            container.appendChild(answer);

            scoreBoard.appendChild(container);
    }

    var total = document.createElement("div");
    total.innerHTML = "Du fick " + score + " av " + this.questionsArr.length + " rätt!";
    total.className = "totalScore";
    game.appendChild(total);

    var newGame = document.createElement("button");
    newGame.innerHTML = "Ny omgång";
    newGame.className = "btn newGame";
    newGame.onclick = function(){
        that.init();
    };
    game.appendChild(newGame);

};

Questioner.prototype.disableInput = function(){
    var button = this.rootId.querySelector(".sendAnswer");
    var text = this.rootId.querySelector(".answerBox");

    text.readOnly = true;
    button.disabled = true;
};

Questioner.prototype.enableInput = function(){
    var button = this.rootId.querySelector(".sendAnswer");
    var text = this.rootId.querySelector(".answerBox");

    text.readOnly = false;
    button.disabled = false;
};

Questioner.prototype.getQuestion = function(url){
    var that = this;

    var handleMessage = function(jsonObj){
        var obj = JSON.parse(jsonObj);
        that.nextURL = obj.nextURL;
        var questionField = that.rootId.querySelector(".questionField");
        questionField.classList.toggle("opacity-0");
        setTimeout(function(){
            questionField.innerHTML = obj.question;

            questionField.classList.toggle("opacity-0");
        }, 250);

        that.addQuestion(obj.question);
        that.enableInput();

        console.log("Message received: " + obj.message);
        console.log("Question received: " + obj.question);
    };

    new AjaxCon(url, handleMessage, "GET");
};

Questioner.prototype.sendAnswer = function(answerInput){
    var that = this;

    that.addAnswer(answerInput);

    var handleMessage = function(jsonObj){

        var obj = JSON.parse(jsonObj);
        console.log("Message received: " + obj.message);
        that.addResponse(obj.message);

        if(obj.nextURL != undefined){
            that.getQuestion(obj.nextURL);
        }else if(obj.message !== "Wrong answer! :(" || obj.message !== "Correct answer!"){
            that.gameOver();
        }else{
            that.error(obj.message);
        }
    };
    var url = this.nextURL;

    new AjaxCon(url, handleMessage, "POST", JSON.stringify({answer: answerInput}));

};

Questioner.prototype.init = function(){
    this.questionsArr = [];
    this.createHTML();
    this.getQuestion("http://vhost3.lnu.se:20080/question/1");
};

Questioner.prototype.gameOver = function(){
    this.getScore();
    //this.init();
};

Questioner.prototype.createHTML = function(){
    var that = this;
    this.rootId.innerHTML = '';
    this.rootId.classList.add("thequiz");
    var questionDiv = document.createElement("div");
    questionDiv.className = "workArea";

    var questionField = document.createElement("div");
    questionField.className = "questionField";
    questionDiv.appendChild(questionField);

    var input = document.createElement("input");
    input.type = "text";
    input.className = "answerBox";
    questionDiv.appendChild(input);

    var button = document.createElement("button");
    button.className = "sendAnswer";
    button.innerHTML = "Skicka svar";
    var submitForm = function(e){
        if(input.value != ""){
            that.disableInput();
            that.sendAnswer(input.value);
            input.value = "";
        }
    };
    button.onclick = submitForm;
    input.onkeypress = function(e){
        if(e.keyCode == 13) {
            submitForm();
        }
    };
    questionDiv.appendChild(button);

    this.rootId.appendChild(questionDiv);
};

Questioner.prototype.addAnswer = function(message){
    this.questionsArr[this.questionsArr.length - 1].answer = message;
};

Questioner.prototype.addResponse = function(message){
      this.questionsArr[this.questionsArr.length - 1].response = message;
};

Questioner.prototype.addQuestion = function(message){

    this.questionsArr.push({
        question: message,
        answer: undefined,
        response: undefined
    });

};

Questioner.prototype.error = function(message){
    this.rootId.innerHTML = "<p>Någonting gick fel!</p><p>Testa att starta om applikationen</p>";
    console.log(message);
};

/*

 status 200
 {"message" : "Correct answer!", "nextURL" : nextUrl}

 status 400
 {"message" : "Wrong answer! :("}

 status 400
 {"message" : "Not a valid JSON with a property named 'answer'"}

 status 400
 {"message" : "Bad URL - no question found on that URI"}
 */