'use strict';
angular.module('accounting')
    .directive('header', function() {
        return {
            restrict: 'AE',
            templateUrl: 'templates/directives/header.html',
            restrict: 'E',
            replace: true,
            controller: 'headerCtrl'
        };
    });
