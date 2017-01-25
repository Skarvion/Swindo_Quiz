var app = angular.module('gameApp', ['ngRoute', 'bootstrap-modal', 'ngSanitize', 'ngCsv']);


// Todo: Edit the url page later to accomodate with the other people's work
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: "templates/Login.html"
			, controller: "loginCtrl"
		})
		.when('/Sales', {
			templateUrl: "templates/Sales.html"
			, controller: "saleCtrl"
		})
		.when('/Analysis', {
			templateUrl: "templates/Analysis.html"
			, controller: "analysisCtrl"
		})
		.when('/Report', {
			templateUrl: "templates/Report.html"
			, controller: "reportCtl"
		})
		.when('/Stock', {
			templateUrl: "templates/Items.html"
			, controller: "itemsCtrl"
		});
}]);	

// Factory methods that acts as the global variable for the score and its functions to get, modify and clear score. 
// All actions that relating with the scoring method must call from this factory methods

app.factory('ScoreTracker', function() {
	var currentScore = 0;
	var ScoreTracker = [];

	ScoreTracker.getScore = function() {
		return currentScore;
	}
	ScoreTracker.setScore = function (points) {
		currentScore = points;
	}
	ScoreTracker.addScore = function(points) {
		currentScore += points;
	}
	ScoreTracker.subtractScore = function(points) {
		currentScore -= points;
	}
	ScoreTracker.clearScore = function() {
		currentScore = 0;
	}

	return ScoreTracker;
});

app.factory('JSONData', ['$http', function ($http) {
	var JSONData = [];
	var quizURL = "json/quizdata.json";
	var matchURL = "json/matchquizdata.json";

	JSONData.getQuiz = function() {
		return $http.get(quizURL);
	}

	JSONData.getMatching = function() {
		return $http.get(matchURL);
	}

	return JSONData;

}]);

app.controller('multipleChoiceGameCtrl', function ($scope, $http) {
	alert("Work");

	$scope.rawQuestions = []; // The raw array of questions that have yet to be processed
	$scope.quizQuestions = [];
	
	// Selecting a random number of questions from the database
	function questionSelect(quantity) {
		var rawData = [];
		JSONData.getQuiz()
			.then(function (response) {
				rawData = response.data;
			})

		var iteration = quantity;
		if (rawData.length < quantity) {
			iteration = rawData.length;
		}

		var selectedQuestionIndex = [];

		for (var i = 0; i < iteration; i++)
		{
			var restart = true;
			var rand = 0;

			// Select question index and check against an array of an already selected question array to prevent duplicates
			do {
				restart = false;
				rand = rawData[Math.floor(Math.random() * rawData.length)];
				// selecting the questions without selecting a duplicate

				if (selectedQuestionIndex > 0) {
					var duplicate = false;
					for (var j = 0; j < selectedQuestionIndex.length; j++) {
						if (rand == selectedQuestionIndex[j]) {
							duplicate = true;
							restart = true;
							break;
						}
					}
					if (duplicate == false) {
						selectedQuestionIndex.push(rand);
					}
				
				}
			} while (restart)

			$scope.questions.push(rawData[rand]);
		}
	}

	questionSelect(15);

	// Fisher-Yates algorithm
	// Todo: Move this function to big controller so everybody can use it later
	// Todo: Possibly change the question selection function with Fisher-Yates method for better performance
	function shuffleArray(array) {
		var m = array.length, t, i;

		// While there remain elements to shuffle…
		while (m) {

			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}

	// Clean up the raw questions array for easier programming for view and shuffling answer position
	function quizSelection() {
		for (var i = 0; i < rawQuestions.length; i++) {
		 	var tempObject = {question: rawQuestions[i].question, corrAnswer: rawQuestions[i].corrAns, possibleAnswer = [], pictureLink = rawQuestions[i].qpicture, answerDescription = rawQuestions.corrAnswerDescription};

		 	var tempAnswer = [];
		 	// Todo: Remember to chnage that corrAnswer to either an access to first element of an array or just by itself depending
		 	// on the final JSON file format
		 	tempAnswer.push(rawQuestions[i].corrAnswer[0]);
		 	tempAnswer.push(rawQuestions[i].othAnswer1);
		 	tempAnswer.push(rawQuestions[i].othAnswer2);
		 	tempAnswer.push(rawQuestions[i].othAnswer3);

		 	tempAnswer = shuffleArray(tempAnswer);

		 	tempObject.possibleAnswer = tempAnswer;

		 	quizQuestions.push(tempObject);
		 }
		 
	}

	var selectedAnswer = new Array(quizQuestions.length + 1).join('0').split('');

	function answerQuiz(selection, questionNumber) {
		selectedAnswer[questionNumber] = selection;
	}

	var wrongAnswer = []; // Keeps track of which question they got wrong

	function checkAnswer() {

		// Check for empty answer, if there's one, return the function without checking for correct answers
		for (var i = 0; i < selectedAnswer.length; i++) {
			if (selectedAnswer[i] == 0) {
				alert("Pertanyaan nomor " & i & " belum dijawab, mohon dijawab");
				return;
			}
		}

		for (var i = 0; i < quizQuestions.length; i++) {
			if (selectedAnswer[i] == quizQuestions[i].corrAnswer) {
				ScoreTracker.addScore(1);
			}

			// Todo: do something if answer is wrong
		}
	}


}

