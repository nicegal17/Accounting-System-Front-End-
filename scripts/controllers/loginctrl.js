'use strict';

angular.module('accounting')
    .controller('loginctrl', function($scope, $state, toastr, AuthenticationFactory) {

        // $scope.userID = {};

        $scope.login = function() {
            console.log('username: ' + $scope.username);
            console.log('password: ' + $scope.password);
            console.log('userid' +  $scope.userID);

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
                    AuthenticationFactory.getUser(JSON.stringify(response.user), response.token);

                    $scope.userID = response.user;
                    console.log('userID', $scope.userID);
                   

                    $state.go('main.dashboard');
                } else {
                    $scope.error = response.msg;
                    toastr.error($scope.error);
                }
            });

            
                    
               
           
        }
    });
