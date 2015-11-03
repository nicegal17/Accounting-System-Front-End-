'use strict';

angular
    .module('accounting', ['ngResource', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'toastr', 'ngDialog', 'ngTable', 'ngCookies', 'oc.lazyLoad', 'angular-loading-bar'])
    // .constant('API_URL', 'http://localhost:8000/api/v1')
    // .constant('API_URL', 'http://localhost:81/AccountingSystem/public/api/v1')
    .constant('API_URL', 'http://localhost:80/Accounting-System/public/api/v1')
    .config(function($httpProvider, $ocLazyLoadProvider) {

        $httpProvider.interceptors.push('authInterceptor');
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
        });
    })
    .run(function($rootScope, $state, $location, AuthenticationFactory) {
        $rootScope.$on('$stateChangeStart', function(event, next) {
            var user = AuthenticationFactory.getUser();
            var token = AuthenticationFactory.getToken();
            
            if (next.name === 'login') {
                console.log('login');
                if (!_.isEmpty(user) && !_.isEmpty(token)) {
                    $location.path('/main/dashboard');
                }
            }else{
                if (_.isEmpty(user) && _.isEmpty(token)) {
                    $location.path('/login');
                }
            }

        });
    })
    .factory('authInterceptor', function($q, $window, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.localStorage['userToken']) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage['userToken'];
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {

                    $window.localStorage['userToken'] = '';
                    $window.localStorage['user'] = '';

                    $location.path('/login');

                    return $q.reject(response);
                } else if (response.status === 500) {
                    // $location.path('/login');
                    return $q.reject(response);
                } else if (response.status === 0) {
                    // $location.path('/login');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    });
