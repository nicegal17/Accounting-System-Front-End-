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
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVByID: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVByID/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVDetails: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVDetails/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVEntries: function(id) {
                return $http({
                    url: API_URL + '/CDV/getCDVEntries/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVNum: function() {
                return $http({
                    url: API_URL + '/CDV/getCDVNum',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createCDV: function(data) {
                return $http({
                    url: API_URL + '/CDV',
                    method: 'POST',
                    data: data
                }).then(function(res) {
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

            previewCDV: function(id) {
                return $http({
                    url: API_URL + '/CDV/previewCDV/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            approveCDV: function(id, data) {
                return $http({
                    url: API_URL + '/CDV/approveCDV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            cancelCDV: function(id, data) {
                return $http({
                    url: API_URL + '/CDV/cancelCDV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            auditCDV: function(id, data) {
                return $http({
                    url: API_URL + '/CDV/auditCDV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVInfo: function(sdate1, sdate2) {
                return $http({
                    url: API_URL + '/CDV/getCDVInfo?sdate1=' + sdate1 + '&' + 'sdate2=' + sdate2,
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },

            getCDVTotal: function(sdate1, sdate2) {
                return $http({
                    url: API_URL + '/CDV/getCDVTotal?sdate1=' + sdate1 + '&' + 'sdate2=' + sdate2,
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
