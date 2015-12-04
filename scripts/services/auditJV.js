'use strict';

angular.module('accounting')
    .factory('AuditJVFactory', function($http, API_URL) {

        return {
            getJVNo: function() {
                return $http({
                    url: API_URL + '/AuditJV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctEntries: function(JVNo) {
                return $http({
                    url: API_URL + '/AuditJV/getAcctEntries/' + JVNo,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            auditJV: function(id, data) {
                return $http({
                    url: API_URL + '/AuditJV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
