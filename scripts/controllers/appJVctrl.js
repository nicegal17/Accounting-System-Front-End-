 'use strict';

 angular.module('accounting')
     .controller('appJVctrl', function($scope, $filter, $modalInstance, $window, AppJVFactory, toastr) {

         $scope.today = function() {
             $scope.appjv.dtFrom = new Date();
             $scope.dtTo = new Date();
         }

         $scope.clear = function() {
             $scope.appjv.dtFrom = null;
             $scope.dtTo = null;
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

         $scope.approveJV = function() {
             $scope.appjv = {};
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         $scope.changeMeChange = function(jv) {
             var str = jv.split('--');
             $scope.appjv.JID = str[0];
             $scope.appjv.sDate = str[1];
             $scope.appjv.Particular = str[2];
             $scope.appjv.JVNum = str[3];
             $scope.appjv.userName = str[4];

             AppJVFactory.getAcctEntries($scope.appjv.JID).then(function(data) {
                 $scope.accnts = data;
             });
         };

         $scope.approveJV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };

             AppJVFactory.approveJV($scope.appjv.JID, data).then(function(data) {
                 if (!_.isEmpty(data)) {
                     if (data.success == 'true') {
                         toastr.success(data.msg, 'Approve JV');
                     } else {
                         toastr.error(data.msg, 'Error');
                     }
                 }
             });
         };


         $scope.dateParams = {
             From: $scope.appjv.dtFrom
                 // To: $scope.dtTo
         };

         AppJVFactory.getGJEntries($scope.dateParams).then(function(data) {
             if (data.length > 0) {
                 $scope.paramsDate = data;
                 console.log('data', $scope.appjv.dtFrom);
             }
         });

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };

         function init() {
             $scope.appjv = {};

             AppJVFactory.getJVNo().then(function(data) {
                 $scope.jvnums = data;
             });

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
