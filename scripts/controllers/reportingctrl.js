'use strict';

angular.module('accounting')
    .controller('reportingctrl', function($scope, $filter, toastr, ngTableParams, PositionFactory, AccountFactory, PODetFactory, CDVFactory, JVFactory, APVFactory, ReportingService, reportParams) {

        $scope.tableParams = [];

        console.log('reportParams: ' + reportParams);

        $scope.sdate1 = {
            "paramsdate": {
                "chkDate": new Date()
            }
        }

       $scope.cdjournals = {};

        $scope.sDateFr = function() {
            $scope.filterDate = $filter('date')($scope.sdate1.paramsdate.chkDate, 'yyyy-MM-dd');
        };

        // $scope.sDateTO = function() {
        //     $scope.filterDateTO = $filter('date')($scope.dateparamsTO.paramsdate.chkDate, 'yyyy-MM-dd');
        // };

        if (reportParams === 'chart-of-account') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }
            AccountFactory.getAccountChart().then(function(data) {
                $scope.tableParams = data;
            });
        } else if (reportParams === 'general-journal') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            $scope.getGJEntries = function() {
                JVFactory.getGJEntries($filter('date')($scope.dateParams.paramsdate.chkDate, 'yyyy-MM-dd'), $filter('date')($scope.dateparamsTO.paramsdate.chkDate, 'yyyy-MM-dd')).then(function(data) {
                    $scope.tableParams = data;
                });
            };

        } else if (reportParams === 'PO') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            PODetFactory.getPoDetails($stateParams.id).then(function(data) {
                if (data.length > 0) {
                    $scope.poDetails = data;
                }
            });

            PODetFactory.getPOItems($stateParams.id).then(function(data) {
                if (data.length > 0) {
                    $scope.poItems = data;
                }
            });

            PODetFactory.getApprovingOfficer($stateParams.id).then(function(data) {
                if (data.length > 0) {
                    $scope.officers = data;
                }
            });
        } else if (reportParams === 'CDV') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }
        } 
        else if (reportParams === 'JV') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }
        } 
        else if (reportParams === 'APJ') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            $scope.getAPVEntries = function() {
                APVFactory.getAPVEntries($filter('date')($scope.dateParams.paramsdate.chkDate, 'yyyy-MM-dd'), $filter('date')($scope.dateparamsTO.paramsdate.chkDate, 'yyyy-MM-dd')).then(function(data) {
                    $scope.tableParams = data;
                });
            };

        } 
        else if (reportParams === 'CDJ') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            $scope.getCDVInfo = function() {
                CDVFactory.getCDVInfo($filter('date')($scope.sdate1.paramsdate.chkDate, 'yyyy-MM-dd')).then(function(data) {
                    $scope.tableParams = data;
                });
            };
        }

        $scope.printData = function() {
            var divToPrint = document.getElementById('printTable');
            ReportingService.printData(divToPrint);
        };


         function init() {
             $scope.cdjs = {};

             $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     CDVFactory.getCDVInfo().then(function(data) {
                         var orderedData = {};

                         if ($scope.searchEmployee) {
                             orderedData = $filter('filter')(data, $scope.searchEmployee);
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