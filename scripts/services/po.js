'use strict';

angular.module('accounting')
    .factory('POFactory', function($http, API_URL) {

        return {
            getSupplier: function() {
                return $http({
                    url: API_URL + '/PO',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getBranch: function() {
                return $http({
                    url: API_URL + '/PO/getBranch',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            }, 

            getBank: function() {
                return $http({
                    url: API_URL + '/PO/getBank',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getBranchNames: function() {
                return $http({
                    url: API_URL + '/PO/getBranchNames',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getUnit: function() {
                return $http({
                    url: API_URL + '/PO/getUnit',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },  

            getSupplier2: function() {
                return $http({
                    url: API_URL + '/PO/getSupplier2',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getMOP: function() {
                return $http({
                    url: API_URL + '/PO/getMOP',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createPO: function(data) {
                return $http({
                    url: API_URL + '/PO',
                    type: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            }, 

            getPOLists: function() {
                return $http({
                    url: API_URL + '/PO/getPOLists',
                    type: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
