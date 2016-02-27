'use strict';

angular.module('accounting')
    .factory('AuditAPVFactory', function($http, API_URL) {

        return {
            getAPV: function() {
                return $http({
                    url: API_URL + '/AuditAPV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctEntries: function(apvID) {
                return $http({
                    url: API_URL + '/AuditAPV/getAcctEntries/' + apvID,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            auditAPV: function(id, data) {
                return $http({
                    url: API_URL + '/AuditAPV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
