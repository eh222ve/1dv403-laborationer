"use strict";

function Questioner(id){
    this.rootId = document.getElementById(id);
    this.activeQuestion;
    this.nextURL;
    this.moreQuestions = true;
    this.questionsArr = ["Vad är 1?", "Vad är 2?", "Vad är 3?", "Vad är 4?"];
    this.answersArr = [["Vet ej", "Wrong answer! :("], ["2", "Correct answer!"], ["Vet ej", "Wrong answer! :("],["Vet ej", "Wrong answer! :("],];
    this.addAnswer = function(answer, message){
        this.answersArr.push([answer, message]) ;
        this.rootId.getElementsByClass("answerBox")[0].value = "";
        this.updateSidebar();
    };

    this.createHTML();
    this.updateSidebar();
    //this.getQuestion("url here from Johan"); //Insert URI
}
Questioner.prototype.updateSidebar = function(){
    var sidebar = this.rootId.querySelector(".previousQuestions");
    sidebar.innerHTML = '';

    console.log(sidebar);

    for(var i = 0; i < this.questionsArr.length; i++){
        var container = document.createElement("section");
        container.className = "result";
        if(this.answersArr[i][1] === "Correct answer!"){
            container.classList.add("correct");
        }else if(this.answersArr[i][1] === "Wrong answer! :("){
            container.classList.add("incorrect");
        }

        var question = document.createElement("header");
        question.innerHTML = this.questionsArr[i];
        var aTag = document.createElement("a");
        aTag.href = "#";
        aTag.appendChild(question);
        aTag.onclick = function(e){
            e.preventDefault();
            var sibling = this.parentNode.querySelector(".answer");
            sibling.classList.toggle("hidden");
        };
        container.appendChild(aTag);

        var answer = document.createElement("section");
        answer.classList.add("answer");
        answer.classList.add("hidden");
        answer.innerHTML = "Du svarade: " + this.answersArr[i][0];
        container.appendChild(answer);

        sidebar.appendChild(container);
    }

};
Questioner.prototype.getQuestion = function(url){
    var handleMessage = function(jsonObj){
        var obj = JSON.parse(jsonObj);

        //Lägg in obj.message i HTML-tagg
    };

    new AjaxCon(url, handleMessage);
};

Questioner.prototype.sendAnswer = function(answer){
    var that = this;

    var handleMessage = function(jsonObj){
        var obj = JSON.parse(jsonObj);

        that.addAnswer(answer, obj.message);

        if(obj.message === "Correct answer!"){
            this.nextURL = obj.nextURL;

            this.activeQuestion = obj.question;
        }else{
            this.moreQuestions = false;
        }
    };
    var url = "url/question/question-id/answer/" + answer;
    new AjaxCon(url, handleMessage);
};

Questioner.prototype.createHTML = function(){
    var questionDiv = document.createElement("div");
    questionDiv.className = "workArea";

    var questionField = document.createElement("div");
    questionField.className = "questionField";
    questionField.innerHTML = "Här kommer frågorna att visas"
    questionDiv.appendChild(questionField);

    var input = document.createElement("input");
    input.type = "text";
    input.className = "answerBox";
    questionDiv.appendChild(input);

    var button = document.createElement("button");
    button.className = "sendAnswer";
    button.innerHTML = "Skicka svar";
    button.onclick = function(){
        if(input.value != ""){
            // that.getQuestion(input.value)
            input.value = "";
        }else{
            alert('empty');
        }
    };
    questionDiv.appendChild(button);

    this.rootId.appendChild(questionDiv);

    var sidebar = document.createElement("div");
    sidebar.innerHTML = "Här kommer tidigare frågor att visas";
    sidebar.className = "previousQuestions";
    this.rootId.appendChild(sidebar);
};



/*
 url/question/"question-id"/answer/"answer"

 status 200
 {"message" : "Correct answer!", "nextURL" : nextUrl}

 status 400
 {"message" : "Wrong answer! :("}
 status 400
 {"message" : "Not a valid JSON with a property named 'answer'"}
 status 400
 {"message" : "Bad URL - no question found on that URI"}
 */