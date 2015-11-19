 'use strict';

 angular.module('accounting')
     .controller('createNewctrl', function($scope, $filter, $modalInstance, $window, BranchFactory, toastr, ngDialog) {

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchUser = "";
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         $scope.cancel = function() {
             $scope.branch = {};
         };

         $scope.saveBranch = function() {
             console.log('branch: ', $scope.branch);
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 branch: $scope.branch,
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 BranchFactory.updateBranch($scope.branch.brID, $scope.branch).then(function(data) {
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
                 BranchFactory.createBranch($scope.branch).then(function(data) {
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

             $scope.branch = {};
             $scope.refresh = {};
         };

         function init() {
             $scope.branch = {};
         }

         init();
     });
