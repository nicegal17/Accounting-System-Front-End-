'use strict';

angular.module('accounting')
    .factory('APVFactory', function($http, API_URL) {

        return {
            getAcctTitle: function() {
                return $http({
                    url: API_URL + '/APV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createAPV: function(data) {
                return $http({
                    url: API_URL + '/APV',
                    method: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
