const jsdom = require('jsdom')
const {JSDOM} = jsdom;


global.document = new JSDOM('<html><head><script></script></head><body></body></html>');
global.window = global.document.window;
global.navigator = window.navigator = {};
global.Node = window.Node;

global.window.mocha = {};
global.window.beforeEach = beforeEach;
global.window.afterEach = afterEach;

require('angular/angular');
require('angular-mocks/angular-mocks');

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;
