var self;

function VM() {

    self = this;

    self.map = null;

    self.infowindow = null;

    self.pizzaPlaceValue = ko.observable(0);

    self.locations = [
        { title: "Atino's Pizza", value: 0, location: { lat: 41.867588, lng: -87.641953 }, yelp_id: "atinos-pizza-chicago", neighborhood: "" },
        { title: "Bellonas Pizza", value: 1, location: { lat: 41.960971, lng: -87.714997 }, yelp_id: "bellonas-pizza-chicago", neighborhood: "Irving Park" },
        { title: "Dimo's Pizza", value: 2, location: { lat: 41.945206, lng: -87.654694 }, yelp_id: "dimos-pizza-chicago-2", neighborhood: "Wrigley Field" },
        { title: "Gino's East", value: 3, location: { lat: 41.896002, lng: -87.623033 }, yelp_id: "the-original-ginos-east-of-chicago-chicago-2", neighborhood: "The Magnificient Mile" },
        { title: "Lou Malnati's Pizzeria", value: 4, location: { lat: 41.871506, lng: -87.627310 }, yelp_id: "lou-malnatis-pizzeria-chicago-9", neighborhood: "South Loop" },
        { title: "Pequod's Pizza", value: 5, location: { lat: 41.921931, lng: -87.664308 }, yelp_id: "pequods-pizzeria-chicago", neighborhood: "Lincoln Park" }

    ];
	
	
    self.fullBounds = null;


    self.markers = [];


    self.closeOptions = function () {
        if ($(window).width() < 996) {
            var display = $(".options-box").css("display");
            if (display != "none") {
                $(".options-box").hide();
                $(".responsive-title").show();
            }
        }
    };



    self.showListing = function () {
        self.closeOptions();
        
		
		var k;
		var nh = self.pizzaPlaceValue().neighborhood;
		if(nh !==""){
			self.hideListings();
		for(k=5 ; k >= 0; k--){
		 	if(nh == self.locations[k].neighborhood){
				if(self.locations[k].value == 4){
					self.locations[0].neighborhood = "South Loop";
				}
				
				var i = k;
				var bounds = self.fullBounds;
				self.markers[i].setMap(self.map);
				bounds.extend(self.markers[i].position);
				self.map.fitBounds(bounds);
				self.toggleBounce(self.markers[i]);
				populateInfoWindow(self.markers[i], self.infowindow);
				
				if(k === 0){
				self.locations[0].neighborhood = "";
				}
		 	}
		}
		
		}
		
	};


    self.showPlace = function (v) {
        var i = v.value;
        self.closeOptions();
        var bounds = self.fullBounds;
        self.markers[i].setMap(self.map);
        bounds.extend(self.markers[i].position);
        self.map.fitBounds(bounds);
		self.toggleBounce(self.markers[i]);
		populateInfoWindow(self.markers[i], self.infowindow);
		
    };


    self.showListings = function () {
        self.closeOptions();
        var bounds = new google.maps.LatLngBounds();
        self.fullBounds = bounds;

        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(self.map);
            bounds.extend(self.markers[i].position);
        }

        self.map.fitBounds(bounds);
    };


    self.hideListings = function () {
        self.closeOptions();
        for (var i = 0; i < self.markers.length; i++) {
            self.markers[i].setMap(null);
        }
    };




    self.showMenu = function () {
        var display = $(".options-box").css("display");

        if (display != "none") {
            $(".responsive-title").show();
            $(".options-box").hide();
        } else {
            $(".responsive-title").hide();
            $(".options-box").show();
        }

    };


    self.toggleBounce = function (marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setAnimation(null);
            }

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1400);

        }
    };


    self.business = ko.observable('');

    self.location = ko.observable('');

    self.reviews = ko.observableArray();

    self.updateList = function (businessId) {
        self.yelp(businessId, null);
    };


    self.yelp = function (businessId, marker) {

        function nonce_generate(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        var yelp_url = 'https://api.yelp.com/v2/business/' + marker.yelp_id;

        var auth = {
            consumerKey: "f2W7hjgGMMAvwXlj0ZxAWA",
            consumerSecret: "DyxOgG0XEfir-hdM4yUxQmO9T-8",
            accessToken: "jN6lHgZkRrSXAsf1nMfwPVvKr1ixexO8",
            accessTokenSecret: "OO1dkdyVzt3G19HwYx9PDR5ZKvI",
            serviceProvider: {
                signatureMethod: "HMAC-SHA1"
            }
        };

        var parameters = {
            oauth_consumer_key: auth.consumerKey,
            oauth_token: auth.accessToken,
            oauth_nonce: nonce_generate(),
            oauth_timestamp: Math.floor(Date.now() / 1000),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0',
            callback: ''
        };


        var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, auth.consumerSecret, auth.accessTokenSecret);

        parameters.oauth_signature = encodedSignature;

        var selectedMarker = null;

        var errorTimeout = setTimeout(function () {
            alert("Cannot render info! Sorry :(");
        }, 8000);


        $.ajax({
            url: yelp_url,
            data: parameters,
            cache: true,
            dataType: 'jsonp',
            success: function (results) {
                clearTimeout(errorTimeout);
                self.business(results);
                self.location(results.location.display_address);
                self.reviews([]);
                results.reviews.forEach(function (review) {
                    self.reviews.push({
                        review: review.excerpt + " - " + review.user.name
                    });
                });

                var contentString = '<div class="content">' + '<h4>Yelp Review</h4>' +
                    '<h1 id="firstHeading" class="firstHeading">' + results.name + '</h1>' +
                    '<div id="bodyContent">' +
                    '<p>' + results.reviews[results.reviews.length - 1].excerpt + " - " + results.reviews[results.reviews.length - 1].user.name + '</p>' +
                    '<p><a href="' + results.url + '">' + results.url + '</a> ' +
                    '</div>' +
                    '</div>';

                if (self.infowindow !== null) {
                    self.infowindow.close();
                }

                self.infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                // Open the infowindow on the correct marker.
                self.infowindow.open(self.map, marker);
            },
            error: function(err){
                alert("Cannot render info! Sorry :(");
            }
        });
    };
}

ko.applyBindings(new VM());





function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.908412, lng: -87.67 },
        zoom: 12,
        mapTypeControl: false

    });

    var largeInfowindow = new google.maps.InfoWindow();


    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < self.locations.length; i++) {

        // Get the position from the location array.
        var position = self.locations[i].location;

        var title = self.locations[i].title;

        var yelp = self.locations[i].yelp_id;

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            yelp_id: yelp
        });

        marker.addListener('click', function () {
            self.toggleBounce(this);
        });

        // Push the marker to our array of markers.
        self.markers.push(marker);

        self.infowindow = largeInfowindow;

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, self.infowindow);
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
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;

            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setAnimation(null);
            }

        });

        self.yelp(marker.yelp_id, marker);

    }
}



// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

function loadPage() {
    self.showListings();
}

function errorHandlingFunction() {
    $("#map").html("<h1>Sorry cannot load google maps  :(</h1>");
}