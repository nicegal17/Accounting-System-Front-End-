'use strict';

angular.module('accounting')
    .factory('JVFactory', function($http, API_URL) {

        return {
            getAcctTitle: function() {
                return $http({
                    url: API_URL + '/JV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createJV: function(data) {
                return $http({
                    url: API_URL + '/JV',
                    method: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
