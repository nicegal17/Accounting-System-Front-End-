 'use strict';

 angular.module('accounting')
     .controller('podetailsctrl', function($scope, $stateParams, $filter, $window, PODetFactory, toastr) {

         if (!_.isUndefined($stateParams.id)) {
             PODetFactory.getPoDetails($stateParams.id).then(function(data) {
                 if (data.length > 0) {
                     console.log('data', data);
                     $scope.poDetails = data;
                 }
             });

             PODetFactory.getPOItems($stateParams.id).then(function(data) {
                 if (data.length > 0) {
                     console.log('poItems', data);
                     $scope.poItems = data;
                 }
             });

             PODetFactory.selectSUM($stateParams.id).then(function(data) {
                 if (data.length > 0) {
                     $scope.sums = data;
                 }
             });
         }

         $scope.approvePO = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             console.log('data: ', data);
             PODetFactory.approvePO($stateParams.id, data).then(function(data) {
                 console.log('data: ', data);
                 if (!_.isEmpty(data)) {
                     if (data.success == 'true') {
                         toastr.success(data.msg, 'Approve PO');
                     } else {
                         toastr.error(data.msg, 'Error');
                     }
                 }
             });
         };
     });
