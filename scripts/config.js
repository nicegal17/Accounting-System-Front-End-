'use strict';

angular
    .module('accounting')
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
        // =========== AUTHENTICATION =========== //
            .state('login', {
            url: '/login',
            templateUrl: 'templates/login/login.html',
            controller: 'loginctrl'
        })

        // =========== DASHBOARD =========== //
        .state('main', {
                url: '/main',
                abstract: true,
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            })
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html',
                controller: 'MainCtrl'
            })
            .state('main.employees', {
                url: '/employees',
                templateUrl: 'templates/employee.html',
                controller: 'employeectrl'
            })
            .state('main.branch', {
                url: '/branch',
                templateUrl: 'templates/branch.html',
                controller: 'branchctrl'
            })
            .state('main.checkDisbursement', {
                url: '/checkDisbursement',
                templateUrl: 'templates/checkDisbursement.html',
                controller: 'cdvctrl'
            })
            .state('main.purchaseOrder', {
                url: '/purchaseOrder',
                templateUrl: 'templates/po.html',
                controller: 'poctrl'
            })
            .state('main.prevPO', {
                url: '/purchaseOrder/:id',
                templateUrl: 'templates/PO_prev.html',
                controller: 'podetailsctrl'
            });



        $urlRouterProvider.otherwise('/login');
        // $locationProvider.html5Mode(true);
    });
