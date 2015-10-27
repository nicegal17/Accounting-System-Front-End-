'use strict';

angular
    .module('accounting', ['ngResource', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'toastr', 'ngDialog', 'ngTable'])
    .constant('API_URL', 'http://localhost:8000/api/v1')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    })
    .factory('authInterceptor', function($q, $window,$location) {
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
                } else {
                    return $q.reject(response);
                }
            }
        };
    });

