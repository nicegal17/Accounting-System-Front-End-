'use strict';

angular.module('accounting')
    .factory('APVFactory', function($http, API_URL) {

        return {
            getAPV: function() {
                return $http({
                    url: API_URL + '/APV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctTitles: function() {
                return $http({
                    url: API_URL + '/APV/getAcctTitles',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createAPV: function(data) {
                return $http({
                    url: API_URL + '/APV',
                    method: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            getAPVDetails: function(id) {
                return $http({
                    url: API_URL + '/APV/getAPVDetails/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            updateAPV: function(id, data) {
                return $http({
                    url: API_URL + '/APV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            approveAPV: function(id, data) {
                return $http({
                    url: API_URL + '/APV/approveAPV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            cancelAPV: function(id, data) {
                return $http({
                    url: API_URL + '/APV/cancelAPV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            previewAPV: function(id) {
                return $http({
                    url: API_URL + '/APV/previewAPV/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            auditAPV: function(id, data) {
                return $http({
                    url: API_URL + '/APV/auditAPV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            // getAPVEntries: function(filterDate, filterDateTO) {
            //     return $http({
            //         url: API_URL + '/APV/getAPVEntries',
            //         data: {
            //             from: filterDate,
            //             to: filterDateTO
            //         },
            //         method: 'POST',
            //     }).then(function(res){
            //         return res.data;
            //     });
            // },
        };
    });
