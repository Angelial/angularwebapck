'use strict';
console.log(134);

module.exports = angular.module('app.home', []).config(["$stateProvider",function($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateProvider:['$q', function($q) {
            var deferred = $q.defer();
            require.ensure(['./home.html'], function(require) {
                var template = require('./home.html');
                deferred.resolve(template);
            }, 'home/home-tpl');
            return deferred.promise;
        }],
        controller: 'homeCtrl',
        controllerAs: 'vm',
        resolve: {
            'app.home': ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./home.js'], function(require) {
                    var mod = require('./home.js');
                    $ocLazyLoad.load({
                        name: 'app.home'
                    });
                    deferred.resolve(mod.controller);
                }, 'home/home-ctl');
                return deferred.promise;
            }]
        }
    });
}]).name;
