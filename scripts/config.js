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
            .state('main.CDVList', {
                url: '/CDVList',
                templateUrl: 'templates/CDVList.html',
                controller: 'cdvctrl'
            })
            .state('main.AddCDV', {
                url: '/AddCDV',
                templateUrl: 'templates/AddCDV.html',
                controller: 'cdvctrl'
            })
            .state('main.editCDV', {
                url: '/CDVList/:id',
                templateUrl: 'templates/AddCDV.html',
                controller: 'cdvctrl'
            })
            .state('main.appCDV', {
                url: '/appCDV/:id',
                templateUrl: 'templates/appCDV.html',
                controller: 'cdvctrl'
            })
            .state('main.JVList', {
                url: '/JVList',
                templateUrl: 'templates/JVList.html',
                controller: 'JVctrl'
            })
            .state('main.editJV', {
                url: '/JVList/:id',
                templateUrl: 'templates/AddJV.html',
                controller: 'JVctrl'
            })
            .state('main.AddJV', {
                url: '/AddJV',
                templateUrl: 'templates/AddJV.html',
                controller: 'JVctrl'
            })
            .state('main.AppJV', {
                url: '/AppJV/:id',
                templateUrl: 'templates/AppJV.html',
                controller: 'JVctrl'
            })
            .state('main.APVList', {
                url:'/APVList',
                templateUrl: 'templates/APVList.html',
                controller: 'apvctrl'
            })
            .state('main.AddAPV', {
                url: '/AddAPV',
                templateUrl: 'templates/AddAPV.html',
                controller: 'apvctrl'
            })
            .state('main.AppAPV', {
                url: '/AppAPV/:id',
                templateUrl: 'templates/AppAPV.html',
                controller: 'apvctrl'
            })
            .state('main.editAPV', {
                url: '/APVList/:id',
                templateUrl: 'templates/AddAPV.html',
                controller: 'apvctrl'
            })
            .state('main.purchaseOrder', {
                url: '/purchaseOrder',
                templateUrl: 'templates/PO.html',
                controller: 'poctrl'
            })
            .state('main.AddPO', {
                url: '/AddPO',
                templateUrl: 'templates/AddPO.html',
                controller: 'poctrl'
            })
            .state('main.prevPO', {
                url: '/purchaseOrder/:id',
                templateUrl: 'templates/reports/PO_prev.html',
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
                        return 'PO';
                    }
                }
            })
            .state('main.previewCDV', {
                url: '/previewCDV/:id',
                templateUrl: 'templates/reports/PreviewCDV.html',
                controller: 'cdvctrl',
                resolve: {
                    reportParams: function() {
                        return 'JV';
                    }
                }
            })
            .state('main.previewJV', {
                url: '/previewJV/:id',
                templateUrl: 'templates/reports/PreviewJV.html',
                controller: 'JVctrl',
                resolve: {
                    reportParams: function() {
                        return 'JV';
                    }
                }
            })
            .state('main.previewAPV', {
                url: '/previewAPV/:id',
                templateUrl: 'templates/reports/PreviewAPV.html',
                controller: 'apvctrl',
                resolve: {
                    reportParams: function() {
                        return 'JV';
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
