'use strict';

angular.module('accounting')
    .factory('BankFactory', function($http, API_URL) {

        return {
            createBanks: function(data) {
                return $http({
                    url: API_URL + '/bank',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getBanks: function() {
                return $http({
                    url: API_URL + '/bank',
                    method: 'GET'
                }).then(function(res){
                    return res.data;
                });
            },

            getBankByID: function(id) {
                return $http({
                    url: API_URL + '/bank/' + id,
                    method: 'GET'
                }).then(function(res){
                    return res.data;
                });
            },

            updateBank: function(id, data) {
                return $http({
                    url: API_URL + '/bank/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            deleteBank: function(id) {
                return $http({
                    url: API_URL + '/bank/' + id,
                    method: 'DELETE'
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
