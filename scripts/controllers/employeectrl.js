 'use strict';

 angular.module('accounting')
     .controller('employeectrl', function($scope, $filter, EmployeeFactory, PositionFactory, toastr, ngDialog, ngTableParams) {

         $scope.saveEmployee = function() {
             console.log('employee: ', $scope.employee);

             if ($scope.isUpdate === true) {
                 EmployeeFactory.updateEmployee($scope.employee.empID, $scope.employee).then(function(data) {
                    if (!_.isEmpty(data)) {
                        if (data.success == 'true') {
                            toastr.success(data.msg, 'Update Employee Details');
                        }else {
                            toastr.error(data.msg, 'Error');
                        }
                    }     
                 });
             } else {
                 EmployeeFactory.createEmployee($scope.employee).then(function(data) {
                     console.log('data: ', data);
                     if (!_.isEmpty(data)) {
                        if (data.success == 'true') {
                            toastr.success(data.msg, 'Add New Employee');
                        }else
                            toastr.error(data.msg, 'Error');
                     }    
                 });
             }

             $scope.employee = {};
             $scope.refresh();

             $scope.isDisable = true;
         };

         $scope.addNew = function() {
             $scope.isUpdate = false;
             $scope.employee = {};
             $scope.isDisable = false;
         };

         $scope.cancel = function() {
             $scope.employee = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;
         };

         $scope.refresh = function() {
             $scope.tableParams.reload();
             $scope.searchEmployee = "";
         };

         $scope.getIDPos = function(id) {
             $scope.employee = {};
             EmployeeFactory.getPosID(id).then(function(data) {
                 if (data.length > 0) {
                     $scope.employee = data[0];
                     $scope.employee.position = data[0].idPosition;
                 }
             });
         };

         $scope.getEmployeeID = function(id) {
             $scope.employee = {};
             $scope.isDisable = false;
             EmployeeFactory.getEID(id).then(function(data) {
                 if (data.length > 0) {
                    $scope.employee = data[0];
                    $scope.employee.position = data[0].idPosition;
                    console.log('employee: ', $scope.employee);
                    $scope.isUpdate = true;
                 }
             });
         };

         $scope.$watch("searchEmployee", function() {
             $scope.tableParams.reload();
         });

         function init() {
             $scope.employees = {};
             $scope.employee = {};
             $scope.positions = {};
             $scope.isUpdate = false;
             $scope.isDisable = true;

             $scope.tableParams = new ngTableParams({
                 page: 1, // show first page
                 count: 10, // count per page
                 sorting: {
                     name: 'asc' // initial sorting
                 }
             }, {
                 getData: function($defer, params) {
                     EmployeeFactory.getEmployees().then(function(data) {
                         var orderedData = {};

                         if ($scope.searchEmployee) {
                             orderedData = $filter('filter')(data, $scope.searchEmployee);
                             orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                         } else {
                             orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                         }

                         params.total(data.length);
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                     });
                 }
             });

             PositionFactory.getPositions().then(function(data) {
                 $scope.positions = data;
                 $scope.employee.position = data[0].idPosition;
             });
         }

         init();
     });
