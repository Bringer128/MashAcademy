angular.module('MashAcademy')
.directive('selected', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/selected.html',
        link: function ($scope, $element, $attrs) {
            $scope.selectedData = [{ name: 'Temperature' }, { name: 'Weather' }];

            $scope.selectedComponents = [{ name: 'Map' }, { name: 'Time' }];
        }
    };
}]);