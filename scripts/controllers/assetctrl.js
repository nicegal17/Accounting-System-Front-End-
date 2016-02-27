 'use strict';

 angular.module('accounting')
     .controller('assetctrl', function($scope, $filter, $window, AssetsFactory, toastr, ngDialog, ngTableParams) {

         $scope.today = function() {
             $scope.dt = new Date();
         };
         
         $scope.today();

         $scope.clear = function() {
             $scope.dt = null;
         };

         // Disable weekend selection
         $scope.disabled = function(date, mode) {
             return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
         };

         $scope.toggleMin = function() {
             $scope.minDate = $scope.minDate ? null : new Date();
         };
         $scope.toggleMin();

         $scope.open = function($event) {
             $event.preventDefault();
             $event.stopPropagation();

             $scope.opened = true;
         };

         $scope.dateOptions = {
             formatYear: 'yy',
             startingDay: 1
         };

         $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
         $scope.format = $scope.formats[0];

         var tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);
         var afterTomorrow = new Date();
         afterTomorrow.setDate(tomorrow.getDate() + 2);
         $scope.events = [{
             date: tomorrow,
             status: 'full'
         }, {
             date: afterTomorrow,
             status: 'partially'
         }];

         $scope.getDayClass = function(date, mode) {
             if (mode === 'day') {
                 var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                 for (var i = 0; i < $scope.events.length; i++) {
                     var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                     if (dayToCheck === currentDay) {
                         return $scope.events[i].status;
                     }
                 }
             }

             return '';
         };

         $scope.addNew = function() {
             $scope.asset = {};
             $scope.isUpdate = false;
             $scope.isDisable = false;
         };

         $scope.cancel = function() {
             $scope.asset = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;
         };

         $scope.$watch('searchAsset', function() {
             $scope.tableParams.reload();
         });

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchAsset = '';
         };

         $scope.getAssetItem = function(id) {
             $scope.asset = {};
             $scope.isDisable = false;
             AssetsFactory.getAssetID(id).then(function(data) {
                 if (_.isArray(data) && data.length > 0) {
                     $scope.asset = data[0];
                     $scope.asset.datePurchased = new Date(data[0].datePurchased);
                     $scope.asset.category = data[0].categoryID;
                     $scope.isUpdate = true;
                 }
             });
         };

         $scope.saveAssetItem = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 asset: $scope.asset,
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 AssetsFactory.updateFA($scope.asset.itemID, data).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Update Fixed Asset Item');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             } else {
                 AssetsFactory.createAsset(data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Create New Asset');
                         } else {
                             toastr.error(data.msg, 'Error');
                         }
                     }
                 });
             }

             $scope.asset = {};
             $scope.refresh();
             $scope.isDisable = true;
         };


         function init() {
             $scope.asset = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;

             /* jshint ignore:start */
             $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     AssetsFactory.getAssets().then(function(data) {
                         var orderedData = {};

                         if ($scope.searchAsset) {
                             orderedData = $filter('filter')(data, $scope.searchAsset);
                             orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                         } else {
                             orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                         }

                         params.total(data.length);
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                     });
                 }
             });
             /* jshint ignore:end */

             AssetsFactory.getCategories().then(function(data) {
                 $scope.categories = data;
                 $scope.asset.category = data[0].categoryID;
             });

             AssetsFactory.getPeriods().then(function(data) {
                 $scope.periods = data;
             });

         }

         init();

     });
