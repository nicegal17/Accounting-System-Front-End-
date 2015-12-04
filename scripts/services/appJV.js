'use strict';

angular.module('accounting')
    .factory('AppJVFactory', function($http, API_URL) {

        return {
            getJVNo: function() {
                return $http({
                    url: API_URL + '/approveJV',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctEntries: function(JID) {
                return $http({
                    url: API_URL + '/approveJV/getAcctEntries/' + JID,
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            approveJV: function(id, data) {
                return $http({
                    url: API_URL + '/approveJV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
