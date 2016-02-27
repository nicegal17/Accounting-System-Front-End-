'use strict';

angular.module('accounting')
    .factory('AuditCDVFactory', function($http, API_URL) {

        return {
            getCDVNo: function() {
                return $http({
                    url: API_URL + '/Audit',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctEntries: function(CDVNo) {
                return $http({
                    url: API_URL + '/Audit/getAcctEntries/' + CDVNo,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            auditCDV: function(id, data) {
                return $http({
                    url: API_URL + '/Audit/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
