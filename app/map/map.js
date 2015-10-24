'use strict';

angular.module('myApp.map', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'map/map.html',
    controller: 'MapPageCtrl'
  });
}])

.controller('MapPageCtrl', ['$scope', function($scope) {

	$scope.mode = 'initial';
	$scope.currentPosition = false;

	$scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.gotPosition, $scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

	$scope.showBottomContent = function(){
		//Hide bottom bar
		//Shrink map
		//Enable scroll
	}

	$scope.hideBottomContent = function(){
		//Scroll to top
		//Disable scroll
		//Expand map
		//Show bottom bar
	}

	$scope.showError = function(){
		alert('An error happened');
	}

	$scope.gotPosition = function(position){
		$scope.currentPosition = position;
		$scope.$broadcast ('receivedUpdateLocation');
	}

    $scope.getLocation();

}])

.controller('TopNavController', ['$scope', function($scope) {

	$scope.currentActions = [];

	$scope.currentActions.push({
		'label': 'Nav 1',
		'toRun': function(){
			alert('this');
		}
	});

	$scope.currentActions.push({
		'label': 'Nav 2',
		'toRun': function(){
			alert('this');
		}
	});

}])

.controller('ContentBelowController', ['$scope', function($scope) {

	$scope.gotoTagForm = function(){

	}

	$scope.gotoStartRunForm = function(){
		
	}

	$scope.gotoDuringRunForm = function(){
		
	}

}])

.controller('BottomActionsController', ['$scope', function($scope) {

	$scope.currentActions = [];

	$scope.currentActions.push({
		'label': 'Click Me',
		'toRun': function(){
			alert('this');
		}
	});

}])

.controller('MapController', ['$scope', function($scope) {

	//Initialise
	//Create map
	//Get reference 
	//Setup functions to interact with map

	$scope.map = false;

	$scope.$on('receivedUpdateLocation', function(e) {  
        console.log('Map received updated position');       
    });

	$scope.initMap = function(){

		$scope.map = new google.maps.Map(document.getElementById('mapFinalContainer'), {
			center: {lat: -34.397, lng: 150.644},
			zoom: 8
		});		

	}

	$scope.destroyMap = function(){

	}

	$scope.initMap();


}]);