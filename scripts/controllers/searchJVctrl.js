 'use strict';

 angular.module('accounting')
     .controller('searchJVctrl', function($scope, $filter, ngDialog, SearchJVFactory, $modalInstance, ReportingService) {

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         };

         $scope.changeMeChange = function(jv) {
             var str = jv.split('--');
             $scope.search.JID = str[0];
             // $scope.search.userName = str[1];

             SearchJVFactory.getJVDet($scope.search.JID).then(function(data) {
                 $scope.accnts = data;
             });

             SearchJVFactory.getDBEntries($scope.search.JID).then(function(data) {
                 $scope.debits = data;
             });

             SearchJVFactory.getCREntries($scope.search.JID).then(function(data) {
                 $scope.credits = data;
             });
         };

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };

         function init() {
             $scope.search = {};

             SearchJVFactory.getJVNo().then(function(data) {
                 $scope.jvs = data;
             });
         };

         init();
     });
