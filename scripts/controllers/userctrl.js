 'use strict';

 angular.module('accounting')
     .controller('userctrl', function($scope, $filter, UsersFactory, toastr, ngDialog, ngTableParams, $modalInstance) {

         $scope.saveUser = function() {
             if ($scope.isUpdate === true) {
                 UsersFactory.updateUser($scope.user.userID, $scope.user).then(function(data) {
                    console.log('data: ', data);
                     toastr.success('User Account has been updated', 'Record Updated');
                 });
             } else {
                 UsersFactory.createUser($scope.user).then(function(data) {
                     toastr.success('New user has been successfully created', 'New User Account');
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

         $scope.delUser = function(id) {
             ngDialog.openConfirm({
                 templateUrl: 'templates/directives/delModal.html',
                 className: 'ngdialog-theme-default',
                 scope: $scope
             }).then(function() {
                 UsersFactory.deleteUser(id).then(function(data) {
                     $scope.refresh();
                 });
                 console.log(id);
             });

         };

         function init() {
             $scope.users = {};
             $scope.user = {};
             $scope.empNames = {};
             $scope.isDisable = true;

             UsersFactory.getEmployee().then(function(data) {
                 $scope.empNames = data;

                 // $scope.user.empName = 3;
                 //  console.log($scope.user.empName);

             });

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
