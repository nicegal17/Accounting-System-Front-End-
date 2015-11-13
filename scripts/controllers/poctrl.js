 'use strict';

 angular.module('accounting')
     .controller('poctrl', function($scope, $filter, $window, POFactory, toastr, ngTableParams) {

         $scope.cboBank = function(bank) {
             var str = bank.split('--');
             $scope.PO.bankID = str[0];
             $scope.PO.acctNum = str[1];
         };

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.POSearch = "";
         };

         $scope.addRow = function(row) {
             var qty, Items, unitPrice, total;

             var unitType = _.find($scope.units, {
                 'unitID': parseInt(row.unit)
             });

             qty = row.qty;
             Items = row.Items;
             unitPrice = row.unitPrice;
             total = row.total;

             $scope.entries.push({
                 unit: row.unit,
                 unitType: unitType.unit,
                 Items: Items,
                 qty: qty,
                 unitPrice: unitPrice,
                 total: total

             });

             $scope.entry = {};
             $scope.total();
         };

         $scope.removeRow = function(index) {
             $scope.entries.splice(index, 1);
         };

         $scope.total = function() {
             $scope.totalAmount = 0;
             angular.forEach($scope.entries, function(entry) {
                 $scope.totalAmount += entry.total;
                 console.log('$scope.totalAmount: ', $scope.totalAmount);
             });
         };

         $scope.$watch("POSearch", function() {
             $scope.tableParams.reload();
         });

         $scope.savePOEntries = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             // console.log('po: ', $scope.PO);
             // console.log('po: ', JSON.stringify($scope.entries));
             var data = {
                 PO: $scope.PO,
                 entries: JSON.stringify($scope.entries),
                 userID: $scope.currentUser.userID
             }; 
             
             POFactory.createPO(data).then(function(res) {
                 if (!_.isEmpty(data)) {
                     if (data.success == 'true') {
                         toastr.success(data.msg, 'PO Created');
                     } else {
                         toastr.error(data.msg, 'Error');
                     }
                 }

                 $scope.entries = "";
                 $scope.PO = "";
                 $scope.total = "";
                 $scope.refresh();
             });
         };

         function init() {
             $scope.PO = {};
             $scope.units = {};
             $scope.entries = [];
             $scope.entry = {};

             $scope.PO.bankID = null;
             $scope.PO.bankName = "";

             $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     POFactory.getPOLists().then(function(data) {
                         console.log('data: ', data);
                         var orderedData = {};

                         if ($scope.POSearch) {
                             orderedData = $filter('filter')(data, $scope.POSearch);
                             orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                         } else {
                             orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                         }

                         params.total(data.length);
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                     });
                 }
             });

             POFactory.getSupplier().then(function(data) {
                 $scope.suppliers = data;
             });

             POFactory.getBranch().then(function(data) {
                 $scope.branches = data;
             });

             POFactory.getBank().then(function(data) {
                 $scope.banks = data;
             });

             POFactory.getBranchNames().then(function(data) {
                 $scope.brNames = data;
             });

             POFactory.getUnit().then(function(data) {
                 $scope.units = data;
             });

             POFactory.getSupplier2().then(function(data) {
                 $scope.payees = data;
             });

             POFactory.getMOP().then(function(data) {
                 $scope.mops = data;
             });
         }

         init();
     });
