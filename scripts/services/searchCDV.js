'use strict';

angular.module('accounting')
    .factory('SearchCDVFactory', function($http, API_URL) {

        return {
            getCDVNo: function() {
                return $http({
                    url: API_URL + '/Search',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getCDVDet: function(CDVNo) {
                return $http({
                    url: API_URL + '/Search/getCDVDet/' + CDVNo,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getDBEntries: function(CDVNo) {
                return $http({
                    url: API_URL + '/Search/getDBEntries/' + CDVNo,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             getCREntries: function(CDVNo) {
                return $http({
                    url: API_URL + '/Search/getCREntries/' + CDVNo,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
