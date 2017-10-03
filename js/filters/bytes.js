'use strict';

var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.filter('bytes', function() {
    //usage:
    //if no unit given, bibytes are used, e.g. 1kiB = 1024bytes
    //if unit is bytes || [kMGTP]iB the respected bibyte unit is used only
    //if unit is bytes.dynamic the closest unit is returned, e.g. 2048 would be 2kiB
    //if unit is SIbytes || [kMGTP]B the respected byte unit is used only (1000 based)
    //if unit is SIbytes.dynamic the closes unit is returned e.g. 2048 would be 2.05kB
    //if unit is WU || [kmGTP]WU the respected unit is used only
    //if unit is WU.dynamic the closes unit is returned e.g. 2048 2.05kWU 
    
    
	return function filterBytes(bytes, unit, precision) {
		if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 2;
        var availableUnits = [
            {
                name: 'bibytes',
                matchRegexp: /^bytes(\.dynamic)?$|^[kMGTP]iB$/,//bytes.dynamic means it will find k M G T and so on automatically
                units: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'],
                base: 1024
            },
            {
                name: 'bytes',
                matchRegexp: /^SIbytes(\.dynamic)?$|^[kMGTP]B$/,
                units: ['SIbytes', 'kB', 'MB', 'GB', 'TB', 'PB'],//I know SIbytes is ugly, but use bytes if you want to show bytes and not SIbytes as input to the filter
                base: 1000
            },
            {
                name: 'weight',
                matchRegexp: /^WU(\.dynamic)?$|^[kMGTP]WU$/,
                units: ['WU', 'kWU', 'MWU', 'GWU', 'TWU', 'PWU'],
                base: 1000
            },
        ];
        //we will parse the unit argument for any regexp match and set units variable to 
        //abailableUnits.units
        //first match is assigned! so order of definition matters
        var base, units;
        function setDefaults(){
            var defaultUnit = availableUnits.filter(function (elm){
                return elm.name === 'bibytes';
            })[0];
            base = defaultUnit.base;
            units = defaultUnit.units;
            filterBytes.unitName = defaultUnit.name;
        }
        if(typeof unit !== 'undefined'){
            if(!availableUnits.some(function (availableUnit){
                if(availableUnit.matchRegexp.test(unit)) {
                    units = availableUnit.units;
                    base = availableUnit.base;
                    filterBytes.unitName = availableUnit.name;
                    return true;//we return true so that setDefaults() does not kick in
                }
            })) setDefaults();//if unit is set, but does not match the availableUnits use defaults
        }else {//we set the defaults in case unit is not given
            setDefaults();
        }
        var number = Math.floor(Math.log(bytes) / Math.log(base));
        
        //we check for dynamics "property" - i test passes 1025 bytes will be 1.00 kBi or 1.025 kB ... and so on
        if(/\.dynamic/.test(unit)) unit = undefined;
    
        var h = (bytes / Math.pow(base, Math.floor(number)))// 
        if(typeof unit !== 'undefined'){
            var unitIndex = units.indexOf(unit);
            if(unitIndex >= 0){
                if(unitIndex > number){//e.g. unit = MBi, we have 1024 bytes = 1kBi, we need to return 0.00 MBi for precision 2 so we have to devide by 1024 * the distance between indexes
                    h /= Math.pow(base,unitIndex - number);
                }
                else if(unitIndex < number){//in this case we have to multiply
                    h *= Math.pow(base, number - unitIndex);
                }
                number = unitIndex;//we have to change the unit index
            } 
        }
        if(number === 0) precision = 0;//number is equal to 0 if we have bytes. We want 123 bytes, not 123.00
        if(filterBytes.unitName === 'bytes') units[0] = 'B';//we must set the units to bytes instead of the ugly SIbytes
        return h.toFixed(precision) +  ' ' + units[number];;
	}
});