 'use strict';

 angular.module('accounting')
     .controller('auditJVctrl', function($scope, $filter, $modalInstance, $window, AuditJVFactory, toastr, ngDialog) {

         $scope.auditJV = function() {
             $scope.audit = {};
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         };

         $scope.cboJV = function(jv) {
             var str = jv.split('--');
             $scope.audit.JVNo = str[0];
             $scope.audit.sDate = str[1];
             $scope.audit.Particular = str[2];
             $scope.audit.JVNum = str[3];
             $scope.audit.userName = str[4];

             AuditJVFactory.getAcctEntries($scope.audit.JVNo).then(function(data) {
                 $scope.accnts = data;
                 console.log('entries: ', data);

             });
         };

         $scope.auditJV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             AuditJVFactory.auditJV($scope.audit.JVNo, data).then(function(data) {
                 console.log('data: ', data);
                 toastr.success('Journal Voucher has been audited', 'Audit JV');
             });

         };

         function init() {
             $scope.audit = {};
             $scope.entries = [];
             $scope.acctTitles = {};

             AuditJVFactory.getJVNo().then(function(data) {
                 $scope.jvs = data;
             });
         }

         init();
     });
