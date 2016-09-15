'use strict';

angular.module('accounting')
    .factory('JVFactory', function($http, API_URL) {

        return {
            getAcctTitle: function() {
                return $http({
                    url: API_URL + '/JV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            createJV: function(data) {
                return $http({
                    url: API_URL + '/JV',
                    method: 'POST',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            getJVs: function() {
                return $http({
                    url: API_URL + '/JV/getJVs',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getJVDetails: function(id) {
                return $http({
                    url: API_URL + '/JV/getJVDetails/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            // updateJVEntries: function(id, data) {
            //     return $http({
            //         url: API_URL + '/JV/' + id,
            //         method: 'PUT',
            //         data: data
            //     }).then(function(res) {
            //         return res.data;
            //     });
            // },

            approveJV: function(id, data) {
                return $http({
                    url: API_URL + '/JV/approveJV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            cancelJV: function(id, data) {
                return $http({
                    url: API_URL + '/JV/cancelJV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            auditJV: function(id, data) {
                return $http({
                    url: API_URL + '/JV/auditJV/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

             previewJV: function(id) {
                return $http({
                    url: API_URL + '/JV/previewJV/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getJVPK: function(id) {
                return $http({
                    url: API_URL + '/JV/getJVPK/' + id,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

             updateJVEntries: function(id, data) {
                return $http({
                    url: API_URL + '/JV/updateJVEntries/' + id,
                    method: 'PUT',
                    data: data
                }).then(function(res) {
                    return res.data;
                });
            },

            getGJEntries: function(filterDate, filterDateTO) {
                return $http({
                    url: API_URL + '/JV/getGJEntries',
                    data: {
                        from: filterDate,
                        to: filterDateTO
                    },
                    method: 'POST',
                }).then(function(res) {
                    return res.data;
                });
            },
        };
    });
