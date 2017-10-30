'use strict';
// require.ensure(['./index.css'], function(require) {
//     var css = require('./index.css');
// }, 'inner/page1/page1-css');

module.exports = angular.module('app.inner', []).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state('inner', {
        url: '/inner',
        templateProvider: ['$q', function ($q) {
            var deferred = $q.defer();
            require.ensure(['./page1.html'], function (require) {
                var template = require('./page1.html');
                deferred.resolve(template);
            }, 'inner/page1/page1-tpl');
            return deferred.promise;
        }],
        controller: 'innerCtrl',
        controllerAs: 'vm',
        resolve: {
            'app.inner': ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./page1.js'], function (require) {
                    var mod = require('./page1.js');
                    $ocLazyLoad.load({
                        name: 'app.inner'
                    });
                    deferred.resolve(mod.controller);
                }, 'inner/page1/page1-ctl');
                return deferred.promise;
            }]
        }
    });
}]).name;