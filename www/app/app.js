'use strict';
// require('../../node_modules/font-awesome/css/font-awesome.min.css');
require('es6-promise/auto');
require('require-ensure');

require("angularjs-ie8-build");

require('angular-ui-router');
var angular = require("angular");

var app = angular.module('app', [
        "ui.router",
        require('oclazyload'),
        require('./routing.js'),
    ])
    .config(["$urlRouterProvider",function($urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    }]);
