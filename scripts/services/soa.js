'use strict';

angular.module('accounting')
    .factory('SOAFactory', function($http, API_URL) {

        return {
            getInfo: function(id) {
                return $http({
                    url: API_URL + '/soa/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
