'use strict';

angular.module('accounting')
    .factory('POFactory', function($http, API_URL) {

        return {
            getSupplier: function() {
                return $http({
                    url: API_URL + '/PO',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getBranch: function() {
                return $http({
                    url: API_URL + '/PO/getBranch',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            }, 

            getBank: function() {
                return $http({
                    url: API_URL + '/PO/getBank',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getBranchNames: function() {
                return $http({
                    url: API_URL + '/PO/getBranchNames',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getUnit: function() {
                return $http({
                    url: API_URL + '/PO/getUnit',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getSupplier2: function() {
                return $http({
                    url: API_URL + '/PO/getSupplier2',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getMOP: function() {
                return $http({
                    url: API_URL + '/PO/getMOP',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createPO: function(data) {
                return $http({
                    url: API_URL + '/PO',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            }, 

            getPOLists: function() {
                return $http({
                    url: API_URL + '/PO/getPOLists',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
