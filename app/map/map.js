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

	$scope.watchId = false;

	$scope.startTrackingLocation = function () {
        if (navigator.geolocation) {
            $scope.watchId = navigator.geolocation.watchPosition($scope.gotPosition);
        }
        else {
            alert('No geolocation');
        }
    }

    $scope.stopTrackingLocation = function() {
        if (navigator.geolocation && $scope.watchId !== false) {
        	navigator.geolocation.clearWatch($scope.watchId);
        	$scope.watchId = false;
        }
    }

    $scope.gotoMode = function(mode){
    	$scope.mode = mode;
    }

	$scope.showActionsBar = function(){
		
	}    

	$scope.hideActionsBar = function(){
		
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

    $scope.startTrackingLocation();

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
	$scope.isTrackingLocation = false;

	$scope.$on('receivedUpdateLocation', function(e) {  
        console.log('Map received updated position');       
		if($scope.isTrackingLocation){
			//Re-center map on current location
		}
    });

	$scope.initMap = function(){

		$scope.map = new google.maps.Map(document.getElementById('mapFinalContainer'), {
			center: {lat: -34.397, lng: 150.644},
			zoom: 8
		});		

	}

	$scope.destroyMap = function(){

	}

	$scope.startTrackingUserLocation = function(){
		$scope.isTrackingLocation = true;
	}

	$scope.stopTrackingUserLocation = function(){
		$scope.isTrackingLocation = false;
	}

	$scope.initMap();


}]);