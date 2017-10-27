'use strict';
module.exports = angular.module('app.main', []).config(["$stateProvider",function($stateProvider) {
    $stateProvider.state('main', {
        url: '/main',
        templateProvider: ['$q',function($q) {
            var deferred = $q.defer();
            require.ensure(['./main.html'], function(require) {
                var template = require('./main.html');
                deferred.resolve(template);
            }, 'main/main-tpl');
            return deferred.promise;
        }],
        controller: 'mainCtrl',
        controllerAs: 'vm',
        resolve: {
            'app.main': ['$q', '$ocLazyLoad',function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./main.js'], function() {
                    var mod = require('./main.js');
                    $ocLazyLoad.load({
                        name: 'app.main'
                    });
                    deferred.resolve(mod.controller);
                }, 'main/main-ctl');
                return deferred.promise;
            }]
        }
    });
}]).name;
