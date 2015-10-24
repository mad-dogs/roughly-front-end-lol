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

	$scope.currentContent = '';

	$scope.gotoTagForm = function(){
		$scope.currentContent = 'views/tagdetails.html';
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

.controller('BottomActionsController', ['$scope', 'MapCenterService', 'TaggingService', function($scope, mapCenterService, taggingService) {

	$scope.currentActions = [];

	$scope.currentActions.push({
		'label': 'Tag',
		'toRun': function(){
			console.log('we are tagging a position');
			var center = mapCenterService.getCenter();
			taggingService.setPosition(center);
			$scope.gotoMode('tag-detail');
		}
	});

}])

.controller('MapController', ['$scope', '$http', 'MapCenterService', function($scope, $http, mapCenterService) {

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
		mapCenterService.setMap($scope.map);

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

		//Clean up
		$scope.displayedTags = [];
		for(var i = 0; i < $scope.renderedTags; i++){
			$scope.renderedTags[i].setMap(null);
		}

		$http({
		  	method: 'GET',
		  	url: 'http://roughly-api.herokuapp.com/tag'
		}).then(function successCallback(response) {
		    console.log(response.data._embedded.tag);
		    for(var i = 0; i < response.data._embedded.tag.length; i++){
		    	var element = response.data._embedded.tag[i];
		    	var newMarker = new google.maps.Marker({
			    	position: new google.maps.LatLng(element.position.lat, element.position.lng),
			    	map: $scope.map,
			    	title: 'TAG'
				});
				element.marker = newMarker;
				newMarker.element = element;
		    	$scope.displayedTags.push(element);
		    	$scope.renderedTags.push(newMarker);
		    }
		}, function errorCallback(response) {
		    
		});
	}

	$scope.initMap();
	$scope.pullTagsFromServer();

	$scope.$on('mode-change', function(e, newMode) {  
        //Update the bottom form
        if(newMode == 'tagging'){
        	$scope.stopTrackingUserLocation();
        }else if(newMode == 'tag-detail'){
        	$scope.stopTrackingUserLocation();
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

}])

.controller('TagDetailsForm', ['$scope', '$http', 'TaggingService', function($scope, $http, taggingService) {

	$scope.numPeople = 0;
	$scope.numDogs = 0;
	$scope.selectedType = '1';

	$scope.submitTag = function(){

		//make lat lng object
		var position = {
			lat: 55,
			lng: 3
		}

		//Send tag to servers
		$http({
			headers: {'Content-Type': 'application/json'},
		  	method: 'POST',
		  	url: 'http://roughly-api.herokuapp.com/tag',
		  	data: {position: position, numberOfPeople: $scope.numPeople, numberOfDogs: $scope.numDogs, tagType: {id: parseInt($scope.selectedType)}}

		}).then(function successCallback(response) {
		    
			//We are happy

		}, function errorCallback(response) {
		    
		});

	}

}])

.service('MapCenterService', function() {
  var self = this;
  self.currentMap = false;

  self.setMap = function(map){
	self.currentMap = map;
  }

  self.getCenter = function(){
  	if(self.currentMap == false){
  		return false;
  	}
  	return self.currentMap.getCenter();
  }

})

.service('TaggingService', function() {
  	var self = this;
  	self.currentPosition = false;
	self.currentInfo = {};

	self.setPosition = function(position){
		self.currentPosition = position;
	}

	self.setData = function(data){
		self.currentInfo = data;
	}

 	self.submit = function(){
 		//Submit the current tag to the server
 		//Reject if data not complete
 	}

});
