'use strict';

angular.module('accounting')
    .factory('SubAcctFactory', function($http, API_URL) {

        return {
            getAccountTitles: function() {
                return $http({
                    url: API_URL + '/SubAccount',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getNorms: function() {
                return $http({
                    url: API_URL + '/SubAccount/getNorms',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAcctTypes: function() {
                return $http({
                    url: API_URL + '/SubAccount/getAcctTypes',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getFunds: function() {
                return $http({
                    url: API_URL + '/SubAccount/getFunds',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getFinStatements: function() {
                return $http({
                    url: API_URL + '/SubAccount/getFinStatements',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createSubAccts: function(data) {
                return $http({
                    url: API_URL + '/SubAccount',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },
        }
    });
