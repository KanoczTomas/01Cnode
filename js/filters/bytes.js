'use strict';

var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.filter('bytes', function() {
	return function(bytes, unit, precision) {
		if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 2;
		var units = ['bytes', 'kBi', 'MBi', 'GBi', 'TBi', 'PBi'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
            
        var h = (bytes / Math.pow(1024, Math.floor(number)))// 
        if(typeof unit !== 'undefined'){
            var unitIndex = units.indexOf(unit);
            if(unitIndex >= 0){
                if(unitIndex > number){//e.g. unit = MBi, we have 1024 bytes = 1kBi, we need to return 0.00 MBi for precision 2 so we have to devide by 1024 * the distance between indexes
                    h /= Math.pow(1024,unitIndex - number);
                }
                else if(unitIndex < number){//in this case we have to multiply
                    h *= Math.pow(1024, number - unitIndex);
                }
                number = unitIndex;//we have to change the unit index
            } 
        }
        if(number === 0) precision = 0;//number is equal to 0 if we have bytes. We want 123 bytes, not 123.00
        return h.toFixed(precision) +  ' ' + units[number];;
	}
});