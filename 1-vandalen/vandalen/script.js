"use strict";

var makePerson = function(persArr){

	var names = [];
	var ages = [];
	var sumAges = 0;

	persArr.forEach(function(person){
		try {
			if (typeof person.age != 'number' || (person.age % 1) !== 0 ) {
				throw new TypeError("Age of " + person.name + " (" + person.age + ") is not valid");
			}
			ages.push(person.age);
			sumAges += person.age;

			if (typeof person.name != 'string') {
				throw new TypeError("Name: \"" + person.name + "\" is not a valid string");
			}
			names.push(person.name);
		}catch(TypeError){
			console.log(TypeError.message);
		}
	});

	ages = ages.sort();

	return {names: names.sort(String.localeCompare).join(', '), minAge: ages[0], maxAge: ages[persArr.length-1], averageAge: Math.round(sumAges/persArr.length)};
};