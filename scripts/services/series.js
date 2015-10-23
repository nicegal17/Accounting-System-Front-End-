'use strict';

angular.module('accounting')
    .factory('SeriesFactory', function($http, API_URL) {

        return {
            getSeriesNum: function() {
                return $http({
                    url: API_URL + '/series',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

             getSeriesDet: function(id) {
                return $http({
                    url: API_URL + '/series/getSeriesDet/' + id,
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            updateNumSeries: function(id, data) {
                return $http({
                    url: API_URL + '/series/' + id,
                    type: 'PUT',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

        };
    });
