'use strict';

angular.module('accounting')
    .factory('appAPVFactory', function($http,API_URL) {
        return {
            getAPVNo: function() {
                return $http({
                    url: API_URL + '/appAPV',
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            getAcctEntries: function(apvID) {
                return $http({
                    url: API_URL + '/getAcctEntries/' + apvID,
                    method: 'GET',
                }).then(function(res){
                    return res.data;
                });
            },

            // approveJV: function(id,data) {
            //     $http.put('/api/v1/appJV/'+ id,data).
            //     success(function(data) {
            //         deferred.resolve(data);
            //         return cb();
            //     }).
            //     error(function(err) {
            //         deferred.reject(err);
            //         return cb(err);
            //     }.bind(this));

            //     return deferred.promise;
            // },

            // denyJV: function(id,data) {
            //     $http.put('/api/v1/appJV/denyJV/'+ id,data).
            //     success(function(data) {
            //         deferred.resolve(data);
            //         return cb();
            //     }).
            //     error(function(err) {
            //         deferred.reject(err);
            //         return cb(err);
            //     }.bind(this));

            //     return deferred.promise;
            // },
        };
    });
