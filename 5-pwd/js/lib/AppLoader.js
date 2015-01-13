/**
 * Created by Erik.
 */
"use strict";
var PWD = PWD || {};
PWD.AppLoader = function(header){
    var background = document.createElement("div");
    background.classList.add("AppLoader");

    var h1 = document.createElement("h1");
    h1.innerHTML = header;
    background.appendChild(h1);

    var body = document.querySelector("body");
    body.appendChild(background);

    var container = document.createElement("div");
    container.classList.add("container");
    background.appendChild(container);

    var progress = document.createElement("div");
    progress.classList.add("progress");
    container.appendChild(progress);
    setTimeout(function(){
        progress.classList.add("loading");

        setTimeout(function(){
            body.removeChild(background);
        }, 1250);
    }, 200);
};