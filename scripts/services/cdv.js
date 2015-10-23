'use strict';

angular.module('accounting')
    .factory('CDVFactory', function($http, API_URL) {

        return {
            getAcctNum: function() {
                return $http({
                    url: API_URL + '/CDV/accounts',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getBankName: function() {
                return $http({
                    url: API_URL + '/CDV/banks',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctTitle: function() {
                return $http({
                    url: API_URL + '/CDV',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createCDV: function(data) {
                return $http({
                    url: API_URL + '/CDV',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVNum: function() {
                return $http({
                    url: API_URL + '/CDV/cdvnum',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
