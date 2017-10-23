'use strict';
// require('../../node_modules/font-awesome/css/font-awesome.min.css');
require('es6-promise').polyfill();

if (!window.Promise) {
    window.Promise = Promise;
}
require('require-ensure');

require('angular-ui-router');
var angular = require("angular");

var app = angular.module('app', [
        "ui.router",
        require('oclazyload'),
        require('./routing.js')
    ])
    .config(["$urlRouterProvider",function($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }]);
