 'use strict';

 angular.module('accounting')
     .controller('GJctrl', function($scope, $filter, $modalInstance, $window, GJFactory, toastr, ReportingService, AppJVFactory) {

         $scope.today = function() {
             $scope.dtFrom = new Date();
         };

         $scope.clear = function() {
             $scope.dtFrom = null;
         };

         $scope.disabled = function(date, mode) {
             return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
         };

         $scope.toggleMin = function() {
             $scope.minDate = $scope.minDate ? null : new Date();
         };
         $scope.toggleMin();

         $scope.open = function($event) {
             $event.preventDefault();
             $event.stopPropagation();

             $scope.opened = true;
         };

         $scope.getDayClass = function(date, mode) {
             if (mode === 'day') {
                 var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                 for (var i = 0; i < $scope.events.length; i++) {
                     var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                     if (dayToCheck === currentDay) {
                         return $scope.events[i].status;
                     }
                 }
             }

             return '';
         };

         $scope.dateParams = {
             From: $scope.dtFrom
                 // To: $scope.dtTo
         };

         AppJVFactory.getGJEntries($scope.dateParams).then(function(data) {
             if (data.length > 0) {
                 $scope.paramsDate = data;
                 // console.log('data', $scope.appjv.dtFrom);
             }
         });

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };

         function init() {

             $scope.dateOptions = {
                 formatYear: 'yy',
                 startingDay: 1
             };

             $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
             $scope.format = $scope.formats[0];

             var tomorrow = new Date();
             tomorrow.setDate(tomorrow.getDate() + 1);
             var afterTomorrow = new Date();
             afterTomorrow.setDate(tomorrow.getDate() + 2);
             $scope.events = [{
                 date: tomorrow,
                 status: 'full'
             }, {
                 date: afterTomorrow,
                 status: 'partially'
             }];
         }

         $scope.today();

         init();
     });
