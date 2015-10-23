'use strict';

angular.module('accounting')
    .factory('PositionFactory', function($http, API_URL) {
        return {
            getPositions: function() {
                return $http({
                    url: API_URL + '/position',
                    type: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createPositions: function(data) {
                return $http({
                    url: API_URL + '/position',
                    type: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            getPositionsByID: function(id) {
                return $http({
                    url: API_URL + '/position/' + id,
                    type: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },

            updatePositions: function(id, data) {
                return $http({
                    url: API_URL + '/position/' + id,
                    type: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },
        }
    });
