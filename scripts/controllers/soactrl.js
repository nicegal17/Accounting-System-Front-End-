'use strict';

angular.module('accounting')
    .controller('soactrl', function($scope, $stateParams, $filter, $window, SOAFactory, toaster, ReportingService) {

        if (!_.isUndefined($stateParams.id)) {
            SOAFactory.getInfo($stateParams.id).then(function(data) {
                if (data.length > 0) {
                    $scope.soaDetails = data;
                }
            });
        }
    })