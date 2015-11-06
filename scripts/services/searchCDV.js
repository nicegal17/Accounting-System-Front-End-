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

            getAcctEntries: function(CDVNo) {
                return $http({
                    url: API_URL + '/Search/getAcctEntries/' + CDVNo,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
