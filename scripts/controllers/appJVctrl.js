 'use strict';

 angular.module('accounting')
     .controller('appJVctrl', function($scope, $filter, $modalInstance, $window, AppJVFactory, toastr) {

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
             console.log('data: ', data);
             AppJVFactory.approveJV($scope.appjv.JID, data).then(function(data) {
                 toastr.success('Journal Voucher has been approved', 'Approve JV');
             });
         };

         // $scope.denyJV = function() {
         //     AppJVFactory.denyJV($scope.appjv.JID, $scope.appjv).then(function(data) {
         //         console.log('data: ', data);
         //         toastr.success('Journal Voucher has been denied', 'Denied JV');
         //     });
         // };

         function init() {
             $scope.appjv = {};

             AppJVFactory.getJVNo().then(function(data) {
                 $scope.jvnums = data;
             });
         }

         init();
     });
