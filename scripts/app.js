var mashAcademy = angular.module('MashAcademy', ['vr.directives.slider'])
.controller('MashAcademy', function($scope) {
	$scope.questions = [
		//{ question:  }
	];
})
.run(function ($rootScope) {
    $rootScope.fireResize = function () {
        $rootScope.$broadcast('resize');
    };

    $(window).resize(function () {
        $rootScope.fireResize();
    });
});