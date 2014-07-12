angular.module('MashAcademy')
.directive('toolbox', ['$rootScope', function($rootScope) {
  return {
	restrict: 'E',
	templateUrl: 'templates/toolbox.html',
	replace: false,
    scope: false,
	link: function($scope, $element, $attrs) {
	    $scope.controls = [

	    ];
	    $scope.data = [{
	        name: 'Weather',
	        icon: 'content/sun-clouds.png',
            type: 'dataset'
	    }, {
	        name: 'Temperature',
	        icon: 'content/degrees.gif',
            type: 'dataset'
	    }];

	    $scope.handleDragStart = function (e) {
	        console.log("handleDragStart");
	        this.style.opacity = '0.4';

	        var data;
	        if (this.id == "clock-icon") {
	            data = { name: "Time" };
	        } else if (this.id == "map-icon") {
	            data = { name: "Map" };
	        } else {
	            var name = $(this).attr('title');
	            data = $scope.data.reduce(function (m, e) { return e.name == name ? e : m; });
	        }

	        e.dataTransfer.setData('dragItem', JSON.stringify(data));
			
			$rootScope.showHelper = false;
	    };

	    $scope.handleDragEnd = function (e) {
	        console.log("handleDragEnd");
	        this.style.opacity = '1.0';
	    };
	}
  };
}]).directive('draggable', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element[0].addEventListener('dragstart', function () {
                console.log('dragstart');
				scope.$apply(function() {
					scope.handleDragStart.apply(this, arguments);
				});
            }, false);
            element[0].addEventListener('dragend', function () {
                console.log('dragend');
                scope.handleDragEnd.apply(this, arguments);
            }, false);
        }
    }
}).directive('droppable', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element[0].addEventListener('drop', function () {
                console.log('drop');
                scope.handleDrop.apply(this, arguments);
            }, false);
            element[0].addEventListener('dragover', function () {
                console.log('dragover');
                scope.handleDragOver.apply(this, arguments);
            }, false);
        }
    }
});