 /*jslint camelcase:false*/

 'use strict';

 angular.module('accounting')
     .controller('accountctrl', function($scope, $filter, $window, AccountFactory, toastr, ngDialog, ngTableParams, ReportingService) {

         $scope.saveAccount = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 account: $scope.account,
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 AccountFactory.updateAccount($scope.account.idAcctTitle, data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Updating Data');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             } else {
                 AccountFactory.createAccount(data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Create New Account Title');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             }

             $scope.refresh();
         };

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchAcctChart = '';
         };

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };

         // $scope.accountType;
         // $scope.types = [{
         //    id: 1,
         //    name: 'With Sub Account'
         // }, {
         //    id: 0,
         //    name: 'Without Sub Account'
         // }];

         // console.log('value', $scope.Account);

         $scope.$watch('searchAcctChart', function() {
             $scope.tableParams.reload();
         });

         $scope.addNew = function() {
             $scope.isUpdate = false;
             $scope.account = {};
             $scope.isDisable = false;
         };

         $scope.cancel = function() {
             $scope.account = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;
         };

         $scope.getAcctChartByID = function(id) {
             $scope.account = {};
             $scope.isDisable = false;
             AccountFactory.getAcctChartByID(id).then(function(data) {
                 if (data.length > 0) {
                     $scope.account = data[0];
                     $scope.account.fund = data[0].fundID;
                     $scope.account.acctType = data[0].acctTypeID;
                     $scope.account.norm = data[0].normsID;
                     $scope.account.finStatement = data[0].FSID;
                     console.log('account: ', $scope.account);
                     $scope.isUpdate = true;
                 }
             });
         };


         function init() {
             $scope.account = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;

             AccountFactory.getFunds().then(function(data) {
                 $scope.funds = data;
             });

             AccountFactory.getAcctTypes().then(function(data) {
                 $scope.acctTypes = data;
             });

             AccountFactory.getNorms().then(function(data) {
                 $scope.norms = data;
             });

             AccountFactory.getFS().then(function(data) {
                 $scope.finStatements = data;
             });

             /* jshint ignore:start */
             $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     AccountFactory.getAccountChart().then(function(data) {
                         var orderedData = {};

                         if ($scope.searchAcctChart) {
                             orderedData = $filter('filter')(data, $scope.searchAcctChart);
                             orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                         } else {
                             orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                         }

                         params.total(data.length);
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                     });
                 }
             });
         }

         init();
     });
