'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
 
    $scope.formData = { email : "bob@bobmail.com", password : "password" };

    $scope.submit = function() {
      
      $http({
        method  : 'POST',
        url     : 'http://roughly-api.herokuapp.com/login',
        data    : $.param($scope.formData),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(data) {

        $location.path('/map');

      })
      .error(function(data) {
      
          alert("Log in failed. Please check your email and password then try again");

      });

    };

}]);