'use strict';

angular.module('accounting')
    .factory('AccountFactory', function($http,API_URL) {

        return {
            getFunds: function() {
                return $http({
                    url: API_URL + '/account',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAcctTypes: function() {
                return $http({
                    url: API_URL + '/account/getAcctTypes',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getNorms: function() {
                return $http({
                    url: API_URL + '/account/getNorms',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getFS: function() {
                return $http({
                    url: API_URL + '/account/getFS',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAccountChart: function() {
                return $http({
                    url: API_URL + '/account/getAccountChart',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            /*createAccount: function(data) {
                return $http({
                    url: API_URL + '/account',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },*/

        }
    });
