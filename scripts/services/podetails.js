'use strict';

angular.module('accounting')
    .factory('PODetFactory', function($http, API_URL) {

        return {
            getPoDetails: function(id) {
                return $http({
                    url: API_URL + '/podetails/' + id,
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getPOItems: function(id) {
                return $http({
                    url: API_URL + '/podetails/getPOItems/' + id,
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            selectSUM: function(id) {
                return $http({
                    url: API_URL + '/podetails/selectSUM/' + id,
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
