angular.module('MashAcademy')
.directive('map', [function() {
  return {
	restrict: 'E',
	templateUrl: 'templates/map.html',
	replace: false,
    scope: { 'simpleMap': '@' },
	link: function($scope, $element, $attrs) {
	
		var temperatureData = [
			{ name: 'Sydney', minTemp: 4, maxTemp: 32 },
			{ name: 'Melbourne', minTemp: 2, maxTemp: 32 },
			{ name: 'Brisbane', minTemp: 2, maxTemp: 32 },
			{ name: 'Perth', minTemp: 14, maxTemp: 39 },
			{ name: 'Adelaide', minTemp: 4, maxTemp: 38 },
			{ name: 'Hobart', minTemp: 7, maxTemp: 35 },
			{ name: 'Darwin', minTemp: 7, maxTemp: 28 },
			{ name: 'Cairns', minTemp: 8, maxTemp: 27 },
			{ name: 'Broome', minTemp: 6, maxTemp: 26 },
		]
	
		var weatherData = [
			{ name: 'Sydney', weather: 'Sunny' },
			{ name: 'Melbourne', weather: 'Cloudy' },
			{ name: 'Brisbane', weather: 'Cloudy' },
			{ name: 'Perth', weather: 'Raining' },
			{ name: 'Adelaide', weather: 'Sunny' },
			{ name: 'Hobart', weather: 'Cloudy' },
			{ name: 'Darwin', weather: 'Raining' },
			{ name: 'Cairns', weather: 'Sunny' },
			{ name: 'Broome', weather: 'Sunny' },
		]
	
		$scope.cities = [
			{ name: 'Sydney', latitude: -33.870, longitude: 151.210 },
			{ name: 'Melbourne', latitude: -37.810, longitude: 144.960 },
			{ name: 'Brisbane', latitude: -27.460, longitude: 153.020 },
			{ name: 'Perth', latitude: -31.960, longitude: 115.840 },
			{ name: 'Adelaide', latitude: -34.930, longitude: 138.600 },
			{ name: 'Hobart', latitude: -42.850, longitude: 147.290 },
			{ name: 'Darwin', latitude: -12.430, longitude: 130.850 },
			{ name: 'Cairns', latitude: -16.920, longitude: 145.750 },
			{ name: 'Broome', latitude: -17.9619, longitude: 122.2361 },
		];
		
		addDataToCities($scope.cities, weatherData);
		addDataToCities($scope.cities, temperatureData);
		
		function addDataToCities(cities, data) {
			data.forEach(function(datum) {
				var city = cities.filter(function(city) {
					return datum.name == city.name;
				})[0];
				
				$.extend(city, datum);
			});
		}
		
		d3.json('content/states.topojson.js', function(error, json) {
			if (error) return console.error(error);
			
			var feature = topojson.feature(json, json.objects.layer1);
			
			
			var width = $element.width(),
				height = $element.height();

			$element.find('svg').empty();
			var svg = d3.select($element.find('svg').get(0))
				.attr("width", width)
				.attr("height", height);
				
			var projection = d3.geo.mercator();
			var path = d3.geo.path().projection(projection);
			var group = svg.append("g");
			var svgPath = group.append("path")
				.attr('class', 'map-path')
				.datum(feature)
				.attr("d", path);
			
			resize();

			$scope.$on('resize', function () {
			    resize();
			});
				
			function resize() {
				$scope.$apply(function() {
					width = $element.width(),
					height = $element.height();
					
					svg
						.attr("width", width)
						.attr("height", height);
					
					var bounds = path.bounds(feature);
					var dx = bounds[1][0] - bounds[0][0];
					var dy = bounds[1][1] - bounds[0][1];
					var x = (bounds[0][0] + bounds[1][0]) / 2;
					var y = (bounds[0][1] + bounds[1][1]) / 2;
					$scope.scale = .9 / Math.max(dx / width, dy / height);
					var translate = [width / 2 - $scope.scale * x, height / 2 - $scope.scale * y];
						
					group.attr("transform", "translate(" + translate + ")scale(" + $scope.scale + ")");
					
					group.selectAll('.city-circle').remove();
					$scope.cities.forEach(function(city) {
						var location = projection([city.longitude, city.latitude]);
						city.top = location[1] * $scope.scale + translate[1];
						city.left = location[0] * $scope.scale + translate[0];
						
						group.append('circle')
							.attr('class', 'city-circle')
							.attr('cx', location[0])
							.attr('cy', location[1])
							.attr('r', 8 / $scope.scale)
							.attr('fill', 'black')
							
						group.append('circle')
							.attr('class', 'city-circle')
							.attr('cx', location[0])
							.attr('cy', location[1])
							.attr('r', 6 / $scope.scale)
							.attr('fill', 'white')
					});
				});
			}
		});
	}
  }}]);
