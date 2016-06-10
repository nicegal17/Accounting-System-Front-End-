'use strict';

angular.module('accounting')
    .factory('CDVFactory', function($http, API_URL) {

        return {
            getCDV: function() {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getBanks: function() {
                return $http({
                    url: API_URL + '/CDV/getBanks',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctTitles: function() {
                return $http({
                    url: API_URL + '/CDV/getAcctTitles',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVByID: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVByID/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVDetails: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVDetails/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVEntries: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVEntries/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVNum: function() {
                return $http({
                    url: API_URL + '/CDV/getCDVNum',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            createCDV: function(data) {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            updateCDV: function(id, data) {
                return $http({
                    url: API_URL + '/CDV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVInfo: function(filterDate, filterDateTO) {
                return $http({
                    url: API_URL + '/CDV/getCDVInfo',
                    data: {
                        from: filterDate,
                        to: filterDateTO
                    },
                    method: 'POST',
                }).then(function(res){
                    return res.data;
                });
            },
        };
    });
