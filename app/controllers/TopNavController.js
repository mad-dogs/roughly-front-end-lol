angular.module('myApp.map', ['ngRoute'])

.controller('TopNavController', ['$scope', function($scope) {

	var map = this;

	map.test = function(){
		alert('test');
	} 

}]);