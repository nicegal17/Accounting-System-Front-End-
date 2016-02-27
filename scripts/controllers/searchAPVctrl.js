 'use strict';

 angular.module('accounting')
     .controller('searchAPVctrl', function($scope, $filter, searchAPVFactory, ngDialog, $modalInstance, ReportingService) {

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         };

         $scope.cboAPV = function(apv) {
             var str = apv.split('--');
             $scope.search.apvID = str[0];

             searchAPVFactory.getAPVDet($scope.search.apvID).then(function(data) {
                 $scope.accnts = data;
             });

             searchAPVFactory.getDBEntries($scope.search.apvID).then(function(data) {
                 $scope.debits = data;
             });

             searchAPVFactory.getCREntries($scope.search.apvID).then(function(data) {
                 $scope.credits = data;
             });
         };

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };

         function init() {
             $scope.search = {};
             $scope.entries = [];
             $scope.acctTitles = {};

             searchAPVFactory.getAPVNo().then(function(data) {
                 $scope.apvs = data;
             });
         }

         init();
     });
