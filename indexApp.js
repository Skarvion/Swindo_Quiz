var app = angular.module("quizApp");

app.controller("typedAnsCtrl", function($scope, http) {
	$scope.displayQuestion = function() {};
	$scope.
})


	// redirect to Cate page
	$scope.redirectCate = function(index) 
	{
		$scope.cateIndex = index;
		$scope.homeShow = false;
		$scope.cateShow = true;
		$scope.cardShow = false;
	}
});


// category ctrl
app.controller("cateCtrl", function ($scope)
{
	// make new category
	$scope.addCate = function()
	{
		$scope.category.push($scope.newCat);
		$scope.newCat = null;
	}
	
	// update category
	$scope.updateCate = function(cate, cateIndex)
	{	
		$scope.category[cateIndex] = cate;
	}

	// delete category
	$scope.delCate = function(cateIndex)
	{
		$scope.category.splice(cateIndex, 1);
	}
});

// card ctrl
app.controller("cardCtrl", function($scope, $http) {
	// make new card in category
	$scope.addCard = function()
	{
		$scope.category[$scope.cateIndex].cards.push($scope.newCard);
		$scope.newCard = null;
	}
	
	// updates card 
	$scope.updateCard = function(aCard, cardIndex) {
		$scope.category[$scope.cateIndex].cards[cardIndex] = aCard;
	}
			
	// delete card
	$scope.delCard = function(cardIndex)
	{
		$scope.category[$scope.cateIndex].cards.splice(cardIndex, 1);
	}
	
	// shuffle cards
	$scope.shuffleCards = function()
	{
		$scope.generated = [];
		$scope.currentIndex = $scope.category[$scope.cateIndex].cards.length;
		$scope.cindex = $scope.category[$scope.cateIndex].cards.length;

		while ($scope.cindex >= 1) {
			$scope.randIndex = Math.floor(Math.random() * $scope.currentIndex); // add 1 for 1-4
			if($scope.generated.includes($scope.category[$scope.cateIndex].cards[$scope.randIndex]) == false) {
				$scope.generated.push($scope.category[$scope.cateIndex].cards[$scope.randIndex]);
				$scope.cindex -= 1;
			} 
		}
		$scope.category[$scope.cateIndex].cards = $scope.generated;
	}
});

app.controller("cardTestCtrl", function($scope, $http, $q) {
	$scope.cardsRemembered = [];
	$scope.iteration = 0;
	var cardsIndex = 0;

	var url = "data/cards.json";
	$http.get(url).then(
			function(response) {
				$scope.cardsNotRemembered = response.data;
			},
			function(response) {
				// error handling routine
		});	
	
	var index = cardsIndex;
	
	$scope.changeCardStatus = function(answer) {
		$scope.cardDescShow = false;
		$scope.iteration += 1;
		
		if ($scope.cardsNotRemembered[$scope.cateIndex].cards.length > 0) {
		
			if(answer == 'yes') {

				if ($scope.cardsNotRemembered[$scope.cateIndex].cards.length != 0)  {
					$scope.cardsRemembered.push($scope.cardsNotRemembered[$scope.cateIndex].cards[index]);
					
					$scope.cardsNotRemembered[$scope.cateIndex].cards.splice(index, 1);
				}
			}

		$scope.currentCardShow = $scope.cardsNotRemembered[$scope.cateIndex].cards[index];
		}
	
		// #to_implement Make completed thing a bit final 
		if ($scope.cardsNotRemembered[$scope.cateIndex].cards.length == 0) {
			$scope.finalCardShow = true;
		}
	}
});