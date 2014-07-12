angular.module('MashAcademy')
.directive('selected', [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/selected.html',
        scope: false,
        link: function ($scope, $element, $attrs) {
            $scope.selectedData = [];

            $scope.selectedComponents = [];

            $scope.dataDrop = function ($data) {
                selectedData.push($data);
            }
            $scope.controlDrop = function ($data) {
                selectedComponents.push($data);
            }

            $scope.handleDrop = function (e) {
                console.log("handleDrop");
                e.preventDefault();
                e.stopPropagation();
                var dataText = e.dataTransfer.getData('dragItem');
                var data = JSON.parse(dataText);

                $scope.$apply(function () {
                    if (data.type == 'dataset') {
                        if($scope.selectedData.filter(function(e) { return data.name == e.name;}).length == 0) $scope.selectedData.push(data);
                    } else if($scope.selectedComponents.filter(function(e) { return e.name == data.name; }).length == 0) {
                        $scope.selectedComponents.push(data);
                    }
                });
            };

            $scope.handleDragOver = function (e) {
                console.log("handleDragOver");
                e.preventDefault(); // Necessary. Allows us to drop.
                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            };
        }
    };
}]);