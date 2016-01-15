'use strict';

angular.module('accounting')
    .factory('searchAPVFactory', function($http, API_URL) {

        return {
            getAPVNo: function() {
                return $http({
                    url: API_URL + '/SearchAPV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getAPVDet: function(apvID) {
                return $http({
                    url: API_URL + '/SearchAPV/getAPVDet/' + apvID,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getDBEntries: function(apvID) {
                return $http({
                    url: API_URL + '/SearchAPV/getDBEntries/' + apvID,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getCREntries: function(apvID) {
                return $http({
                    url: API_URL + '/SearchAPV/getCREntries/' + apvID,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
