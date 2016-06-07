 'use strict';

 angular.module('accounting')
     .controller('cdvctrl', function($scope, $filter, $window, CDVFactory, toastr, ngTableParams) {

         $scope.cboBank = function(bank) {
             var str = bank.split('--');
             $scope.CDV.bankID = str[0];
             $scope.CDV.acctNum = str[1];
         };

         $scope.today = function() {
             $scope.dt = new Date();
         }

         $scope.clear = function() {
             $scope.dt = null;
         };

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

         $scope.addRow = function(row) {
             var DB, CR;

             var title = _.find($scope.acctTitles, {
                 'idAcctTitle': parseInt(row.acctTitle)
             });

             if (row.DB === undefined || row.DB === null) {
                 DB = 0;
             } else {
                 DB = row.DB;
             }

             if (row.CR === undefined || row.CR === null) {
                 CR = 0;
             } else {
                 CR = row.CR;
             }

             $scope.entries.push({
                 acctTitle: row.acctTitle,
                 title: title.acctTitle,
                 DB: DB,
                 CR: CR
             });
             $scope.entry = {};
             $scope.total();
         };

         $scope.removeRow = function(index) {
             $scope.entries.splice(index, 1);
         };

         $scope.total = function() {
             $scope.totalDB = 0;
             $scope.totalCR = 0;
             angular.forEach($scope.entries, function(entry) {
                 $scope.totalDB += entry.DB;
                 $scope.totalCR += entry.CR;
                 console.log('$scope.totalDB: ', $scope.totalDB);
                 console.log('$scope.totalCR: ', $scope.totalCR);
             });
         };

         $scope.saveCDVEntries = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             console.log('user: ', $scope.currentUser.userID);
             console.log('cdv: ', $scope.CDV);
             console.log('cdv: ', JSON.stringify($scope.entries));
             var data = {
                 CDV: $scope.CDV,
                 entries: JSON.stringify($scope.entries),
                 userID: $scope.currentUser.userID
             };
             console.log('data: ', data);
             CDVFactory.createCDV(data).then(function(res) {
                 toastr.success('Check Disbursement Voucher has been Created', 'CDV Created');
                 $scope.entries = "";
                 $scope.CDV = "";
                 $scope.totalDB = "";
                 $scope.totalCR = "";
             });
         };

         function init() {
             $scope.CDV = {};
             // $scope.banks = {};
             // $scope.accounts = {};
             // $scope.acctTitles = {};
             // $scope.entries = [];
             // $scope.entry = {};
             // $scope.cdvnums = {};
             // $scope.currentUser = {};
             // $scope.userID = {};

             $scope.CDV.bankID = null;
             $scope.CDV.bankName = "";

             CDVFactory.getBankName().then(function(data) {
                 $scope.banks = data;
             });

             CDVFactory.getAcctTitles().then(function(data) {
                 $scope.acctTitles = data;
             });

             $scope.getCDVID = function(id) {
             $scope.CDV = {};
             $scope.isDisable = false;
             CDVFactory.getCDVID(id).then(function(data) {
                 if (data.length > 0) {
                     $scope.CDV = data[0];
                     // $scope.CDV.position = data[0].idPosition;
                     console.log('CDV: ', $scope.CDV);
                     $scope.isUpdate = true;
                 }
             });
         };

             // CDVFactory.getCDVNum().then(function(data) {
             //     $scope.cdvnums = data;
             // });

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

              $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     CDVFactory.getCDV().then(function(data) {
                         var orderedData = {};

                         if ($scope.searchCDV) {
                             orderedData = $filter('filter')(data, $scope.searchCDV);
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

         $scope.today();

         init();
     });
