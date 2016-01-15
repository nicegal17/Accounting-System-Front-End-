'use strict';

 angular.module('accounting')
     .controller('soactrl', function($scope, $stateParams, $filter, $window, SOAFactory, toastr, ReportingService) {

         if (!_.isUndefined($stateParams.id)) {
             SOAFactory.getPoDetails($stateParams.id).then(function(data) {
                 if (data.length > 0) {
                     $scope.soaDetails = data;
                 }
             });
         }
       
         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };
     });
