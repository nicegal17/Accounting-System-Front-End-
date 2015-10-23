'use strict';

angular.module('accounting')
    .factory('SubAcctFactory', function($http, API_URL) {

        return {
            getAccountTitles: function() {
                return $http({
                    url: API_URL + '/SubAccount',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getNorms: function() {
                return $http({
                    url: API_URL + '/SubAccount/getNorms',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAcctTypes: function() {
                return $http({
                    url: API_URL + '/SubAccount/getAcctTypes',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getFunds: function() {
                return $http({
                    url: API_URL + '/SubAccount/getFunds',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getFinStatements: function() {
                return $http({
                    url: API_URL + '/SubAccount/getFinStatements',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createSubAccts: function(data) {
                return $http({
                    url: API_URL + '/SubAccount',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },
        }
    });
