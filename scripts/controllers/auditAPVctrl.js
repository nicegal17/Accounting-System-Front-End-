 'use strict';

 angular.module('accounting')
     .controller('auditAPVctrl', function($scope, $filter, $modalInstance, $window, AuditAPVFactory, toastr) {

         $scope.auditAPV = function() {
             $scope.audit = {};
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         };

         $scope.cboAPV = function(apv) {
             var str = apv.split('--');
             $scope.audit.apvID = str[0];
             $scope.audit.sDate = str[1];
             $scope.audit.Particular = str[2];
             $scope.audit.APVNum = str[3];
             $scope.audit.userName = str[4];

             AuditAPVFactory.getAcctEntries($scope.audit.apvID).then(function(data) {
                 $scope.accnts = data;
                 console.log('entries: ', data);

             });
         };

         $scope.auditAPV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             AuditAPVFactory.auditAPV($scope.audit.apvID, data).then(function(data) {
                 console.log('data: ', data);
                 if (!_.isEmpty(data)) {
                    if (data.success === 'true') {
                         toastr.success(data.msg, 'Approve APV');
                    }else {
                        toastr.error(data.msg, 'Error');
                    }
                 }
             });
         };

         function init() {
             $scope.audit = {};
             $scope.entries = [];
             $scope.acctTitles = {};

             AuditAPVFactory.getAPV().then(function(data) {
                 $scope.apvs = data;
             });
         }

         init();
     });
