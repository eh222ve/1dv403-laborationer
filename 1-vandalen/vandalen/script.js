"use strict";

var makePerson = function(persArr){

	var names = [];
	var ages = [];
	var sumAges = 0;

	persArr.forEach(function(person){
		ages.push(person.age);
		sumAges += person.age;
		names.push(person.name);
	});

	ages = ages.sort();

	return {names: names.sort(String.localeCompare).join(', '), minAge: ages[0], maxAge: ages[persArr.length-1], averageAge: Math.round(sumAges/persArr.length)};
};