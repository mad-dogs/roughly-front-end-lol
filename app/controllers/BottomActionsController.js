angular.module('myApp.map', ['ngRoute'])

.controller('BottomActionsController', ['$scope', function($scope) {

	alert('here');

	$scope.currentActions = [];

	$scope.currentActions.push({
		'label': 'Click Me',
		'toRun': function(){
			alert('this');
		}
	});

}]);