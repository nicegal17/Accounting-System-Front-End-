 'use strict';

 angular.module('accounting')
     .controller('userctrl', function($scope, $filter, UsersFactory, toastr, ngDialog, ngTableParams) {

         $scope.saveUser = function() {
             if ($scope.isUpdate === true) {
                 UsersFactory.updateUser($scope.user.userID, $scope.user).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Record Updated');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             } else {
                 UsersFactory.createUser($scope.user).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'New User Account');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             }

             $scope.user = {};
             $scope.refresh();

             $scope.isDisable = true;
         };

         $scope.addNew = function() {
             $scope.isUpdate = false;
             $scope.user = {};
             $scope.isDisable = false;
         };

         $scope.cancel = function() {
             $scope.user = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchUser = "";
         };

         $scope.$watch("searchUser", function() {
             $scope.tableParams.reload();
         });

         $scope.getIDUser = function(id) {
             $scope.user = {};
             $scope.isDisable = false;
             UsersFactory.getUserID(id).then(function(data) {
                 if (data.length > 0) {
                     $scope.user = data[0];
                     console.log('$scope.user: ', $scope.user);
                     $scope.isUpdate = true;
                 }
             });
         };

         function init() {
             $scope.users = {};
             $scope.user = {};
             $scope.empNames = {};
             $scope.isDisable = true;

             $scope.tableParams = new ngTableParams({
                 page: 1,
                 count: 5,
                 sorting: {
                     name: 'asc'
                 }
             }, {
                 getData: function($defer, params) {
                     UsersFactory.getAllUsers().then(function(data) {
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
