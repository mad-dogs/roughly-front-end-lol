'use strict';

angular.module('myApp.map', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'map/map.html',
    controller: 'MapPageCtrl'
  });
}])

.controller('MapPageCtrl', [function() {

	

}])

.controller('TopNavController', ['$scope', function($scope) {

	

}])

.controller('ContentBelowController', ['$scope', function($scope) {

	

}])

.controller('BottomActionsController', ['$scope', function($scope) {

	

}])

.controller('MapController', ['$scope', function($scope) {

	

}]);