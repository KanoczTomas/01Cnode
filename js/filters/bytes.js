'use strict';

var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.filter('bytes', function() {
	return function(bytes, precision) {
		if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 2;
		var units = ['bytes', 'kBi', 'MBi', 'GBi', 'TBi', 'PBi'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
});