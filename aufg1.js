console.log("Aufgabenblatt 1");

const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

var max_Bewertung = 5;
var aktulleAnzahl = 0;
var bewertung = 0;

const Baum = function () {
	rl.question('1 für Eigene bewertung, 2 für randome bewertungen\n', function (x) {
		
		switch (parseInt(x)) {
			case 1:
				me(log);
				break
			case 2:
				random(log);
				break;
			default:
				console.log("falscher input");
				break;
		}
	})
}

// Zufalls berechnung
const random = function (callback) {
	var random;
	for (var i = 1; i <= 20; i++) {
		random = getRandomInt(6);
		bewertung += random;
		console.log("Person " + i + " hat " + random + " sterne gegeben");
	}
	callback(("Die App hat " + Math.round(bewertung / i*10)/10 +' von ' + max_Bewertung + ' Sternen')); // bewertung wird auf 1 nachkommastele gekürzt.
	// mit Math.round kürzt man die berechnung.
	rl.close();
}

//msg ausgabe
const log = function (messange) {
  console.log(messange)
}

// die berechnung auslagern 
const calculate = myArr => {
	var sum = myArr.reduce( (a, b) => a+b);
	var cal = sum / myArr.length;
	callback("die durchschnittliche Betwertung ist " + cal);
};

const me = async function eingabe(callback) {

		var answer;
		var x,i;
		const myArr = [];
			
		while ( x != 'quit' ) {
			i++;
			//answer = await rl.question('Was ist Ihre Bewertung\n'); //func
			switch (answer) {
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
					callback(myArr);
					break;
				default:
					console.log("err falsche eingabe");
					break;
				}// switch
			// })//func (txt eingabe)
		}//while	
		rl.close();
	}//func 2 (die ander func)

Baum()
