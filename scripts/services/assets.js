'use strict';

angular.module('accounting')
    .factory('AssetsFactory', function($http, API_URL) {

        return {
            getCategories: function() {
                return $http({
                    url: API_URL + '/Assets',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getPeriods: function() {
                return $http({
                    url: API_URL + '/Assets/getPeriods',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createAsset: function(data) {
                return $http({
                    url: API_URL + '/Assets',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },
        }
    });
