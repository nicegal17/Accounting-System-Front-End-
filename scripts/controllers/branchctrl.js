 'use strict';

 angular.module('accounting')
     .controller('branchctrl', function($scope, $filter, $window, BranchFactory, toastr, ngDialog, ngTableParams) {

          $scope.addNew = function() {
             $scope.isUpdate = false;
             $scope.branch = {};
             $scope.isDisable = false;
         };

         $scope.cancel = function() {
             $scope.branch = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;
         };

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchBranch = "";
         };

          $scope.saveBranch = function() {
             console.log('branch: ', $scope.branch);
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 branch: $scope.branch,
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 BranchFactory.updateBranch($scope.branch.brID, data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Update Branch Details');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             } else {
                 BranchFactory.createBranch(data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'New Branch');
                         } else {
                             toastr.success(data.msg, 'Error');
                         }
                     }
                 });
             }

             $scope.refresh();
             $scope.branch = {};
            
         };

         $scope.getBranchByID = function(id) {
             $scope.branch = {};
             $scope.isDisable = false;
             BranchFactory.getBranchByID(id).then(function(data) {
                 if (data.length > 0) {
                    $scope.branch = data[0];
                    console.log('branch: ', $scope.branch);
                    $scope.isUpdate = true;
                 }
             });
         };

         $scope.delBranch = function(id) {
             ngDialog.openConfirm({
                 templateUrl: 'templates/directives/delModal.html',
                 className: 'ngdialog-theme-default',
                 scope: $scope
             }).then(function() {
                 BranchFactory.deleteBranch(id).then(function(data) {
                     $scope.refresh();
                 });
                 console.log(id);
             });
         };

         $scope.$watch("searchBranch", function() {
             $scope.tableParams.reload();
         });

         function init() {
             $scope.branch = {};
             $scope.isDisable = true;

             $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     BranchFactory.getBranches().then(function(data) {
                         console.log('data: ', data);
                         var orderedData = {};

                         if ($scope.searchBranch) {
                             orderedData = $filter('filter')(data, $scope.searchBranch);
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
