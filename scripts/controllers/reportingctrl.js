'use strict';

angular.module('accounting')
    .controller('reportingctrl', function($scope, toastr, ngTableParams, PositionFactory, AccountFactory, PODetFactory, AppJVFactory, SearchCDVFactory, ReportingService, reportParams) {

        $scope.tableParams = [];

        console.log('reportParams: ' + reportParams);

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
                AppJVFactory.getGJEntries($scope.dateParams).then(function(data) {
                    $scope.tableParams = data;
                    // console.log('data', data);
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
        } else if (reportParams === 'by-CDVNo') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            // SearchCDVFactory.getCDVDet($scope.search.CDVNo).then(function(data) {
            //     $scope.accnts = data;
            // });

            // SearchCDVFactory.getAcctEntries($scope.search.CDVNo).then(function(data) {
            //     $scope.accnts = data;
            // });
        }

        $scope.printData = function() {
            var divToPrint = document.getElementById('printTable');
            ReportingService.printData(divToPrint);
        };

        // $scope.printCDVData = function() {
        //     var divToPrint = document.getElementById('printTable');
        //     CDVReportService.printData(divToPrint);
        // };
    });
