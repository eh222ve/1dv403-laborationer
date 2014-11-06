"use strict";

window.onload = function(){

	// I denna funktion ska du skriva koden för att hantera "spelet"
	var convertString = function(str){
		// Plats för förändring.		
		// Returnera den konverterade strängen.
		// Vid fel, kasta ett undantag med ett meddelande till användaren.
		str = str.split('');

		var i = 0;

		while(i < str.length){
			if(str[i] === str[i].toLowerCase()){
				console.log(str[i] + " : " + str[i].toUpperCase());
				str[i] = str[i].toUpperCase();
			}else if(str[i] === str[i].toUpperCase()){
				console.log(str[i] + " : " + str[i].toLowerCase());
				str[i] = str[i].toLowerCase();
			}
			if(str[i] == "a" || str[i] == "A"){
				console.log(str[i] + " : #");
				str[i] = "#";
			}
			i++;
		}

		return str.join('');

	};
	// ------------------------------------------------------------------------------


	// Kod för att hantera utskrift och inmatning. Denna ska du inte behöva förändra
	var p = document.querySelector("#value"); // Referens till DOM-noden med id="#value"
	var input = document.querySelector("#string");
	var submit = document.querySelector("#send");

	// Vi kopplar en eventhanterare till formulärets skickaknapp som kör en anonym funktion.
	submit.addEventListener("click", function(e){
		e.preventDefault(); // Hindra formuläret från att skickas till servern. Vi hanterar allt på klienten.

		p.classList.remove( "error");

		try {
			var answer = convertString(input.value) // Läser in texten från textrutan och skickar till funktionen "convertString"
			p.innerHTML = answer;		// Skriver ut texten från arrayen som skapats i funktionen.	
		} catch (error){
			p.classList.add( "error"); // Växla CSS-klass, IE10+
			p.innerHTML = error.message;
		}
	
	});



};