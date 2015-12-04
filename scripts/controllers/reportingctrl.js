'use strict';

angular.module('accounting')
    .controller('reportingctrl', function($scope, toastr, ngTableParams, PositionFactory, AccountFactory, ReportingService, reportParams) {
        
        $scope.tableParams = [];

        console.log('reportParams: ' + reportParams);

        if (reportParams === 'chart-of-account') {
        	if (!_.isEmpty($scope.tableParams)) {
        		$scope.tableParams.splice(0,$scope.tableParams.length);
        	}
            AccountFactory.getAccountChart().then(function(data) {
               $scope.tableParams = data;
            });
        }

        $scope.printData = function(){
        	var divToPrint = document.getElementById('printTable');
        	ReportingService.printData(divToPrint);
        };
    });
