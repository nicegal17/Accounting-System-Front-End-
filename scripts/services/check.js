'use strict';

angular.module('accounting')
    .factory('CheckFactory', function($http, API_URL) {

        return {
            createCheck: function(data) {
                return $http({
                    url: API_URL + '/check',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            }, 
        };
    });
