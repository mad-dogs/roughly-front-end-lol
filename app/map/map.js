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

	$scope.currentTagging = false;

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

    	if($scope.mode == 'tagging'){
    		console.log('Tagging mode');
    		$scope.hideBottomContent();
    		$scope.showActionsBar();

    	}else if($scope.mode == 'tag-detail'){
    		console.log('tag-detail mode');
    		$scope.showBottomContent();
			$scope.hideActionsBar();

    	}else if($scope.mode == 'begin-run'){
    		console.log('begin-run mode');
    		$scope.showBottomContent();
    		$scope.hideActionsBar();

    	}else if($scope.mode == 'during-run'){
    		console.log('during-run mode');
    		$scope.hideActionsBar();
    		
    	}else if($scope.mode == 'after-run'){
    		console.log('after-run mode');
    		$scope.hideActionsBar();
    		
    	}else if($scope.mode == 'initial'){
    		console.log('initial mode');
    		$scope.hideBottomContent();
    		$scope.hideActionsBar();
    		
    	}

    	$scope.$broadcast ('mode-change', mode);

    }

	$scope.showActionsBar = function(){
		$('#map-page').addClass('show-actions');
		
	}    

	$scope.hideActionsBar = function(){
		$('#map-page').removeClass('show-actions');

	}

	$scope.showBottomContent = function(){
		//Scroll to top
		//Disable scroll
		//Expand map
		//Show bottom bar
		$('#map-page').addClass('small');
		window.dispatchEvent(new Event('resize'));
	}

	$scope.hideBottomContent = function(){
		//Scroll to top
		//Disable scroll
		//Expand map
		//Show bottom bar
		$('#map-page').removeClass('small');
		window.dispatchEvent(new Event('resize'));

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

	var startRunAction = {
		'label': 'Start Run',
		'toRun': function(){
			$scope.gotoMode('begin-run');
		}
	}

	var tagAction = {
		'label': 'Tag People In Need',
		'toRun': function(){
			$scope.gotoMode('tagging');	
		}
	}

	$scope.currentActions.push(startRunAction);
	$scope.currentActions.push(tagAction);

}])

.controller('ContentBelowController', ['$scope', function($scope) {

	$scope.gotoTagForm = function(){

	}

	$scope.gotoStartRunForm = function(){
		
	}

	$scope.gotoDuringRunForm = function(){
		
	}

	$scope.gotoEndRunDetails = function(){
		
	}

	$scope.clear = function(){

	}

	$scope.$on('mode-change', function(e, newMode) {  
        //Update the bottom form
        if(newMode == 'tagging'){
        	$scope.clear();
        }else if(newMode == 'tag-detail'){
        	$scope.gotoTagForm();
        }else if(newMode == 'begin-run'){
        	$scope.gotoStartRunForm();
        }else if(newMode == 'during-run'){
        	$scope.gotoDuringRunForm();
        }else if(newMode == 'after-run'){
        	$scope.gotoEndRunDetails();
        }else if(newMode == 'initial'){
        	$scope.clear();
        }
    });

}])

.controller('BottomActionsController', ['$scope', function($scope) {

	$scope.currentActions = [];

	$scope.currentActions.push({
		'label': 'Tag',
		'toRun': function(){
			console.log('we are tagging a position');

		}
	});

}])

.controller('MapController', ['$scope', '$http', function($scope, $http) {

	//Initialise
	//Create map
	//Get reference 
	//Setup functions to interact with map

	$scope.displayedTags = [];
	$scope.renderedTags = [];

	$scope.map = false;
	$scope.isTrackingLocation = true;

	$scope.$on('receivedUpdateLocation', function(e) {  
        console.log('Map received updated position');       
		if($scope.isTrackingLocation){
			//Re-center map on current location
			$scope.map.panTo(new google.maps.LatLng($scope.currentPosition.coords.latitude, $scope.currentPosition.coords.longitude));
			$scope.map.setZoom(17);
		}
    });

	$scope.initMap = function(){

		$scope.map = new google.maps.Map(document.getElementById('mapFinalContainer'), {
			center: {lat: 0, lng: 0},
			zoom: 17
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

	$scope.pullTagsFromServer = function(){
		$http({
		  	method: 'GET',
		  	url: 'http://roughly-api.herokuapp.com/tag'
		}).then(function successCallback(response) {
		    console.log(response.data._embedded.tag);
		    for(var i = 0; i < response.data._embedded.tag.length; i++){
		    	var element = response.data._embedded.tag[i];
		    	$scope.displayedTags.push(element);
		    	var newMarker = new google.maps.Marker({
			    	position: new google.maps.LatLng(element.position.lat, element.position.lng),
			    	map: $scope.map,
			    	title: 'TAG'
				});
		    }
		}, function errorCallback(response) {
		    
		});
	}

	$scope.initMap();
	$scope.pullTagsFromServer();

	$scope.$on('mode-change', function(e, newMode) {  
        //Update the bottom form
        if(newMode == 'tagging'){
        	$scope.startTrackingUserLocation();
        }else if(newMode == 'tag-detail'){
        	$scope.startTrackingUserLocation();
        }else if(newMode == 'begin-run'){
        	$scope.stopTrackingUserLocation();
        }else if(newMode == 'during-run'){
        	$scope.startTrackingUserLocation();
        }else if(newMode == 'after-run'){
        	$scope.stopTrackingUserLocation();
        }else if(newMode == 'initial'){
        	$scope.startTrackingUserLocation();
        }
    });


}]);