"use strict";

var names;
var ages;
var sumAges;

var splitPerson = function(person){
	ages.push(person.age);
	sumAges += person.age;
	names.push(person.name);
};

var makePerson = function(persArr){

	names = [];
	ages = [];
	sumAges = 0;

	persArr.forEach(splitPerson);

	ages = ages.sort();

	return {names: names.sort(String.localeCompare).join(', '), minAge: ages[0], maxAge: ages[persArr.length-1], averageAge: Math.round(sumAges/persArr.length)};
};