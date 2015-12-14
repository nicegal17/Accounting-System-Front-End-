'use strict';

angular.module('accounting')
    .controller('reportingctrl', function($scope, toastr, ngTableParams, PositionFactory, AccountFactory, PODetFactory, AppJVFactory, SearchCDVFactory, SearchJVFactory, ReportingService, reportParams) {

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
        } else if (reportParams === 'JV') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }
        }

        $scope.printData = function() {
            var divToPrint = document.getElementById('printTable');
            ReportingService.printData(divToPrint);
        };
    });
