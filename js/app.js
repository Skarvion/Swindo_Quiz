var app = angular.module('gameApp', ['ngRoute']);

// Global variables for score tracking
// Todo: Decide whether edit the global variables directly or create factory method
app.run(function ($rootScope) {
	$rootScope.quizScore = 0;
	$rootScope.matchScore = 0;
	$rootScope.typedScore = 0;
});

app.factory('JSONData', ['$http', '$q', function ($http, $q) {
	var JSONData = {};

	JSONData.getQuiz = function() {
		return $http.get("json/quizdata.json");
	};

	JSONData.getMatching = function() {
		return $http.get("json/matchquizdata.json");
	};

	JSONData.shuffleArray = function(array) {
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

	return JSONData;
}]);

app.controller("MCQGameCtrl", ['$scope', '$rootScope', '$http', '$q', 'JSONData', function ($scope, $rootScope, $http, $q, JSONData) {
	$scope.rawData = [];
	$scope.rawQuestions = []; // The raw array of questions that have yet to be processed
	$scope.quizQuestions = [];

	function ExtractData() {

		JSONData.getQuiz()
			.then(function (response) {
				$scope.quizQuestions = response.data;
				// $scope.rawData = response.data;
			},
			function (status) {
				alert("Data quiz tidak bisa diambil");
			});
	}

	// Refresh all kind of updates to any changes to array of objects
	$scope.refreshList = function () {
		$scope.$apply();
	}

	function prepareQuizQuestions() {

		var m = $scope.quizQuestions.length, t, i;

		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);
			// And swap it with the current element.
			t = angular.copy($scope.quizQuestions[m]);
			$scope.quizQuestions[m] = angular.copy($scope.quizQuestions[i]);
			$scope.quizQuestions[i] = angular.copy(t);

			// Prepare the question objects with new fields
			$scope.quizQuestions[m].selectedAnswer = 0; // Determines selected answer by student
			$scope.quizQuestions[m].isDisabled = false; // Disable the input control
		}

		$scope.refreshList();
	}

	$scope.checkAnswer = function (question) {
		if (question.selectedAnswer == 0) {
			alert("Mohon diisi jawabannya");
			return;
		}
		
		if (question.selectedAnswer == question.corrAnsInt) {
			$rootScope.quizScore += 10;
			alert("Correct score: " + $rootScope.quizScore);
		}
		else alert("Wrong");

		question.isDisabled = true;
	}

	$scope.random = function() {
		return 0.5 - Math.random();
	};

	ExtractData();

	// Todo: A VERY DANGEROUS SHIT HERE, WHAT HAPPEN IF THE DATA NOT LOADED BY THE TIME THE TIMEOUT FINISH?
	// MAKE IT SYNCHRONOUS ONCE THE WHOLE THING DONE ASAP
	setTimeout(prepareQuizQuestions, 1000);
}]);