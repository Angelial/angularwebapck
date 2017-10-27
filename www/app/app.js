'use strict';
// require('../../node_modules/font-awesome/css/font-awesome.min.css');
var Promise = require('es6-promise').polyfill();

if (!window.Promise) {
    window.Promise = Promise;
}
var angular = require("angular");


require('require-ensure');
require('angular-bootstrap');
require('angular-ui-router');

var app = angular.module('app', [
        'ui.router',
        'ui.bootstrap',
        require('oclazyload'),
        require('./routing.js')
    ])
    .config(["$urlRouterProvider",function($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }]);
