'use strict';

angular.module('accounting')
    .factory('AccountFactory', function($http,API_URL) {

        return {
            getFunds: function() {
                return $http({
                    url: API_URL + '/account',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAcctTypes: function() {
                return $http({
                    url: API_URL + '/getAcctTypes',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getNorms: function() {
                return $http({
                    url: API_URL + '/getNorms',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getFS: function() {
                return $http({
                    url: API_URL + '/getFS',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAccountTitles: function() {
                return $http({
                    url: API_URL + '/getAccountTitles',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            /*createAccount: function(data) {
                return $http({
                    url: API_URL + '/account',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },*/

        }
    });
