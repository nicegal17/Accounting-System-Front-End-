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
                resolve: {
                    loadMyDirectives: function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/directives/header.js',
                                    'scripts/directives/sidebar.js'
                                ]
                            }),
                            $ocLazyLoad.load({
                                name: 'toggle-switch',
                                files: ['bower_components/angular-toggle-switch/angular-toggle-switch.min.js',
                                    'bower_components/angular-toggle-switch/angular-toggle-switch.css'
                                ]
                            }),
                            $ocLazyLoad.load({
                                name: 'ngAnimate',
                                files: ['bower_components/angular-animate/angular-animate.js']
                            });
                        $ocLazyLoad.load({
                            name: 'ngCookies',
                            files: ['bower_components/angular-cookies/angular-cookies.js']
                        });
                        $ocLazyLoad.load({
                            name: 'ngResource',
                            files: ['bower_components/angular-resource/angular-resource.js']
                        });
                        $ocLazyLoad.load({
                            name: 'ngSanitize',
                            files: ['bower_components/angular-sanitize/angular-sanitize.js']
                        });
                        $ocLazyLoad.load({
                            name: 'ngTouch',
                            files: ['bower_components/angular-touch/angular-touch.js']
                        });
                    }
                }
            })
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html',
                controller: 'MainCtrl',
                resolve: {
                    loadMyFiles: function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: [
                                'scripts/directives/notification.js',
                            ]
                        });
                    }
                }
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
            })
            .state('main.soa', {
                url: '/soa/:id',
                templateUrl: 'templates/reports/soa.html',
                controller: 'soactrl'
            })
            .state('main.manageUser', {
                url: '/manageUser',
                templateUrl: 'templates/user.html',
                controller: 'userctrl'
            })
            .state('main.FA', {
                url: '/FA',
                templateUrl: 'templates/FA.html',
                controller: 'assetctrl'
            })
            .state('main.bank', {
                url: '/bank',
                templateUrl: 'templates/bank.html',
                controller: 'bankctrl'
            })
            .state('main.Account', {
                url: '/Account',
                templateUrl: 'templates/Account.html',
                controller: 'accountctrl'
            })

        /* ============== REPORTS ============== */
        .state('main.chart-of-account', {
                url: '/chart-of-account',
                templateUrl: 'templates/reports/chart-of-accounts.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'chart-of-account';
                    }
                }
            })
            .state('main.general-journal', {
                url: '/general-journal',
                templateUrl: 'templates/reports/general-journal.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'general-journal';
                    }
                }
            })
            .state('main.PO_prev', {
                url: '/PO_prev',
                templateUrl: 'templates/PO_prev.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                   .     return 'PO';
                    }
                }
            })
            .state('main.CDV', {
                url: '/CDV',
                templateUrl: 'templates/modals/searchCDV.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'CDV';
                    }
                }
            })
            .state('main.JV', {
                url: '/JV',
                templateUrl: 'templates/modals/searchJV.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'JV';
                    }
                }
            })
            .state('main.APV', {
                url: '/APV',
                templateUrl: 'templates/modals/searchAPV.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'APV';
                    }
                }
            })
            .state('main.CDJ', {
                url: '/CDJ',
                templateUrl: 'templates/reports/checkdisbursement-journal.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'CDJ';
                    }
                }
            })
            .state('main.APJ', {
                url: '/APJ',
                templateUrl: 'templates/reports/apv-journal.html',
                controller: 'reportingctrl',
                resolve: {
                    reportParams: function() {
                        return 'APJ';
                    }
                }
            });

        $urlRouterProvider.otherwise('/login');
    });
