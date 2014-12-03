"use strict";

function AjaxCon(url, callback, posttype, params){
    var READY_STATE_UNINITIALIZED = 0;
    var READY_STATE_OPENED      = 1;
    var READY_STATE_SENT        = 2;
    var READY_STATE_LOADING     = 3;
    var READY_STATE_COMPLETE    = 4;

    var  xhr = this.getXHR();

    xhr.onreadystatechange = function(){
        if(xhr.readyState === READY_STATE_COMPLETE){
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 || xhr.status === 400){
                callback(xhr.responseText);
            }else{
                console.log('Läsfel, status: ' + xhr.status);
            }
        }
    };

    if(posttype === "get" || posttype === "GET"){
        xhr.open("get", url, true);

    //xhr.setRequestHeader("If-Modified-Since", "Mon, 01 Sep 2004 00:00:00 GMT");
    xhr.send(null)

    }else{
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(params);
    }

    this.abort = function(){
      xhr.abort();
    };
}

AjaxCon.prototype.getXHR = function(){
    var xhr = null;

    try{
        xhr = new XMLHttpRequest();
    }catch(error){
        try{
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }catch(error){
            throw new Error("No XHR object available");
        }
    }
    return xhr;
};