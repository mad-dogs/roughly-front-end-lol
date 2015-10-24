angular.module('myApp.map', ['ngRoute'])

.controller('BottomActionsController', ['$scope', function($scope) {

	var map = this;

	map.test = function(){
		alert('test');
	} 

}]);