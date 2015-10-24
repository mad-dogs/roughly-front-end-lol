'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location) {
 
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

          alert(data.errors.name);

        } else {
      
          $location.path('/map');
          
        }
      })
      .error(function(data) {
      
        alert("Couldn't connect to the server");

      });

    };

}]);