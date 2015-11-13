'use strict';

angular.module('accounting')
    .factory('UsersFactory', function($http, API_URL) {
        return {
            createUser: function(data) {
                return $http({
                    url: API_URL + '/users',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getAllUsers: function() {
                return $http({
                    url: API_URL + '/users',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getUserID: function(id) {
                return $http({
                    url: API_URL + '/users/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            updateUser: function(id, data) {
                return $http({
                    url: API_URL + '/users/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
