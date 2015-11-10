'use strict';

angular.module('accounting')
    .factory('SearchJVFactory', function($http, API_URL) {

        return {
            getJVNo: function() {
                return $http({
                    url: API_URL + '/SearchJV',
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },

            getAcctEntries: function(JID) {
                return $http({
                    url: API_URL + '/SearchJV/getAcctEntries/' + JID,
                    method: 'GET',
                }).then(function(res) {
                    return res.data;
                });
            },


            // getAcctEntries: function(JID,callback) {
            //     var cb = callback || angular.noop;
            //     var deferred = $q.defer();

            //      $http.get('/api/v1/appJV/getAcctEntries/' + JID)
            //    // $http.get('/api/v1/SearchJV/getAcctEntries/' + JID)
            //         .success(function(data) {
            //             deferred.resolve(data);
            //             return cb();
            //         })
            //         .error(function(err) {
            //             deferred.reject(err);
            //             return cb(err);
            //         }.bind(this));

            //     return deferred.promise;
            // },
        };
    });
