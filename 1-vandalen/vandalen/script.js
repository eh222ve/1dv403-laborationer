"use strict";

var makePerson = function(persArr){

	var names = persArr.map(function(person) {
		try {
			if (typeof person.name != 'string') {
				throw new TypeError("Name: \"" + person.name + "\" is not a valid string");
			}
			return person.name;
		}catch(TypeError){
			console.warn(TypeError.message);
		}
	}).sort(String.localeCompare).join(', ');

	var ages = persArr.map(function(person) {
		try {
			if (typeof person.age != 'number' || (person.age % 1) !== 0) {
				throw new TypeError("Age of " + person.name + " (\"" + person.age + "\") is not valid");
			}
			return person.age;
		}catch(TypeError){
		console.warn(TypeError.message);
		}
	}).sort();

	var averageAge = Math.round(ages.reduce(function(a, b) { return a + b; })/persArr.length);

	return {names: names, minAge: ages[0], maxAge: ages[ages.length-1], averageAge: averageAge};
};