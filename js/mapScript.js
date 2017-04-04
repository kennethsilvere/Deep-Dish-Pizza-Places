var self;

function VM(){


	
	self=this;	
	
	self.map;
	

	self.pizzaPlaceValue = ko.observable(0);


	self.locations = [
			{title: "Atino's Pizza", value: 0, location: {lat: 41.867588, lng: -87.641953}},
			{title: "Bellonas Pizza", value: 1, location: {lat: 41.960971, lng: -87.714997}},
			{title: "Dimo's Pizza", value: 2, location: {lat: 41.945206, lng: -87.654694}},
			{title: "Gino's East", value: 3, location: {lat: 41.896002, lng: -87.623033}},
        	{title: "Lou Malnati's Pizzeria", value: 4, location: {lat: 41.871506, lng: -87.627310}},          
        	{title: "Pequod's Pizza", value: 5, location: {lat: 41.921931, lng: -87.664308}}
		         
        	];
	
	self.fullBounds;
	
	
	
	self.markers = [];
	

	self.closeOptions = function(){
		if($(window).width() < 996){
			var display = $(".options-box").css("display");
			if(display != "none"){
				$(".options-box").hide();
				$(".responsive-title").show();
			}
		}
	}
	
	
	
	self.showListing = function(){
	
		self.closeOptions();
		self.hideListings();
    	var i = self.pizzaPlaceValue().value;	
		var bounds = self.fullBounds;
		self.markers[i].setMap(self.map); 
		bounds.extend(self.markers[i].position);	
		self.map.fitBounds(bounds); 

	}


	self.showPlace = function(v){
		var i = v.value;
		self.closeOptions();
		self.hideListings();	
		var bounds = self.fullBounds;
		self.markers[i].setMap(self.map); 
		bounds.extend(self.markers[i].position);	
		self.map.fitBounds(bounds); 

	}
	
	

	self.showListings = function(){
		
		self.closeOptions();
    	var bounds = new google.maps.LatLngBounds();
		self.fullBounds = bounds;
	
    	for(var i = 0; i < self.markers.length; i++){
		
			self.markers[i].setMap(self.map);
        	bounds.extend(self.markers[i].position);
		
        	}
		self.map.fitBounds(bounds);
		}


	self.hideListings = function() {
		self.closeOptions();
        for (var i = 0; i < self.markers.length; i++) {
        	self.markers[i].setMap(null);
        	}
	}



	
	self.showMenu = function(){
		var display = $(".options-box").css("display");
		
		if(display != "none"){
			$(".responsive-title").show();
			$(".options-box").hide();
		}else{
			$(".responsive-title").hide();
			$(".options-box").show();
		}
			
	}
	
	
self.toggleBounce = function(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
	  
	  for(var i = 0; i < self.markers.length; i++){
		  self.markers[i].setAnimation(null);
	  }
	  
	  
	   marker.setAnimation(google.maps.Animation.BOUNCE);	  	
	  
  }
}
	
	

}

ko.applyBindings(new VM());





function initMap(){

	// Constructor creates a new map - only center and zoom are required.
    self.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.908412, lng: -87.67},
		zoom: 12,
		mapTypeControl: false
		
	});
	

        
	var largeInfowindow = new google.maps.InfoWindow();
      
	
// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < self.locations.length; i++) {
    
		// Get the position from the location array.
		var position = self.locations[i].location;    
		
		var title = self.locations[i].title;
		


		var marker = new google.maps.Marker({
				position: position,
            	title: title,
            	animation: google.maps.Animation.DROP,
            	id: i
          	});

		

		marker.addListener('click', function(){
			
			self.toggleBounce(this);
			
		});
						   
		// Push the marker to our array of markers.
        self.markers.push(marker);
          
			
		// Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
          });
            
	}

	
}
    

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.

function populateInfoWindow(marker, infowindow) {

	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		
		
		// Clear the infowindow content to give the streetview time to load.
		infowindow.setContent('');
        infowindow.marker = marker;
          
			
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
			
	for(var i = 0; i < self.markers.length; i++){
		  self.markers[i].setAnimation(null);
	  }
			
			});
          
	
		var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        
		
			
		// In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
		function getStreetView(data, status) {
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;
         
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation,
					marker.position);
                
				infowindow.setContent('<div><b>' + marker.title + '</b></div><div id="pano"></div>');
                
				var panoramaOptions = {
					position: nearStreetViewLocation,
					pov: {
						heading: heading,
						pitch: 30
						}
					};
				
				
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById('pano'), panoramaOptions);
				} else {
              infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }
          
			
			// Use streetview service to get the closest streetview image within
          	// 50 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          
			
			// Open the infowindow on the correct marker.
          infowindow.open(self.map, marker);
        }
      }
    





// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }


function loadPage(){
	self.showListings();
}