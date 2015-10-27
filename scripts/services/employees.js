'use strict';

angular.module('accounting')
    .factory('EmployeeFactory', function($http,API_URL) {

        return {
            createEmployee: function(data) {
                return $http({
                    url: API_URL + '/employees',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getEmployees: function() {
                return $http({
                    url: API_URL + '/employees',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getEID: function(id) {
                return $http({
                    url: API_URL + '/employees/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            updateEmployee: function(id, data) {
                return $http({
                    url: API_URL + '/employees/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },
            deleteUsers: function(id) {
                return $http({
                    url: API_URL + '/employees/' + id,
                    method: 'DELETE',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
