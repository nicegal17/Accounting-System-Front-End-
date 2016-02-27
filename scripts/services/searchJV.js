'use strict';

angular.module('accounting')
    .factory('SearchJVFactory', function($http, API_URL) {

        return {
            getJVNo: function() {
                return $http({
                    url: API_URL + '/SearchJV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getJVDet: function(JVNum) {
                return $http({
                    url: API_URL + '/SearchJV/getJVDet/' + JVNum,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getDBEntries: function(JVNum) {
                return $http({
                    url: API_URL + '/SearchJV/getDBEntries/' + JVNum,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getCREntries: function(JVNum) {
                return $http({
                    url: API_URL + '/SearchJV/getCREntries/' + JVNum,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
