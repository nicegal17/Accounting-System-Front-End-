'use strict';

angular.module('accounting')
    .factory('PODetFactory', function($http, API_URL) {

        return {
            getPoDetails: function(id) {
                return $http({
                    url: API_URL + '/podetails/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getPOItems: function(id) {
                return $http({
                    url: API_URL + '/podetails/getPOItems/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            selectSUM: function(id) {
                return $http({
                    url: API_URL + '/podetails/selectSUM/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            approvePO: function(id, data) {
                return $http({
                    url: API_URL + '/podetails/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
