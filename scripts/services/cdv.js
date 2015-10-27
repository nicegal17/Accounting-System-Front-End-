'use strict';

angular.module('accounting')
    .factory('CDVFactory', function($http, API_URL) {

        return {
            getAcctNum: function() {
                return $http({
                    url: API_URL + '/CDV/accounts',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getBankName: function() {
                return $http({
                    url: API_URL + '/CDV/banks',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctTitle: function() {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createCDV: function(data) {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVNum: function() {
                return $http({
                    url: API_URL + '/CDV/cdvnum',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
