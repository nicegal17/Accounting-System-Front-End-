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

            getBankName: function() {
                return $http({
                    url: API_URL + '/CDV/getBankName',
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

            createCDV: function(data) {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'POST',
                    data: data
                }).then(function(res){
                    return res.data;
                });
            },

            getCDVID: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVID/' + id,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },
            // getCDVNum: function() {
            //     return $http({
            //         url: API_URL + '/CDV/cdvnum',
            //         method: 'GET',
            //     }).then(function(res){
            //         return res.data;
            //     });
            // },

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
