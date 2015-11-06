'use strict';

angular.module('accounting')
    .controller('loginctrl', function($scope, $state, $window, toastr, AuthenticationFactory) {
        
        $scope.login = function() {
            console.log('username: ' + $scope.username);
            console.log('password: ' + $scope.password);

            if ($scope.username == '' || _.isEmpty($scope.username)) {
                toastr.warning("Please enter username");
                return;
            }

            if ($scope.password == '' || _.isEmpty($scope.password)) {
                toastr.warning("Please enter password");
                return;
            }

            AuthenticationFactory.Login($scope.username, $scope.password).then(function(response) {
                console.log('response: ', response);

                if (response.success) {
                    AuthenticationFactory.storeUser(JSON.stringify(response.user), response.token);

                    var currentUser = AuthenticationFactory.getUser();
                    currentUser = JSON.parse(currentUser);
                    console.log('currentUser: ', currentUser);

                    $state.go('main.dashboard');
                } else {
                    $scope.error = response.msg;
                    toastr.error($scope.error);
                }
            });
        }
    });
