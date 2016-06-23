 'use strict';

 angular.module('accounting')
     .controller('apvctrl', function($scope, $filter, $window, $stateParams, APVFactory, toastr, ngTableParams, ReportingService) {

         $scope.$watch("APVNum", function() {
             $scope.tableParams.reload();
         });

         $scope.addRow = function(row) {
             var DB, CR;

             var title = _.find($scope.acctTitles, {
                 'idAcctTitle': parseInt(row.acctTitle)
             });

             if (row.DB === undefined || row.DB === null) {
                 DB = 0;
             } else {
                 DB = row.DB;
             }

             if (row.CR === undefined || row.CR === null) {
                 CR = 0;
             } else {
                 CR = row.CR;
             }

             $scope.entries.push({
                 acctTitle: row.acctTitle,
                 title: title.acctTitle,
                 DB: DB,
                 CR: CR
             });
             $scope.entry = {};
             $scope.total();
         };

         $scope.removeRow = function(index) {
             $scope.entries.splice(index, 1);
         };

         $scope.total = function() {
             $scope.totalDB = 0;
             $scope.totalCR = 0;
             angular.forEach($scope.entries, function(entry) {
                 $scope.totalDB += entry.DB;
                 $scope.totalCR += entry.CR;
             });
         };

         $scope.saveAPVEntries = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 APV: $scope.APV,
                 entries: JSON.stringify($scope.entries),
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 APVFactory.updateAPV($scope.APV.apvID, data).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Updating Account Payable Voucher');
                         } else {
                             toastr.error(data.msg, 'Error while updating APV.');
                         }
                     }
                 });
             } else {
                 APVFactory.createAPV(data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Creating New Account Payable Voucher');
                         } else {
                             toastr.error(data.msg, 'Error while creating new APV.');
                         }
                     }
                 });
             }
             $scope.entries = "";
             $scope.APV = "";
             $scope.totalDB = "";
             $scope.totalCR = "";
         };

         $scope.cancel = function() {
             $scope.APV = {};
             $scope.entries = '';
             $scope.totalDB = '';
             $scope.totalCR = '';
         };

         $scope.approveAPV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             APVFactory.approveAPV($scope.entry.apvID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Approving Account Payable Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Approving APV.');
                 }
             });
         };

         $scope.cancelAPV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             APVFactory.cancelAPV($scope.entry.apvID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Cancelling Account Payable Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Cancelling APV.');
                 }
             });
         };

         $scope.auditAPV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             APVFactory.auditAPV($scope.entry.apvID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Auditing Account Payable Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Auditing APV.');
                 }
             });
         };

         function init() {
             $scope.APV = {};
             $scope.entries = [];
             $scope.isUpdate = false;

             APVFactory.getAcctTitles().then(function(data) {
                 $scope.acctTitles = data;
             });

             if (!_.isUndefined($stateParams.id)) {
                 APVFactory.getAPVDetails($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.entries = data;
                         $scope.entry = data[0];
                     }
                 });

                 APVFactory.previewAPV($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.preview = data[0];
                     }
                 });
             }
         }

         $scope.tableParams = new ngTableParams({
             page: 1, // show first page
             count: 10, // count per page
             sorting: {
                 name: 'asc' // initial sorting
             }
         }, {
             getData: function($defer, params) {
                 APVFactory.getAPV().then(function(data) {
                     var orderedData = {};

                     if ($scope.APVNum) {
                         orderedData = $filter('filter')(data, $scope.APVNum);
                         orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                     } else {
                         orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                     }

                     params.total(data.length);
                     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                 });
             }
         });

         init();

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };
     });
