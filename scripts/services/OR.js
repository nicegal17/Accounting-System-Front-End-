'use strict';

angular.module('accounting')
    .factory('ORFactory', function($http, API_URL) {

        return {
            getPayer: function() {
                return $http({
                    url: API_URL + '/OR',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            saveOR: function(data) {
                return $http({
                    url: API_URL + '/OR',
                    method: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
