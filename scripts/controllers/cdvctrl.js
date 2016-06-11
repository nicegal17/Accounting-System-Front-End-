 'use strict';

 angular.module('accounting')
     .controller('cdvctrl', function($scope, $filter, $window, $stateParams, CDVFactory, toastr, ngTableParams, ReportingService) {

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

         $scope.getCDVEntries = function(id) {
             CDVFactory.getCDVEntries(id).then(function(data) {
                 if (data.length > 0) {
                     $scope.entry = data[0];
                     $scope.entry.acctTitle = data[0].idAcctTitle;

                     console.log('data:', $scope.entry);
                     $scope.isUpdate = true;
                 }
             });
         };

         $scope.saveCDVEntries = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 CDV: $scope.CDV,
                 entries: JSON.stringify($scope.entries),
                 userID: $scope.currentUser.userID
             };

             if ($scope.isUpdate === true) {
                 CDVFactory.updateCDV($scope.CDV.cdvID, data).then(function(data) {
                     if (!_.isEmpty(data)) {
                         if (data.success === 'true') {
                             toastr.success(data.msg, 'Updating Check Disbursement Voucher');
                         } else {
                             toastr.error(data.msg, 'Error while updating CDV.');
                         }
                     }
                 });
             } else {
                 CDVFactory.createCDV(data).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                         if (data.success == 'true') {
                             toastr.success(data.msg, 'Creating New Check Disbursement Voucher');
                         } else {
                             toastr.error(data.msg, 'Error while creating new CDV.');
                         }
                     }
                 });
             }
             $scope.entries = "";
             $scope.CDV = "";
             $scope.totalDB = "";
             $scope.totalCR = "";
         };

         $scope.approveCDV = function() {
             $scope.currentUser = JSON.parse($window.localStorage['user']);
             var data = {
                 userID: $scope.currentUser.userID
             };
             CDVFactory.approveCDV($scope.CDV.cdvID, data).then(function(data) {
                 console.log('data: ', data);
                 if (data.success === 'true') {
                     toastr.success(data.msg, 'Approving Check Disbursement Voucher');
                 } else {
                     toastr.error(data.msg, 'Error while Approving CDV.');
                 }
             });
         };

         $scope.denyCDV = function() {
             AppCDVFactory.denyCDV($scope.appcdv.CDVNo, $scope.appcdv).then(function(data) {
                 console.log('data: ', data);
                 toastr.success('Check Disbursement Voucher has been denied', 'Denied CDV');
             });
         };

         function init() {
             $scope.CDV = {};
             $scope.CDV.bankID = null;
             $scope.CDV.bankName = "";
             $scope.entries = [];
             $scope.isUpdate = false;

             CDVFactory.getBanks().then(function(data) {
                 $scope.banks = data;
                 $scope.CDV.bank = data[0].bankID;

                 console.log('data', $scope.banks);
             });

             CDVFactory.getAcctTitles().then(function(data) {
                 $scope.acctTitles = data;
             });

             CDVFactory.getCDVNum().then(function(data) {
                 $scope.cdvnums = data;
             });

             if (!_.isUndefined($stateParams.id)) {
                 $scope.detail = {};
                 CDVFactory.getCDVByID($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.detail = data[0];
                     }
                 });

                 CDVFactory.getCDVDetails($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.CDV = data[0];
                     }
                 });

                 CDVFactory.previewCDV($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.preview = data[0];
                     }
                 });

                 CDVFactory.getCDVEntries($stateParams.id).then(function(data) {
                     if (data.length > 0) {
                         $scope.entries = data;
                     }
                 });
             }

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

         $scope.printData = function() {
             var divToPrint = document.getElementById('printTable');
             ReportingService.printData(divToPrint);
         };
     });
