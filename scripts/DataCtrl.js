angular.module('MashAcademy')
.controller('DataCtrl', function ($scope, $http, $timeout, dataService) {

    dataService.getRainfall();
    dataService.getMaxTemp();
    dataService.getMinTemp();
    dataService.getSolar().then(function (data) {
        $scope.datasets = data;

        $scope.times = Object.keys(data).map(function (e) { return parseInt(e); });
    });

    function toObjectWithNameEqual(name) {
        return function (m, e) {
            if (m) return m;
            if (e.name == name) return e;

            return null;
        };
    }

    function isWeatherSelected() {
        return $scope.selectedData && !!$scope.selectedData.reduce(toObjectWithNameEqual('Weather'), null);
    }
    function isTemperatureSelected() {
        return $scope.selectedData && !!$scope.selectedData.reduce(toObjectWithNameEqual('Temperature'), null);
    }
    $scope.currentValues = function () {
        if (!$scope.datasets) return null;
        if (!$scope.slider.sliderValue) return null;
        
        return $scope.datasets[$scope.slider.sliderValue.getTime()];
    }

    $scope.currentMin = function (name) {
        if (!isTemperatureSelected()) return;
        var currentValue = $scope.currentValues();
        if (!currentValue) return null;
        var minTemp = currentValue.MinTemp;
        if (!minTemp) return null;
        return minTemp[name];
    }

    $scope.currentMax = function (name) {
        if (!isTemperatureSelected()) return;
        var currentValue = $scope.currentValues();
        if (!currentValue) return null;
        var maxTemp = currentValue.MaxTemp;
        if (!maxTemp) return null;
        return maxTemp[name];
    }

    $scope.currentWeather = function (name) {
        if (!isWeatherSelected()) return;
        var currentValue = $scope.currentValues();
        if (!currentValue) return null;
        var weather = currentValue.Weather;
        if (!weather) return null;
        return weather[name];
    }

    $scope.$watch('times', function (times) {
        if (!times) return;
        $scope.maxTime = times.reduce(toMax);
        $scope.minTime = $scope.times.reduce(toMin);
    });

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
    var minTemp;
    var maxTemp;

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
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();
                    return !isNaN(msecs);
                });
                
                var result = dataset;
                records.forEach(function (row) {
                    var date = new Date(row[year], row[month] - 1, row[day]);
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
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();
                    return !isNaN(msecs);
                });

                var result = dataset;
                records.forEach(function (row) {
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();

                    result[msecs] = result[msecs] || {};
                    var datum = result[msecs];

                    datum.Weather = datum.Weather || {};

                    // Chained promises means datum.Rainfall is defined.
                    var rainyLocations = datum.Rainfall || {};
                    var weatherLocations = datum.Weather;
                    var location = nameMap[row[name]];

                    if (datum.Rainfall[location] > 2) {
                        weatherLocations[location] = "Raining";
                    } else {
                        weatherLocations[location] = row[sunny].indexOf("TRUE") >= 0 ? "Sunny" : "Cloudy";
                    }
                });

                return result;

            });
        },
        getMaxTemp: function () {
            return maxTemp = maxTemp || $http.get('Data/TotalMaxTemp.csv').then(function (response) {
                return response.data;
            }).then(function (csvString) {
                var records = csvString.split('\n');
                var fields = records.shift().split(',');

                var name = 0;
                var year = 1;
                var month = 2;
                var day = 3;
                var maxTemp = 4;

                records = records.map(function (row) { return row.split(','); });
                records = records.filter(function (row) {
                    return !isNaN(parseInt(row[maxTemp]));
                });
                records = records.filter(function (row) {
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();
                    return !isNaN(msecs);
                });

                var result = dataset;
                records.forEach(function (row) {
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();

                    result[msecs] = result[msecs] || {};
                    var datum = result[msecs];

                    datum.MaxTemp = datum.MaxTemp || {};

                    var locations = datum.MaxTemp;
                    var location = nameMap[row[name]];
                    locations[location] = row[maxTemp];
                });

                return result;

            });
        },
        getMinTemp: function () {
            return minTemp = minTemp || $http.get('Data/TotalMinTemp.csv').then(function (response) {
                return response.data;
            }).then(function (csvString) {
                var records = csvString.split('\n');
                var fields = records.shift().split(',');

                var name = 0;
                var year = 1;
                var month = 2;
                var day = 3;
                var minTemp = 4;

                records = records.map(function (row) { return row.split(','); });
                records = records.filter(function (row) {
                    return !isNaN(parseInt(row[minTemp]));
                });
                records = records.filter(function (row) {
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();
                    return !isNaN(msecs);
                });

                var result = dataset;
                records.forEach(function (row) {
                    var date = new Date(row[year], row[month] - 1, row[day]);
                    var msecs = date.getTime();

                    result[msecs] = result[msecs] || {};
                    var datum = result[msecs];

                    datum.MinTemp = datum.MinTemp || {};

                    var locations = datum.MinTemp;
                    var location = nameMap[row[name]];
                    locations[location] = row[minTemp];
                });

                return result;
            });
        },
    }
});