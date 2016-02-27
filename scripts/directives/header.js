'use strict';

angular.module('accounting')
    .directive('header', function() {
        return {
            restrict: 'AE',
            templateUrl: 'templates/directives/header.html',
            replace: true,
            controller: 'headerCtrl'
        };
    });
