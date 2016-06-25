 'use strict';

 angular.module('accounting')
     .controller('JVctrl', function($scope, $filter, $window, JVFactory, toastr, ngTableParams, $stateParams, ReportingService) {

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
                 console.log('$scope.totalDB: ', $scope.totalDB);
                 console.log('$scope.totalCR: ', $scope.totalCR);
             });
         };

         $scope.cancel = function() {
             $scope.JV = {};
             $scope.entries = '';
             $scope.totalDB = '';
             $scope.totalCR = '';
         };

         $scope.saveJVEntries = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 JV: $scope.JV,
                 entries: JSON.stringify($scope.entries),
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 JVFactory.updateJV($scope.JV.JID, data).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Updating Check Disbursement Voucher');
                         } else {
                             toastr.error(data.msg, 'Error while updating CDV.');
                         }
                     }
                 });
             } else {
                 JVFactory.createJV(data).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Journal Voucher Entry');
                         } else {
                             toastr.error(data.msg, 'Error while Creating New JV');
                         }
                     }
                 });
             }

             $scope.entries = '';
             $scope.JV = '';
             $scope.totalDB = '';
             $scope.totalCR = '';
         };

         $scope.approveJV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                   userID: $scope.currentUser.userID
             };
             JVFactory.approveJV($scope.entry.JID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Approving Journal Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Approving JV.');
                 }
             });
         };

         $scope.cancelJV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             JVFactory.cancelJV($scope.entry.JID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Cancel Journal Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Cancelling JV.');
                 }
             });
         };

         $scope.auditJV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             JVFactory.auditJV($scope.entry.JID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Audit Journal Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Auditing JV.');
                 }
             });
         };

         $scope.$watch("JVNum", function() {
             $scope.tableParams.reload();
         });

         // $scope.saveUser = function(data, id) {
         //     //$scope.user not updated yet
         //     angular.extend(data, { id: id });
         //     return $http.post('/saveUser', data);
         // };

         $scope.saveEntries = function() {
             $scope.inserted = {
                 id: $scope.users.length + 1,
                 name: '',
                 status: null,
                 group: null
             };
             $scope.entries.push($scope.inserted);
         };

         function init() {
             $scope.JV = {};
             $scope.entries = [];

             JVFactory.getAcctTitle().then(function(data) {
                 $scope.acctTitles = data;
             });

             if (!_.isUndefined($stateParams.id)) {
                 JVFactory.getJVDetails($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.entries = data;
                         $scope.JV = data[0];
                     }
                 });

                 JVFactory.previewJV($stateParams.id).then(function(data) {
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
                 JVFactory.getJVs().then(function(data) {
                     var orderedData = {};

                     if ($scope.JVNum) {
                         orderedData = $filter('filter')(data, $scope.JVNum);
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
