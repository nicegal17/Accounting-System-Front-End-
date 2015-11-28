 'use strict';

 angular.module('accounting')
     .controller('subAcctctrl', function($scope, $filter, $window, SubAcctFactory, toastr, ngDialog, $modalInstance) {

         $scope.saveSubAccount = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 subaccount: $scope.subaccount,
                 userID: $scope.currentUser.userID
             };

             SubAcctFactory.createSubAccts(data).then(function(data) {
                if (!_.isEmpty(data)) {
                    if (data.success == 'true') {
                         toastr.success(data.msg, 'Creating New Sub Account');
                    } else {
                        toastr.error(data.msg  , 'Error');
                    }
                }  
             });

             $scope.subAccount = {};
         };

          $scope.cancel = function() {
             $scope.subAccount = {};
         };

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         function init() {
             $scope.subAccount = {};
             $scope.subAccounts = {};

             SubAcctFactory.getAccountTitles().then(function(data) {
                 $scope.acctTitles = data;
             });

             SubAcctFactory.getNorms().then(function(data) {
                 $scope.norms = data;
             });

             SubAcctFactory.getAcctTypes().then(function(data) {
                 $scope.acctTypes = data;
             });

             SubAcctFactory.getFunds().then(function(data) {
                 $scope.funds = data;
             });

             SubAcctFactory.getFinStatements().then(function(data) {
                 $scope.statements = data;
             });
         }

         init();
     });
