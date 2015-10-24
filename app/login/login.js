'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$http', function($scope, $http) {
 
    $scope.formData = {};

    $scope.submit = function() {
        
      $http({
        method  : 'POST',
        url     : '',
        data    : $.param($scope.formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {
        console.log(data);

        if (!data.success) {
          // if not successful, bind errors to error variables
          $scope.errorName = data.errors.name;
          $scope.errorSuperhero = data.errors.superheroAlias;
        } else {
          // if successful, bind success message to message
          $scope.message = data.message;
        }
      });
    };

}]);