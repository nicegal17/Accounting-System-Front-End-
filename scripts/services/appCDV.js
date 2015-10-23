'use strict';

angular.module('accounting')
    .factory('AppCDVFactory', function($http, API_URL) {

        return {
            getCDVNo: function() {
                return $http({
                    url: API_URL + '/AppCDV',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctEntries: function(CDVNo) {
                return $http({
                    url: API_URL + '/getAcctEntries/' + CDVNo,
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            appCDV: function(id, data) {
                return $http({
                    url: API_URL + '/AppCDV/' + id,
                    type: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            denyCDV: function(id, data) {
                return $http({
                    url: API_URL + '/AppCDV/denyCDV/' + id,
                    type: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
