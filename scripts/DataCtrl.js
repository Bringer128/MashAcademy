angular.module('MashAcademy')
.controller('DataCtrl', function ($scope, $http, $timeout, dataService) {
    dataService.getRainfall();
    dataService.getSolar().then(function (data) { $scope.datasets = data;});

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
})
.factory('dataService', function ($http) {
    
    var nameMap = {
        '9021': 'Perth',
        '3003': 'Broome',
        '14015': 'Darwin',
        '31011': 'Cairns',
        '40913': 'Brisbane',
        '66037': 'Sydney',
        '86282': 'Melbourne',
        '23034': 'Adelaide',
        '94029': 'Hobart'
    };

    var dataset = {};
    var rainfall;
    var solar;

    return {
        getRainfall: function () {
            return rainfall = rainfall || $http.get('Data/TotalRain.csv').then(function (response) {
                return response.data;
            }).then(function (csvString) {
                var records = csvString.split('\n');
                var fields = records.shift().split(',');

                var name = 0;
                var year = 1;
                var month = 2;
                var day = 3;
                var rain = 4;

                records = records.map(function (row) { return row.split(','); });
                records = records.filter(function (row) { return !isNaN(parseInt(row[rain])); });
                records = records.filter(function (row) {
                    var date = new Date(row[year], row[month], row[day]);
                    var msecs = date.getTime();
                    return !isNaN(msecs);
                });
                
                var result = dataset;
                records.forEach(function (row) {
                    var date = new Date(row[year], row[month], row[day]);
                    var msecs = date.getTime();

                    result[msecs] = result[msecs] || {};
                    var datum = result[msecs];

                    datum.Rainfall = datum.Rainfall || {};
                    
                    var locations = datum.Rainfall;
                    locations[nameMap[row[name]]] = row[rain];
                });

                return result;
            });
        },
        getSolar: function () {
            return solar = solar || $http.get('Data/TotalSolar.csv').then(function (response) {
                return response.data;
            }).then(function (csvString) {
                var records = csvString.split('\n');
                var fields = records.shift().split(',');

                var name = 0;
                var year = 1;
                var month = 2;
                var day = 3;
                var sunny = 5;

                records = records.map(function (row) { return row.split(','); });
                records = records.filter(function (row) {
                    return row[sunny] && (row[sunny].indexOf("TRUE") >= 0 || row[sunny].indexOf("FALSE") >= 0);
                });
                records = records.filter(function (row) {
                    var date = new Date(row[year], row[month], row[day]);
                    var msecs = date.getTime();
                    return !isNaN(msecs);
                });

                var result = dataset;
                records.forEach(function (row) {
                    var date = new Date(row[year], row[month], row[day]);
                    var msecs = date.getTime();

                    result[msecs] = result[msecs] || {};
                    var datum = result[msecs];

                    datum.Weather = datum.Weather || {};

                    // Chained promises means datum.Rainfall is defined.
                    var rainyLocations = datum.Rainfall || {};
                    var weatherLocations = datum.Weather;
                    var location = nameMap[row[name]];

                    if (datum.Rainfall[location] > 2) {
                        weatherLocations[location] = "Rainy";
                    } else {
                        weatherLocations[location] = row[sunny].indexOf("TRUE") >= 0 ? "Sunny" : "Cloudy";
                    }
                });

                return result;

            });
        }
    }
});