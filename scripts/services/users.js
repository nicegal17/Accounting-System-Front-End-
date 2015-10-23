'use strict';

angular.module('accounting')
    .factory('UsersFactory', function($http, API_URL) {
        return {
            createUser: function(data) {
                return $http({
                    url: API_URL + '/users',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getEmployee: function() {
                return $http({
                    url: API_URL + '/users',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAllUsers: function() {
                return $http({
                    url: API_URL + '/users/getUsers',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getUserID: function(id) {
                return $http({
                    url: API_URL + '/users/' + id,
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            updateUser: function(id, data) {
                return $http({
                    url: API_URL + '/users/' + id,
                    type: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            deleteUser: function(id) {
                return $http({
                    url: API_URL + '/users/' + id,
                    type: 'DELETE',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
