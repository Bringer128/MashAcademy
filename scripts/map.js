angular.module('MashAcademy')
.directive('map', [function() {
  return {
	restrict: 'E',
	templateUrl: 'templates/map.html',
	replace: false,
    scope: false,
	link: function($scope, $element, $attrs) {
	
		var cities = [
			{ name: 'Sydney', latitude: -33.870, longitude: 151.210 },
			{ name: 'Melbourne', latitude: -37.810, longitude: 144.960 },
			{ name: 'Brisbane', latitude: -27.460, longitude: 153.020 },
			{ name: 'Perth', latitude: -31.960, longitude: 115.840 },
			{ name: 'Adelaide', latitude: -34.930, longitude: 138.600 },
			{ name: 'Hobart', latitude: -42.850, longitude: 147.290 }
		];
		
		d3.json('content/states.topojson.js', function(error, json) {
			if (error) return console.error(error);
			console.log(json);
			
			var feature = topojson.feature(json, json.objects.layer1);
			
			var width = $element.width(),
			height = $element.height();

			var svg = d3.select($element.find('svg').get(0))
				.attr("width", width)
				.attr("height", height);
				
			var path = d3.geo.path().projection(d3.geo.mercator());
			var svgPath = svg.append("path")
				.datum(feature)
				.attr('fill', 'white')
				.attr("d", path)
				
			var bounds = path.bounds(feature),
				dx = bounds[1][0] - bounds[0][0],
				dy = bounds[1][1] - bounds[0][1],
				x = (bounds[0][0] + bounds[1][0]) / 2,
				y = (bounds[0][1] + bounds[1][1]) / 2,
				scale = .9 / Math.max(dx / width, dy / height),
				translate = [width / 2 - scale * x, height / 2 - scale * y];
				
			svgPath.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
			
			cities.forEach(function(city) {
				
			});
		});
	}
  }}]);
