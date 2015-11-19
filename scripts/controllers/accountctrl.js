 'use strict';

 angular.module('accounting')
     .controller('accountctrl', function($scope, $filter, AccountFactory, toastr, ngDialog, ngTableParams) {

         $scope.saveAccount = function() {
             if ($scope.isUpdate === true) {
                 AccountFactory.updateAccount($scope.account.acctTypeID, $scope.account).then(function(data) {
                     console.log('data: ', data);
                     toastr.success('Record Successfully Updated', 'Update Record');
                     $scope.refresh();
                 });
             } else {
                 AccountFactory.createAccount($scope.account).then(function(data) {
                     console.log('data: ', data);
                     toastr.success('Record Successfully Created', 'Record Created');
                     $scope.refresh();
                 });
             }
         };

         $scope.Account = {
             name: 'Account'
         };

         $scope.AccountVal = {
             "valID": "1",
             "value": "With Sub Account"
         };

         $scope.$watch("searchAcctChart", function() {
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

         function init() {
             $scope.Account = {};
             $scope.funds = {};
             $scope.acctTypes = {};
             $scope.norms = {};
             $scope.finStatements = {};
             $scope.withSubAcct = false;
             $scope.noSubAcct = false;
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
