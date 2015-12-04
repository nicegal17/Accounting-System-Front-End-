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

            getAcctEntries: function(apvID) {
                return $http({
                    url: API_URL + '/SearchAPV/getAcctEntries/' + apvID,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
