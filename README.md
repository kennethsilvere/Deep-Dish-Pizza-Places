Neighborhood Map

This is a single-page application featuring a map of a neighborhood having good deep dish pizza places. This application has functionalities, including: map markers to identify popular locations or places, a dropdown filter to easily discover these locations, and a listview to support simple browsing of all locations.

Steps to run this app on a local machine:

(1)Download or clone this repo to your local machine

(2)Unzip the folder and open it

(3)Open the index.html in a web browser

The index.html file will render all the content with all the appropriate functionalities and styling.

-----------------------------------------------------------------------

Actions linked to some main features of this map:


Clicking a marker on the map opens more information about that location.


Clicking a name in the list view opens the information window for the associated marker.


The list of locations is filterable with a dropdown menu. Filtering the list also filters the markers on the map.


The web app is made to be mobile responsive - notice the hamburger menu icon used to hide the list on small screens.

-----------------------------------------------------------------------

Breif overview of the implementation of this project:

 

1.	Knockout is used to handle the list, filter, and any other information on the page that is subject to changing state. Things not handled by Knockout: anything the Maps API is used for, creating markers, tracking click events on markers, making the map, refreshing the map. Tracking click events on list items are handled with Knockout.


2.	Asynchrony and Error Handling. Note that all data APIs used in the project load asynchronously and errors are handled gracefully. In case of error (e.g. in a situation where a third party API does not return the expected result) the webpage to does the following: A message is displayed notifying the user that the data can't be loaded.


3.	Code is written to add a full-screen map to the page using the Google Maps API. For sake of efficiency, the map API is called only once.


4.	A Google Maps API key is included as the value of the key parameter when loading the Google Maps API in index.html: <script src="http://maps.googleapis.com/maps/api/js?libraries=places&key=[MY_API_KEY]"></script> All client-side code is downloaded by the client; therefore, the client downloads this API key - it is not intended to be secret.


5.	Code is written to display map markers identifying 5 locations in Chicago. This app displays those locations by default when the page is loaded.


6.	A list view is implemented to show the set of locations.


7.	A filter option (dropdown) is provided that filters both the list view and the map markers displayed by default on load. The list view and the markers update accordingly in real time.


8.	Functionality is added using third-party APIs to provide information when a map marker or list view entry is clicked (Yelp reviews). 


9.	Functionality is added to animate a map marker when either the list item associated with it or the map marker itself is selected.


10.	Functionality is added to open an infoWindow with the information when either a location is selected from the list view or its map marker is selected directly.


11.	The app's interface is made intuitive to use. Dropdown to filter locations is made to be easy to locate. It is made to be easy to understand what set of locations is being filtered. Selecting a location via list item or map marker causes the map marker to animate by bouncing to indicate that the location has been selected and associated info window will open above the map marker with additional information.

