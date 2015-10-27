'use strict';
angular.module('accounting')
    .directive('sidebar', function($location) {
        return {
            templateUrl: 'templates/directives/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: 'sideBarCtrl'
        }
    });
