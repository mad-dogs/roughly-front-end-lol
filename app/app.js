'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
<<<<<<< HEAD
  'myApp.login',
  'myApp.view2',
=======
  'myApp.home',
  'myApp.map',
>>>>>>> c48f9e507a9531239292a4c3f6d2784f3b84482f
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
