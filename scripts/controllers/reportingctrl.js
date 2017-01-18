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

        $scope.CDV = {};

        // $scope.dateparamsTO = {
        //     "paramsdate": {
        //         "chkDate": new Date()
        //     }
        // }

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
        } else if (reportParams === 'JV') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }
        } else if (reportParams === 'APJ') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            $scope.getAPVEntries = function() {
                APVFactory.getAPVEntries($filter('date')($scope.dateParams.paramsdate.chkDate, 'yyyy-MM-dd'), $filter('date')($scope.dateparamsTO.paramsdate.chkDate, 'yyyy-MM-dd')).then(function(data) {
                    $scope.tableParams = data;
                });
            };

        } else if (reportParams === 'CDJ') {
            if (!_.isEmpty($scope.tableParams)) {
                $scope.tableParams.splice(0, $scope.tableParams.length);
            }

            // if ($location.search().hasOwnProperty('sdate1')) {
            //     var dateval = $location.search()['sdate1'];
            // }

            // $scope.location = $location;
            // $scope.$watch('location.search()', function() {
            //     $scope.target = ($location.search()).target;
            // }, true);

            // $scope.changeTarget = function(name) {
            //     $location.search('target', name);
            // }

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
    });


// CDVFactory.getCDVInfo($filter('date')($scope.dateParams.paramsdate.chkDate, 'yyyy-MM-dd'), $filter('date')($scope.dateparamsTO.paramsdate.chkDate, 'yyyy-MM-dd')).then(function(data) {
//     $scope.tableParams = data;
//  });
//     $scope.getCDVInfo = function(filterDate) {
//     $scope.CDJ = {};
//     CDVFactory.getCDVInfo(filterDate).then(function(data) {
//         if (data.length > 0) {
//             $scope.CDJ = data[0];
//             console.log('$scope.user: ', $scope.CDJ);
//         }
//     });
// };
