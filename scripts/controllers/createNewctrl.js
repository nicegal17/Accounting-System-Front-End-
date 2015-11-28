 'use strict';

 angular.module('accounting')
     .controller('createNewctrl', function($scope, $filter, $modalInstance, $window, $stateParams, BranchFactory, toastr, ngDialog) {

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchUser = "";
         };

         

         $scope.cancel = function() {
             $scope.branch = {};
         };

        

         function init() {
             $scope.branch = {};
         }

         init();
     });
