 'use strict';

 angular.module('accounting')
     .controller('appAPVctrl', function($scope, $filter, appAPVFactory, toastr, ngDialog, ngTableParams, $modalInstance) {

        $scope.appApv = function() {
             $scope.appApv = {};
         };

        $scope.closeModal = function() {
             console.log('cancel');
             $modalInstance.close();
         }

         $scope.changeMeChange = function(apv) {
             var str = apv.split('--');
             $scope.appApv.apvID = str[0];
             $scope.appApv.sDate = str[1];
             $scope.appApv.Particular = str[2];
             $scope.appApv.JVNum = str[3];

             appAPVFactory.getAcctEntries($scope.appApv.apvID).then(function(data) {
                 $scope.accnts = data;
                 console.log(data);
             });
         }

         function init() {
             $scope.appApv = {};
             $scope.appApv.apvID = null;
             $scope.appApv.sDate = "";
             $scope.appApv.Particular = "";
             $scope.appApv.JVNum = "";
             $scope.entries = [];
             $scope.acctTitles = {};
            
             appAPVFactory.getAPVNo().then(function(data) {
                 $scope.apvs = data;
             });
         }

         init();
     });
