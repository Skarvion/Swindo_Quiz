var app = angular.module('myApp', []);

app.run(function ($rootScope) {
	$rootScope.quizScore = 0;
	$rootScope.matchScore = 0;
	$rootScope.typedScore = 0;
	$rootScope.totalScore = 0;
});

app.controller("mainCtrl", ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	$scope.isLoaded = false;
	var url = "json/quizdata.json";
	$http.get(url)
		.then (function(response) {
				$scope.projects = response.data;
			}
			, function(response) {
			    alert(response);
			});
	var url2 = "json/matchquizdata.json";
	$http.get(url2)
		.then (function(response) {
				var tempArray = response.data;
				for (var i = 0; i < tempArray.length; i++) {
					$scope.projects.push(tempArray[i]);
				}
			}
			, function(response) {
			    alert(response);
			});

	$scope.shuffle = function(arr) {
		var a = arr.length, c, b;

		// While there remain elements to shuffle…
		while (a) {
			// Pick a remaining element…
			b = Math.floor(Math.random() * a--);
			// And swap it with the current element.
			c = arr[a];
			arr[a] = arr[b];
			arr[b] = c;
		}
		return arr;
	}

	$scope.refreshList = function () {
		$scope.$apply();
	}

	$scope.calculateScore = function () {
		$scope.totalScore = $rootScope.quizScore + $rootScope.matchScore + $rootScope.typedScore;
	}

	function prepareQuizQuestions() {
		var m = $scope.projects.length, t, i;

		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);
			if (($scope.projects[m].qtype == "mp") || ($scope.projects[m].qtype == "mt")) {
				$scope.projects[m].row = [
						[{'image': $scope.projects[m].qinput1a, 'matchingId': 'A'},
						{'image': $scope.projects[m].qinput2a, 'matchingId': 'B'},
						{'image': $scope.projects[m].qinput3a, 'matchingId': 'C'},
						{'image': $scope.projects[m].qinput4a, 'matchingId': 'D'}],

						[{'image': $scope.projects[m].qinput1b, 'matchingId': 'A'},
						{'image': $scope.projects[m].qinput2b, 'matchingId': 'B'},
						{'image': $scope.projects[m].qinput3b, 'matchingId': 'C'},
						{'image': $scope.projects[m].qinput4b, 'matchingId': 'D'}]
					];

					$scope.projects[m].row[0] = angular.copy($scope.shuffle($scope.projects[m].row[0]));
					$scope.projects[m].row[1] = angular.copy($scope.shuffle($scope.projects[m].row[1]));
					}

			// And swap it with the current element.
			t = angular.copy($scope.projects[m]);
			$scope.projects[m] = angular.copy($scope.projects[i]);
			$scope.projects[i] = angular.copy(t);

			// Prepare the question objects with new fields
			$scope.projects[m].isDisabled = false; // Disable the input control
			$scope.projects[m].selectedAns = "";
			$scope.projects[m].selectedSet = ["", "", "", ""];
		}

		for (var i = 0; i < $scope.projects.length; i++) {
			$scope.projects[i].qid = i+1;
		}

		$scope.isLoaded = true;	
		$scope.refreshList();
	}

	$scope.numToLetter = function (index) {
		if (index == 0) return "A";
		else if (index == 1) return "B";
		else if (index == 2) return "C";
		else if (index == 3) return "D";
		else {
			return "NaN";
		}
	}

	setTimeout(prepareQuizQuestions, 2000);

	$scope.questionType = function(type) {
		if (type == "mc") {
			alert("T");
			return "Jawaban Ganda";
		}
		else if (type == "ta") {
			return "Jawab Pertanyaan";
		}
		else if (type == "mp") {
			return "Cocokan Gambar-Gambar";
		}
		else if (type == "mt") {
			return "Cocokan Kata-Kata";
		}
		else {
			alert("Fail");
			return "Jenis pertanyaan tidak diketahui";
		}
	}
	$scope.onCheckMatch = function(question) {
		if (question.isDisabled)
			return;

		var upperLetter = "";
		var selector = 0;
		var pointer = 0;
		var correct = 0;

		for (var i = 0; i < 4; i++) {
			upperLetter = question.selectedSet[i].toUpperCase();

			if (upperLetter == "A") 	selector = 0;
			else if (upperLetter == "B") selector = 1;
			else if (upperLetter == "C") selector = 2;
			else if (upperLetter == "D") selector = 3;
			else {
				alert("Tolong isi kotak jawaban dengan benar menggunakan huruf A sampe D");
				return;
			}

			if (question.row[0][selector].matchingId == question.row[1][i].matchingId)
			{
				pointer += 2.5;
				correct++;
			}

			$rootScope.matchScore += pointer;
		}
		alert("Kamu mendapatkan " + correct + " jawaban benar! Kamu mendapatkan " + pointer + " poin");
		question.isDisabled = true;
	}

	$scope.questionType = function(type) {
		// var type = question.qtype;
		if (type == "quizAns") {
			return "Jawaban Ganda";
		}
		else if (type == "typedAns") {
			return "Jawab Pertanyaan";
		}
		else if (type == "mp" || type == "mt") {
			return "Cocokan Gambar-Gambar";
		}
		else {
			return "Jenis pertanyaan tidak diketahui";
		}
	}

	$scope.onCheckQuiz = function(question, selection) {
		if (question.isDisabled)
			return;

		if (selection == question.correctAnsInt) {
			$rootScope.quizScore += 10;
			alert("Benar! Kamu mendapatkan 10 poin! :)");
		}
		else {
			var selector = 0;
			alert("Salah. Coba lagi lain kali. :( /n ");
		}

		question.isDisabled = true;
	}
// }]);

// app.controller("typedAnsCtrl", ['$scope', '$rootScope', function ($scope, $rootScope) {
	
	$scope.ansResult = false;
	
	$scope.onCheckTyped = function(question) {
		if (question.isDisabled)
			return;

		if (question.selectedAns == "")
		{
			alert("Mohon diisi jawabannya");
			return;
		}
		
		if (question.selectedAns == question.corrAns) {
			$rootScope.typedScore += 10;
			alert("Benar! Kamu mendapatkan 10 poin! :)");
		}
		else alert("Salah. Coba lagi lain kali. :(");

		question.isDisabled = true;
	}
}]);

