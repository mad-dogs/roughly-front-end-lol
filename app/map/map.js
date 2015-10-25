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
			$scope.watchId = navigator.geolocation.getCurrentPosition($scope.gotPosition);
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
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 1000);
	}

	$scope.hideBottomContent = function(){
		//Scroll to top
		//Disable scroll
		//Expand map
		//Show bottom bar
		$('#map-page').removeClass('small');
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'));
		}, 1000);

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
		'label': 'Deliver',
		'toRun': function(){
			$scope.gotoMode('begin-run');
		}
	}

	var tagAction = {
		'label': 'Spot',
		'toRun': function(){
			$scope.gotoMode('tag-detail');	
		}
	}

	var cancelAction = {
		'label': 'Cancel',
		'toRun': function(){
			$scope.gotoMode('initial');	
		}
	}

	$scope.currentActions.push(startRunAction);
	$scope.currentActions.push(tagAction);

	$scope.$on('mode-change', function(e, newMode) {  
		//Update the bottom form
		if(newMode == 'tagging'){
			$scope.currentActions = [cancelAction];
		}else if(newMode == 'tag-detail'){
			$scope.currentActions = [cancelAction];
		}else if(newMode == 'begin-run'){
			$scope.currentActions = [cancelAction];
		}else if(newMode == 'during-run'){
			$scope.currentActions = [cancelAction];
		}else if(newMode == 'after-run'){
			$scope.currentActions = [cancelAction];
		}else if(newMode == 'initial'){
			$scope.currentActions = [startRunAction,tagAction];
		}
	});

}])

