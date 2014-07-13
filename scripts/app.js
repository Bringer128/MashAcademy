var mashAcademy = angular.module('MashAcademy', ['vr.directives.slider'])
.controller('MashAcademy', function($rootScope, $scope, $timeout) {
	$rootScope.showHelper = true;
	$rootScope.slider = { sliderValue: new Date(2014, 0, 1) };
	$rootScope.logIn = function(name) {
		if (!name) {
			return;
		}
		
		$rootScope.studentName = name;
		
		$('.splash').velocity({ 
			translateY: "-200%",
			top:0
		}, { duration: 1000 });
	};
	
	$scope.questions = [
		{ question: 'What was the MINIMUM TEMPERATURE in Broome on the 18th June 2014?', answer: 8.3, type: 'text', marker: markTextQuestion, hint: 'Try using the temperature data and putting it on the map!', passed: false },
		{ question: 'Was it SUNNY, CLOUDY or RAINING in Cairns on the 1st July 2014?', answer: 'Sunny', type: 'choice', marker: markTextQuestion, options: ['Sunny', 'Cloudy', 'Raining'], hint: 'Try using the weather data and putting it on the map!', passed: false },
		{ question: 'WHERE was the highest maximum temperature on the 6th May 2014?', answer: 'Broome', type: 'text', marker: markTextQuestion, hint: 'Try using the temperature data and putting it on the map!', passed: false },
	];
	
	$scope.currentQuestionIndex = 0;
	$scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
	
	$scope.nextQuestion = function() {
		$scope.currentQuestionIndex++;
		$scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
	}
	
	$scope.previousQuestion = function() {
		$scope.currentQuestionIndex--;
		$scope.currentQuestion = $scope.questions[$scope.currentQuestionIndex];
	}
	
	function markTextQuestion(answer) {
		if ((answer || '').toString().toLowerCase() == ($scope.currentQuestion.answer || '').toString().toLowerCase() ) {
			$scope.currentQuestion.passed = true;
		}
		
		showError();
	}
	
	function showError() {
		$scope.errorShowing = true;
		
		$timeout(function() {
			$scope.errorShowing = false;
		}, 1000);
	}
})
.run(function ($rootScope) {
    $rootScope.fireResize = function () {
        $rootScope.$broadcast('resize');
    };

    $(window).resize(function () {
        $rootScope.fireResize();
    });
});