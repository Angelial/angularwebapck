'use strict';

module.exports = angular.module('app.controllers', [
    require('../view/home/_service.js'),
    require('../view/main/_service.js'),
    require('../view/inner/page1/router')
]).name;
