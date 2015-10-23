'use strict';

angular.module('accounting')
    .factory('beginBalFactory', function($http, API_URL) {

        return {
            getAcctTitles: function() {
                return $http({
                    url: API_URL + '/Balance',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createBeginBal: function(data) {
                return $http({
                    url: API_URL + '/Balance',
                    type: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
