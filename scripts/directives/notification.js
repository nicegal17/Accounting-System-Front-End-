'use strict';
angular.module('accounting')
    .directive('notifications',function(){
        return {
        templateUrl:'templates/directives/notification.html',
        restrict: 'E',
        replace: true,
        }
    });