.controller('ContentBelowController', ['$scope', function($scope) {

	$scope.currentContent = '';

	$scope.gotoTagForm = function(){
		$scope.currentContent = 'views/tagdetails.html';
	}

	$scope.gotoStartRunForm = function(){
		$scope.currentContent = 'views/startrun.html';		
	}

	$scope.gotoDuringRunForm = function(){
		$scope.currentContent = 'views/duringrun.html';
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

.controller('MapController', ['$scope', '$http', 'MapCenterService', 'GlobalData',
	function($scope, $http, mapCenterService, globalData) {

	//Initialise
	//Create map
	//Get reference 
	//Setup functions to interact with map

	$scope.displayedTags = [];
	$scope.renderedTags = [];

	// Watch for changes on globalData.tags.
	$scope.$watchCollection(function(){
		return globalData.tags;
	}, function(newArr, oldArr) {
		$scope.updateMapWithTags();
	});

	$scope.showCrosshair = false;

	$scope.map = false;
	$scope.isTrackingLocation = true;

	$scope.$on('receivedUpdateLocation', function(e) {  
		console.log('Map received updated position');       
		if($scope.isTrackingLocation){
			//Re-center map on current location
			$scope.map.panTo(new google.maps.LatLng($scope.currentPosition.coords.latitude, $scope.currentPosition.coords.longitude));
			$scope.map.setZoom(16);
		}
	});

	$scope.initMap = function(){

		$scope.map = new google.maps.Map(document.getElementById('mapFinalContainer'), {
			center: {lat: 0, lng: 0},
			zoom: 16,
			streetViewControl: false,
			zoomControl: false,
			mapTypeControl: false
		});		

		mapCenterService.setMap($scope.map);

	}

	$scope.destroyMap = function(){

	}

	$scope.updateMapWithTags = function(){
		for(var i = 0; i < globalData.tags.length; i++){
	    	
        var tag = globalData.tags[i];

        var image = {
          url: tag.needItems.length > 0
            ? 'https://raw.githubusercontent.com/mad-dogs/resources/master/need-pin.png'
            : 'https://raw.githubusercontent.com/mad-dogs/resources/master/pin.png',
          
          size: new google.maps.Size(24, 42),
          scaledSize: new google.maps.Size(24, 42)
          // The origin for this image is (0, 0).
          // origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          // anchor: new google.maps.Point(0, 42)
        };

	    	var newMarker = new google.maps.Marker({
		    	position: new google.maps.LatLng(tag.position.lat, tag.position.lng),
		    	map: $scope.map,
		    	title: 'TAG',
          icon: image
			});

			(function(newMarker){
				tag.marker = newMarker;
				newMarker.tag = tag;
				$scope.displayedTags.push(tag);
				$scope.renderedTags.push(newMarker);

				if(tag.needItems.length > 0){

					var contentString = '<div class="infobox-title">Needs</div>';

					for(var j = 0; j < tag.needItems.length ; j++){
						var need = tag.needItems[j];
						contentString += '<div class="infobox-need">'+need.description+'</div>';
					}

					var infoWindow = new google.maps.InfoWindow({
						content: contentString
					});

					newMarker.infoWindow = infoWindow;

					newMarker.addListener('click', function() {
						this.infoWindow.open($scope.map, newMarker);
					});
				}
				
			})(newMarker);

		}
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

			$scope.tags = response.data._embedded.tag;
			$scope.updateMapWithTags();
		}, function errorCallback(response) {
			
		});
	}

	$scope.initMap();
	$scope.pullTagsFromServer();

	$scope.$on('mode-change', function(e, newMode) {  
		//Update the bottom form
		if(newMode == 'tagging'){
			$scope.stopTrackingUserLocation();
			$scope.showCrosshair = true;
		}else if(newMode == 'tag-detail'){
			$scope.stopTrackingUserLocation();
			$scope.showCrosshair = true;
		}else if(newMode == 'begin-run'){
			$scope.stopTrackingUserLocation();
			$scope.showCrosshair = false;
		}else if(newMode == 'during-run'){
			$scope.startTrackingUserLocation();
			$scope.showCrosshair = false;
		}else if(newMode == 'after-run'){
			$scope.stopTrackingUserLocation();
			$scope.showCrosshair = false;
		}else if(newMode == 'initial'){
			$scope.startTrackingUserLocation();
			$scope.showCrosshair = false;
		}
	});

}])

.controller('TagDetailsForm', ['$scope', '$http', 'MapCenterService', 'GlobalData',
	function($scope, $http, mapCenterService, globalData) {


	$scope.numPeople = 1;
	$scope.numDogs = 0;
	$scope.needs = [];
	$scope.items = globalData.itemsNoMeal;
	$scope.tagTypes = globalData.tagTypes;
	$scope.selectedType = globalData.tagTypes[0].id;

	$scope.addNeed = function(){
		var index = $scope.needs.length;
		if (index >= $scope.items.length){
			index = 0;
		}
		var newNeed = {
			needType: $scope.items[index].id,
			needQuantity: 1,
		}

			$scope.needs.push(newNeed);
		}

		$scope.removeNeed = function(need){
			$scope.needs = $scope.needs.filter(function (el) {
				return el !== need;
			});
		}

		$scope.submitTag = function(){

		//make lat lng object
		var position = {
			lat: mapCenterService.getCenter().lat(),
			lng: mapCenterService.getCenter().lng()
		}

		var needs = [];
		for(var i = 0; i < $scope.needs.length; i++){
			for(var j = 0; j < $scope.needs[i].needQuantity; j++){
				var need = {
					item: 'item/'+$scope.needs[i].needType
				}
				needs.push(need);
			}
		}

		//Send tag to servers
		var tagToAdd = {
			position: position,
			numberOfPeople: $scope.numPeople,
			numberOfDogs: $scope.numDogs,
			tagType: '/tagtype/'+$scope.selectedType,
			needs: needs
		};

		$http({
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
			url: 'http://roughly-api.herokuapp.com/tag',
			data: tagToAdd

		}).then(function successCallback(response) {
			
			//We are happy, go back to initial mode
			$scope.gotoMode('initial');
			globalData.tags.push(tagToAdd);

		}, function errorCallback(response) {
			
		});

	}

}])

.controller('StartRunForm', ['$scope', '$http', 'MapCenterService', 'GlobalData',
	function($scope, $http, mapCenterService, globalData) {

	$scope.inventory = [];
	$scope.items = globalData.items;

	// Add meals as a default to inventory.
	var meals = {
		itemType: $scope.items[0].id,
		itemQuantity: 20,
	}
	$scope.inventory.push(meals);

	$scope.addInventoryItem = function(){
		var index = $scope.inventory.length;
		if (index >= $scope.items.length){
			index = 0;
		}
		var newItem = {
			itemType: $scope.items[index].id,
			itemQuantity: 1,
		}

		$scope.inventory.push(newItem);
	}

	$scope.removeItem = function(item){
		$scope.inventory = $scope.inventory.filter(function (el) {
            return el !== item;
        });
	}

	$scope.submitRun = function(){

		var runToAdd = {
			inventory: []
		};

		for (var i = 0; i < $scope.inventory.length; i++) {
			runToAdd.inventory.push({
				item: 'item/' + $scope.inventory[i].itemType
			});
		}

		$http({
			headers: {'Content-Type': 'application/json'},
		  	method: 'POST',
		  	url: 'http://roughly-api.herokuapp.com/run',
		  	data: runToAdd

		}).then(function successCallback(response) {

			var location = response.headers('Location');

			//We are happy, go back to initial mode
			$http({
				method: 'GET',
				url: location
			}).then(function successCallback(response){

				$scope.gotoMode('during-run');
				globalData.currentRun = response.data;

			}, function errorCallback(){

			});

		}, function errorCallback(response) {
		    
		});

	}

}])

.controller('DuringRunForm', ['$scope', '$http', 'MapCenterService', 'GlobalData',
	function($scope, $http, mapCenterService, globalData) {

	$scope.run = globalData.currentRun;

	console.log($scope.run);

}])

.service('MapCenterService', ['GlobalData', function(globalData) {
	var self = this;
	self.currentMap = false;
	self.directions = false;

	self.setMap = function(map){
		self.currentMap = map;
		self.directions = new google.maps.DirectionsRenderer;
		self.directions.setMap(map);
	}

	self.getCenter = function(){
		if(self.currentMap == false){
			return false;
		}
		return self.currentMap.getCenter();
	}

	self.plotRoute = function(currentPosition){
		var directionsService = new google.maps.DirectionsService;

		var startEnd = currentPosition;

		var tags = globalData.tags;

		var waypts = [];

		for(var i = 0; i<tags.length;i++){

			var tag = tags[i];
			waypts.push({location: new google.maps.LatLng(tag.position.lat, tag.position.lng), stopover: false});

		}

		directionsService.route({
			origin: startEnd,
			destination: startEnd,
			waypoints: waypts,
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				self.directions.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}

}])

.service('GlobalData', function($http){
	var self = this;
	self.items = [];
	self.itemsNoMeal = [];
	self.tagTypes = [];
	self.tags = [];
	self.currentRun = null;

	// Load in items
	$http({
		method: 'GET',
		url: 'http://roughly-api.herokuapp.com/item'
	}).then(function successCallback(response) {
		console.log(response.data._embedded.item);

	    self.items = response.data._embedded.item;
	    self.items.reverse();

	    for (var i = 0; i < self.items.length; i++) {
	    	if (self.items[i].sourcingTime > -1){
	    		self.itemsNoMeal.push(self.items[i]);
	    	}
	    }

	}, function errorCallback(response) {
		
	});

	// And tag types.
	$http({
		method: 'GET',
		url: 'http://roughly-api.herokuapp.com/tagtype'
	}).then(function successCallback(response) {
		console.log(response.data._embedded.tagtype);

		self.tagTypes = response.data._embedded.tagtype;
	}, function errorCallback(response) {
		
	});

	// Also tags.
	$http({
		method: 'GET',
		url: 'http://roughly-api.herokuapp.com/tag'
	}).then(function successCallback(response) {
		console.log(response.data._embedded.tag);

		self.tags = response.data._embedded.tag;
	}, function errorCallback(response) {
		
	});

});
