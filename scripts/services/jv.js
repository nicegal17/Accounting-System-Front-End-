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

            getGJEntries: function(filterDate, filterDateTO) {
                return $http({
                    url: API_URL + '/JV/getGJEntries',
                    data: {
                        from: filterDate,
                        to: filterDateTO
                    },
                    method: 'POST',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
