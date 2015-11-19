 'use strict';

 angular.module('accounting')
     .controller('branchctrl', function($scope, $filter, $modal, BranchFactory, toastr, ngDialog, ngTableParams) {

         $scope.createNewBranch = function(id) {
             var modalInstance = $modal.open({
                 animation: true,
                 templateUrl: '/templates/modals/newBranch.html',
                 controller: 'createNewctrl',
                 size: 'md'
             });

             BranchFactory.getBranchByID(id).then(function(data) {
                 if (data.length > 0) {
                     $scope.branch = data[0];
                     $scope.isUpdate = true;
                 }
             });
         };

         $scope.getBRID = function(id) {
             $scope.branch = {};
             $scope.isDisable = false;
             
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

         $scope.$watch("searchUser", function() {
             $scope.tableParams.reload();
         });

         function init() {
             $scope.branch = {};

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

                         if ($scope.searchUser) {
                             orderedData = $filter('filter')(data, $scope.searchUser);
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
