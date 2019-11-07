//aufgabe 1
console.log("aufgabe 1");

//aufgabe 2 

//Anzahl
let i = 0;
//bewertungen
const myArr = [];

//input
const readline = require('readline');
var cl = readline.createInterface( process.stdin, process.stdout );
var sum = 0;

var question = (q) => {
	return new Promise( (res, rej) => {
		cl.question( q, answer => {
			res(answer);
		})
	});
};
//Benutzer
const benutzer = [];


// die berechnung auslagern 
const calculate = myArr => {
	var sum = myArr.reduce( (a, b) => a+b);
	var cal = sum / myArr.length;
	console.log("die durchschnittliche Betwertung ist " + cal);
};


const stern = x =>{
(async function main() {
	//max höhe
	var x;
	while ( x != 'quit' ) {
		// await lässt die funktion pausieren
		x = await question('Wieviel sterne möchtest du vergeben\n');
		
		i++;
		switch (x) {
			case "1":
				myArr.push(1);
				break;
			case "2":
				myArr.push(2);
				break;
			case "3":
				myArr.push(3);
				break;
			case "4":
				myArr.push(4);
				break;
			case "5":
				myArr.push(5);
				break;
			case "calc":
				calculate(myArr);
				break;
			case "count":
				console.log("Es wurden " + i + " Bewertungen abgegeben");
				console.log("Der array ist " + myArr.length + " zeichen lang");
				console.log("die letzte eingegebene zahl ist " + myArr[i]);
				console.log(benutzer);
				break;
			default:
				console.log("err falsche eingabe");
				benutzer.pop();
				break;
			}
	}
	console.log('Auf wiedersehen');
});};

stern();