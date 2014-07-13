angular.module('MashAcademy')
.directive('selector', [function() {
  return {
	restrict: 'E',
	templateUrl: 'templates/selector.html',
	replace: false,
	link: function($scope, $element, $attrs) {
		$scope.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July'
		];
		
		var maxDate = new Date(2014, 6, 11);
		
		$scope.currentMonthIndex = 0;
		$scope.currentDayIndex = 0;
		$scope.currentMonth = $scope.months[$scope.currentMonthIndex];
		
		$scope.slider.sliderValue = new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1);
		
		$scope.isNextMonth = function() {
			return $scope.currentMonthIndex < $scope.months.length - 1;
		}
		
		$scope.isPreviousMonth = function() {
			return $scope.currentMonthIndex > 0;
		}
		
		$scope.nextMonth = function() {
			if (!$scope.isNextMonth()) {
				return;
			}
			
			$scope.currentMonthIndex++;
			$scope.currentMonth = $scope.months[$scope.currentMonthIndex];
			var theDate = new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1);
			if (maxDate < theDate) {
				$scope.currentDayIndex = maxDate.getDate();
				$scope.currentDay = $scope.days[$scope.currentDayIndex];
				theDate = new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1);
			}
			
			$scope.slider.sliderValue = theDate;
		}
		
		$scope.previousMonth = function() {
			if (!$scope.isPreviousMonth()) {
				return;
			}
			
			$scope.currentMonthIndex--;
			$scope.currentMonth = $scope.months[$scope.currentMonthIndex];
			$scope.slider.sliderValue = new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1);
		}
		
		$scope.days = [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31
		];
		
		$scope.currentDay = $scope.days[$scope.currentDayIndex];
		
		$scope.isNextDay = function() {
			if (maxDate < new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1)) {
				return false;
			}
			
			return $scope.currentDayIndex < $scope.days.length - 1;
		}
		
		$scope.isPreviousDay = function() {
			return $scope.currentDayIndex > 0;
		}
		
		$scope.nextDay = function() {
			if (!$scope.isNextDay()) {
				return;
			}
			
			$scope.currentDayIndex++;
			$scope.currentDay = $scope.days[$scope.currentDayIndex];
			$scope.slider.sliderValue = new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1);
		}
		
		$scope.previousDay = function() {
			if (!$scope.isPreviousDay()) {
				return;
			}
		
			$scope.currentDayIndex--;
			$scope.currentDay = $scope.days[$scope.currentDayIndex];
			$scope.slider.sliderValue = new Date(2014, $scope.currentMonthIndex, $scope.currentDayIndex + 1);
		}
	}
}}]);
