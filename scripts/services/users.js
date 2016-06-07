'use strict';

angular.module('accounting')
    .factory('UsersFactory', function($http, API_URL) {
        return {

            getAllUsers: function() {
                return $http({
                    url: API_URL + '/users',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getEmployees: function() {
                return $http({
                    url: API_URL + '/users/getEmployees/',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getUserRoles: function() {
                return $http({
                    url: API_URL + '/users/getUserRoles/',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getUserID: function(id) {
                return $http({
                    url: API_URL + '/users/getUserID/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createUser: function(data) {
                return $http({
                    url: API_URL + '/users',
                    method: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            // getRolesPermission: function() {
            //     return $http({
            //         url: API_URL + '/users/getRolesPermission/',
            //         method: 'GET',
            //     }).then(function(res) {
            //         return res.data;
            //     });
            // },

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
