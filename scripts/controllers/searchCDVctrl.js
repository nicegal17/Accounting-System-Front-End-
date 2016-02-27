 'use strict';

 angular.module('accounting')
     .controller('searchCDVctrl', function($scope, $filter, $modalInstance, SearchCDVFactory, ngDialog, ReportingService) {

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         };

         $scope.changeMeChange = function(cdv) {
             console.log('cdv: ', cdv);
             var str = cdv.split('--');
             $scope.search.CDVNo = str[0];
             // $scope.search.userName = str[1];

             SearchCDVFactory.getCDVDet($scope.search.CDVNo).then(function(data) {
                 $scope.accnts = data;
             });

             SearchCDVFactory.getDBEntries($scope.search.CDVNo).then(function(data) {
                 $scope.debits = data;
             });

             SearchCDVFactory.getCREntries($scope.search.CDVNo).then(function(data) {
                 $scope.credits = data;
             });

             SearchCDVFactory.getDBSum($scope.search.CDVNo).then(function(data) {
                 $scope.sums = data;
             });
         };

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };

         function init() {
             $scope.search = {};

             SearchCDVFactory.getCDVNo().then(function(data) {
                 $scope.IDs = data;
             });
         }

         init();
     });
