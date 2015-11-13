'use strict';

angular.module('accounting')
    .factory('appAPVFactory', function($http,API_URL) {
        return {
            getAPVNo: function() {
                return $http({
                    url: API_URL + '/appAPV',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAcctEntries: function(apvID) {
                return $http({
                    url: API_URL + '/appAPV/getAcctEntries/' + apvID,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            approveAPV: function(id, data) {
                return $http({
                    url: API_URL + '/appAPV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
