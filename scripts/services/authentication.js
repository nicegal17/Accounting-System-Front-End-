'use strict';

angular.module('accounting')
    .factory('AuthenticationFactory', function($http, $window, API_URL) {
        return {
            Login: function(username, password) {
                console.log('username: ' + username + ' password: ' + password);
                return $http({
                    url: API_URL + '/auth/login',
                    method: 'POST',
                    data: {
                        username: username,
                        password: password
                    }
                }).then(function(res) {
                    return res.data;
                });
            },
            storeUser: function(user, token) {
                $window.localStorage['user'] = user
                $window.localStorage['userToken'] = token;
            },
            getUser: function() {
                return $window.localStorage['user'];
            },
            getToken: function() {
                return $window.localStorage['userToken'];
            },
            Logout: function() {
                $window.localStorage['user'] = '';
                $window.localStorage['userToken'] = '';
                $state.go('login');
                return true;
            }

        };
    });
