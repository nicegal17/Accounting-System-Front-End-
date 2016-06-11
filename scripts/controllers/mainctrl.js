'use strict';

angular
    .module('accounting')
    .controller('MainCtrl', function($scope) {

    })
    .controller('headerCtrl', function($scope,$rootScope, AuthenticationFactory) {
        $scope.logout = function() {
            console.log('logout');
            AuthenticationFactory.Logout();
        };

        var currentUser = AuthenticationFactory.getUser();
        currentUser = JSON.parse(currentUser);
        $rootScope.currentUser = currentUser;
    })
    .controller('sideBarCtrl', function($scope, $modal) {
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;

        $scope.check = function(x) {

            if (x == $scope.collapseVar)
                $scope.collapseVar = 0;
            else
                $scope.collapseVar = x;
        };

        $scope.multiCheck = function(y) {
            if (y == $scope.multiCollapseVar)
                $scope.multiCollapseVar = 0;
            else
                $scope.multiCollapseVar = y;
        };

        $scope.openPosition = function() {
            console.log('asdasda');
            var modalInstance = $modal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: '/templates/modals/position.html',
                controller: 'positionctrl',
                size: 'md'
            });
        };

        // $scope.openAppCDV = function() {
        //     var modalInstance = $modal.open({
        //         animation: true,
        //         templateUrl: '/templates/modals/appCDV.html',
        //         controller: 'appCDVctrl',
        //         size: 'lg'
        //     });
        // };

        $scope.openAuditCDV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/auditCDV.html',
                controller: 'auditCDVctrl',
                size: 'lg'
            });
        };

        // $scope.openSearchCDV = function() {
        //     var modalInstance = $modal.open({
        //         animation: true,
        //         templateUrl: '/templates/modals/searchCDV.html',
        //         controller: 'searchCDVctrl',
        //         size: 'lg'
        //     });
        // };

        $scope.openJV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/JV.html',
                controller: 'JVctrl',
                size: 'lg'
            });
        };

        $scope.openAppJV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/appJV.html',
                controller: 'appJVctrl',
                size: 'lg'
            });
        };

        $scope.openAuditJV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/auditJV.html',
                controller: 'auditJVctrl',
                size: 'lg'
            });
        };

        $scope.openSearchJV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/searchJV.html',
                controller: 'searchJVctrl',
                size: 'lg'
            });
        };

        $scope.openCheck = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/check.html',
                controller: 'checkctrl',
                size: 'md'
            });
        };

        $scope.openAPVoucher = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/APVoucher.html',
                controller: 'apvctrl',
                size: 'lg'
            });
        };

        $scope.openAppAPV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/appAPV.html',
                controller: 'appAPVctrl',
                size: 'lg'
            });
        };

        $scope.openAuditAPV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/auditAPV.html',
                controller: 'auditAPVctrl',
                size: 'lg'
            });
        };

        $scope.openSearchAPV = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/searchAPV.html',
                controller: 'searchAPVctrl',
                size: 'lg'
            });
        };

        $scope.openSubAcct = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/subAcct.html',
                controller: 'subAcctctrl',
                size: 'lg'
            });
        };

        $scope.openFixedAsset = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/fixedAssets.html',
                controller: 'assetctrl',
                size: 'md'
            });
        };

        $scope.openAcctPeriod = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/acctPeriod.html',
                controller: 'assetctrl',
                size: 'sm'
            });
        };

        $scope.openBeginningBal = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/beginBal.html',
                controller: 'beginBalctrl',
                size: 'md'
            });
        };

        $scope.seriesNumbers = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/seriesNo.html',
                controller: 'seriesnumctrl',
                size: 'md'
            });
        };

        $scope.issueOR = function() {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/templates/modals/OR.html',
                controller: 'ORctrl',
                size: 'md'
            });
        };
    });
