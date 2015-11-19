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
                    url: API_URL + '/Assets/',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createAsset: function(data) {
                return $http({
                    url: API_URL + '/Assets',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getAssets: function() {
                return $http({
                    url: API_URL + '/Assets/', 
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAssetID: function(id) {
                return $http({
                    url: API_URL + '/Assets/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        }
    });
