'use strict';

angular.module('accounting')
    .factory('CDVListFactory', function($http, API_URL) {

        return {
            getCDV: function() {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
