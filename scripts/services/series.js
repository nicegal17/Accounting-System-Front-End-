'use strict';

angular.module('accounting')
    .factory('SeriesFactory', function($http, API_URL) {

        return {
            getSeriesNum: function() {
                return $http({
                    url: API_URL + '/series',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

             getSeriesDet: function(id) {
                return $http({
                    url: API_URL + '/series/getSeriesDet/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            updateNumSeries: function(id, data) {
                return $http({
                    url: API_URL + '/series/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

        };
    });
