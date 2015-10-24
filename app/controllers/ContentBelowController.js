angular.module('myApp.map', ['ngRoute'])

.controller('ContentBelowController', ['$scope', function($scope) {

	var map = this;

	map.test = function(){
		alert('test');
	} 

}]);