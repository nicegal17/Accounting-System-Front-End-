 'use strict';

 angular.module('accounting')
     .controller('auditCDVctrl', function($scope, $filter, $modalInstance, AuditCDVFactory, toastr, ngDialog) {

         $scope.auditCDV = function() {
             $scope.audit = {};
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         $scope.cboCDV = function(cdv) {
             var str = cdv.split('--');
             $scope.audit.CDVNo = str[0];
             $scope.audit.sDate = str[1];
             $scope.audit.Particular = str[2];
             $scope.audit.CDVNum = str[3];
             $scope.audit.userName = str[4];

             AuditCDVFactory.getAcctEntries($scope.audit.CDVNo).then(function(data) {
                 $scope.accnts = data;
                 console.log('entries: ', data);

             });
         }

         $scope.auditCDV = function() {
                 AuditCDVFactory.auditCDV($scope.audit.CDVNo, $scope.audit).then(function(data) {
                     console.log('data: ', data);
                     toastr.success('Check Disbursement Voucher has been audited', 'Audit CDV');
                 });
         };

         function init() {
             $scope.audit = {};
             $scope.entries = [];
             $scope.acctTitles = {};

             AuditCDVFactory.getCDVNo().then(function(data) {
                 $scope.cdvs = data;
             });
         }

         init();
     });
