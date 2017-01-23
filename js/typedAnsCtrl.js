var app = angular.module("quizApp");

app.controller("typedAnsCtrl", function($scope, http) {
	var ans = $scope.ans.toLowercase(); //reads from the ans in typed form
	var corrAns = corrAnsData.toLowercase(); //reads from correct ans
	var ans.status = false;
	$scope.displayQuestion = function() {
		
	};
	$scope.validateAns = function(ans) {
		ans.toLowerCase();
		corrAns.toLowercase();
		if(ans == corrAns) {
			//$scope.nextQuestion
		}

	$scope.endofAns = function() {
		//$scope.DirectToResult
	};
});