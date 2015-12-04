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

         function init() {
             $scope.appjv = {};

             AppJVFactory.getJVNo().then(function(data) {
                 $scope.jvnums = data;
             });
         }

         init();
     });
