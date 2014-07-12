angular.module('MashAcademy')
.controller('DataCtrl', function ($scope, $http, $timeout) {
    
    $scope.temperatures = {
        "Perth": [
            ["2014-01-01", 10],
            ["2014-01-02", 20],
            ["2014-01-03", 30]
        ]
    };
    $scope.currentTemperature = function (city) {
        return $scope.temperatures[city].reduce(function (m, e) {
            if (m) return m;

            var date = Date.parse(e[0]);

            if (date.getTime() == $scope.sliderValue) {
                return e[1];
            }
        });
    };

    $scope.times = Object.keys($scope.temperatures).map(function (e) {
        return $scope.temperatures[e];
    }).reduce(function (joined, arr) {
        return joined.concat(arr);
    }, []).map(function (element) {
        return Date.parse(element[0]);
    });

    $scope.maxTime = $scope.times.reduce(toMax);
    $scope.minTime = $scope.times.reduce(toMin);

    function toMax(m, e) {
        return m > e ? m : e;
    }
    function toMin(m, e) {
        return m < e ? m : e;
    }
    function dateToMSecs(date) {
        return date.getTime();
    }

    $scope.toDate = function (msecs) {
        var date = new Date();
        date.setTime(msecs);
        return moment(date).format("YYYY MMM DD");
    };

    $scope.$watch('hasControl("Time")', function (hasTime) {
        $timeout(function () {
            $scope.fireResize();
        });
    });
});