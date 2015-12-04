 'use strict';

 angular.module('accounting')
     .controller('appAPVctrl', function($scope, $filter, $modalInstance, $window, appAPVFactory, toastr) {

         $scope.approveAPV = function() {
             $scope.appApv = {};
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         $scope.cboAPV = function(apv) {
             var str = apv.split('--');
             $scope.appApv.apvID = str[0];
             $scope.appApv.sDate = str[1];
             $scope.appApv.Particular = str[2];
             $scope.appApv.APVNum = str[3];
             $scope.appApv.userName = str[4];

             appAPVFactory.getAcctEntries($scope.appApv.apvID).then(function(data) {
                 $scope.accnts = data;
             });
         };

         $scope.approveAPV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             console.log('data: ', data);
             appAPVFactory.approveAPV($scope.appApv.apvID, data).then(function(data) {
                 console.log('data: ', data);
                 if (!_.isEmpty(data)) {
                     if (data.success === 'true') {
                         toastr.success(data.msg, 'Approve APV');
                     } else {
                         toastr.error(data.msg, 'Error');
                     }
                 }
             });
         };

         function init() {
             $scope.appApv = {};
             $scope.entries = [];
             $scope.acctTitles = {};
             
             appAPVFactory.getAPVNo().then(function(data) {
                 $scope.apvs = data;
             });
         }

         init();
     });
