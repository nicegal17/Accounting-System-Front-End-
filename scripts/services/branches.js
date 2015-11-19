'use strict';

angular.module('accounting')
    .factory('BranchFactory', function($http, API_URL) {

        return {
            getBranches: function() {
                return $http({
                    url: API_URL + '/branches',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createBranch: function(data) {
                return $http({
                    url: API_URL + '/branches',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getBranchByID: function(id) {
                return $http({
                    url: API_URL + '/branches/getBranchByID/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            updateBranch: function(id,data) {
                return $http({
                    url: API_URL + '/branches/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },
            
            deleteBranch: function(id) {
                return $http({
                    url: API_URL + '/branches/' + id,
                    method: 'DELETE',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
