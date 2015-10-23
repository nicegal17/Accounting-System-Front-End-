'use strict';

angular.module('accounting')
    .factory('BranchFactory', function($http, API_URL) {

        return {
            getBranches: function() {
                return $http({
                    url: API_URL + '/branches',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createBranch: function(data) {
                return $http({
                    url: API_URL + '/branches',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getBranchByID: function(id) {
                return $http({
                    url: API_URL + '/branches/' + id,
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            updateBranch: function(id,data) {
                return $http({
                    url: API_URL + '/branches/' + id,
                    type: 'PUT',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },
            
            deleteBranch: function(id) {
                return $http({
                    url: API_URL + '/branches/' + id,
                    type: 'DELETE',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
