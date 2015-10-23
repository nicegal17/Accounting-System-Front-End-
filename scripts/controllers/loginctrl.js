'use strict';

angular.module('accounting')
    .controller('loginctrl', function($scope, $state, toastr, AuthenticationFactory) {

        $scope.login = function() {
            console.log('username: ' + $scope.username);
            console.log('password: ' + $scope.password);
            
            if ($scope.username == '' || _.isEmpty($scope.username)) {
                toastr.error("Please enter username");
                return;
            }

            if ($scope.password == '' || _.isEmpty($scope.password)) {
                toastr.error("Please enter password");
                return;
            }

            /*AuthenticationFactory.Login($scope.username, $scope.password, function(response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $state.go('login');
                } else {
                    $scope.error = response.message;
                    $.notify($scope.error, "error");
                }
            });*/
            $state.go('main.dashboard');
        };

    });
