 'use strict';

 angular.module('accounting')
     .controller('ORctrl', function($scope, $filter, $modalInstance, $window, ORFactory, toastr) {

         $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         };

         $scope.cancel = function() {
             $scope.OR = {};
         };

         $scope.cboPayer = function(payer) {
             console.log('payer: ', payer);
             var str = payer.split('--');
             $scope.OR.brID = str[0];
             $scope.OR.Address = str[1];
         };

         $scope.saveOR = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 OR: $scope.OR,
                 userID: $scope.currentUser.userID
             };

             ORFactory.saveOR(data).then(function(data) {
                 console.log('data: ', data);
                 if (!_.isEmpty(data)) {
                    if(data.success === 'true') {
                        toastr.success(data.msg, 'OR Created');
                    } else {
                        toastr.error(data.msg, 'Error');
                    }
                 }
                 $scope.OR = '';
             });
         };

         function init() {
             $scope.OR = {};

             ORFactory.getPayer().then(function(data) {
                 $scope.payers = data;
             });
         }

         init();
     });
