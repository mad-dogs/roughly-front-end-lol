angular.module('myApp.map', ['ngRoute'])

.controller('MapController', ['$scope', function($scope) {

	var map = this;

	map.test = function(){
		alert('test');
	} 

}]);