"use strict";
QuizWindow.prototype = new Window();
QuizWindow.prototype.constructor = QuizWindow;

function QuizWindow(self, xPos, yPos) {
    this.WindowConstruct("Quiz", false, self, xPos, yPos);
    this.app = this.app;
    this.nextURL;
    this.moreQuestions = true;
    this.questionsArr;

    this.init();
}
QuizWindow.prototype.getScore = function(){
    var that = this;

    var game = this.app.querySelector(".workArea");
        game.innerHTML = '';
    var scoreBoard = document.createElement("div");
        scoreBoard.className = "questionList";
        game.appendChild(scoreBoard);

    var score = 0;
    for(var i = 0; i < this.questionsArr.length; i++){
        var container = document.createElement("section");
            container.className = "result";
        if(this.questionsArr[i].response === "Correct answer!" && this.questionsArr[i].tries === 1){
            score++;
            container.classList.add("correct");
        }else if(this.questionsArr[i].response === "Wrong answer! :(" || this.questionsArr[i].tries > 1){
            container.classList.add("incorrect");
        }

        var question = document.createElement("header");
        var span = document.createElement("span");
            span.innerHTML = this.questionsArr[i].question;
            question.appendChild(span);

        var arrow = document.createElement("img");
            arrow.src = "js/quiz/images/arrow.svg";
            arrow.alt = "Arrow";
            if(container.classList.contains("incorrect")  || this.questionsArr[i].tries > 1) {
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
            if(!container.classList.contains("incorrect") && this.questionsArr[i].tries == 1) {
                answer.classList.add("hidden");

            }
            answer.innerHTML = "Du svarade: " + this.questionsArr[i].answer;
            if(this.questionsArr[i].tries > 1){
                answer.innerHTML += " efter " + this.questionsArr[i].tries + " försök"
            }
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

QuizWindow.prototype.disableInput = function(){
    var button = this.app.querySelector(".sendAnswer");
    var text = this.app.querySelector(".answerBox");

    text.readOnly = true;
    button.disabled = true;
};

QuizWindow.prototype.enableInput = function(){
    var button = this.app.querySelector(".sendAnswer");
    var text = this.app.querySelector(".answerBox");

    text.readOnly = false;
    button.disabled = false;
};

QuizWindow.prototype.getQuestion = function(url){
    var that = this;

    var handleMessage = function(jsonObj){
        var obj = JSON.parse(jsonObj);
        that.nextURL = obj.nextURL;
        var questionField = that.app.querySelector(".questionField");
        questionField.classList.toggle("opacity-0");
        setTimeout(function(){
            questionField.innerHTML = obj.question;

            questionField.classList.toggle("opacity-0");
        }, 250);

        that.addQuestion(obj.question);
        that.enableInput();
        that.setStatus("Waiting on input...");
        console.log("Message received: " + obj.message);
        console.log("Question received: " + obj.question);
    };
    that.setStatus("Waiting on question from server");
    new AjaxCon(url, handleMessage, "GET");
};

QuizWindow.prototype.sendAnswer = function(answerInput){
    var that = this;

    that.addAnswer(answerInput);

    var handleMessage = function(jsonObj){

        var obj = JSON.parse(jsonObj);
        console.log(obj);
        that.addResponse(obj.message);

        if(obj.nextURL != undefined){
            that.getQuestion(obj.nextURL);
        }else if(obj.message === "Wrong answer! :("){
            that.enableInput();
            that.addFailure();
            that.setStatus("Waiting on input...");
        }
        else{
            that.gameOver();
            that.setStatus("No more questions!");
        }
    };
    var url = this.nextURL;

    this.setStatus("Sending answer to server");
    new AjaxCon(url, handleMessage, "POST", JSON.stringify({answer: answerInput}));

};

QuizWindow.prototype.init = function(){
    this.questionsArr = [];
    this.render();
    this.getQuestion("http://vhost3.lnu.se:20080/question/1");
};

QuizWindow.prototype.gameOver = function(){
    this.getScore();
};

QuizWindow.prototype.render = function(){
    var that = this;
    this.app.innerHTML = '';
    this.app.classList.add("thequiz");
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

    this.app.appendChild(questionDiv);
};

QuizWindow.prototype.addAnswer = function(message){
    this.questionsArr[this.questionsArr.length - 1].answer = message;
};

QuizWindow.prototype.addResponse = function(message){
      this.questionsArr[this.questionsArr.length - 1].response = message;
};

QuizWindow.prototype.addQuestion = function(message){

    this.questionsArr.push({
        question: message,
        answer: undefined,
        response: undefined,
        tries: 1
    });

};

QuizWindow.prototype.error = function(message){
    this.app.innerHTML = "<p>Någonting gick fel!</p><p>Testa att starta om applikationen</p>";
    console.log(message);
};

QuizWindow.prototype.addFailure = function(){
    this.questionsArr[this.questionsArr.length - 1].tries++;
    var pTag = document.createElement("p");
    pTag.innerHTML = "Fel svar, försök igen!";
    this.app.querySelector(".questionField").appendChild(pTag);
};