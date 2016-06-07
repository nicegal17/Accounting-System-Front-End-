 'use strict';

 angular.module('accounting')
     .controller('userctrl', function($scope, $filter, UsersFactory, toastr, ngDialog, ngTableParams) {

         $scope.saveUser = function() { 
             if ($scope.isUpdate === true) {
                 UsersFactory.updateUser($scope.user.userID, $scope.user).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Updating User Account');
                         } else {
                             toastr.error(data.msg, 'Error while updating user.');
                         }
                     }
                 });
             } else {
                 UsersFactory.createUser($scope.user).then(function(data) {
                    console.log('data', data);
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Creating New User Account');
                         } else {
                             toastr.error(data.msg, 'Error while saving new account.');
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
                     $scope.user.role = data[0].roleID;
                     $scope.user.employee = data[0].empID;
                     console.log('$scope.user: ', $scope.user);
                     $scope.isUpdate = true;
                 }
             });
         };

         function init() {
             $scope.user = {};
             $scope.isDisable = true;

             UsersFactory.getEmployees().then(function(data) {
                 $scope.employees = data;
                 $scope.user.employee = data[0].empID;
             });

             UsersFactory.getUserRoles().then(function(data) {
                 $scope.roles = data;
                 $scope.user.role = data[0].roleID;
             });

             // UsersFactory.getRolesPermission().then(function(data) {
             //     $scope.permissions = data;
             // });


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
