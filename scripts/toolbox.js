angular.module('MashAcademy')
.directive('toolbox', [function() {
  return {
	restrict: 'E',
	templateUrl: 'templates/toolbox.html',
	replace: false,
    scope: false,
	link: function($scope, $element, $attrs) {
	    $scope.controls = [

	    ];
	    $scope.data = [{
	        name: 'weather',
            icon: 'content/sun-clouds.png'
	    }, {
	        name: 'temperature',
            icon: 'content/degrees.gif'
	    }];
	}
  };
}]);
