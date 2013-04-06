/*	Set authentication token and appid 
*	WARNING: this is a demo-only key
*	please register on http://api.developer.nokia.com/ 
*	and obtain your own developer's API key 
*/
nokia.Settings.set("appId", "DvO6v80kTSl2iRavPmUp"); 
nokia.Settings.set("authenticationToken", "oTazFPvNi1DP4J5rmgUi-Q");

// Get the DOM node to which we will append the map
var mapContainer = document.getElementById("mapContainer");
// Create a map inside the map container DOM node
var map = new nokia.maps.map.Display(mapContainer, {
	// initial center and zoom level of the map
	center: [52.51, 13.4],
	zoomLevel: 10
});

/* We create a UI notecontainer for example description
 * NoteContainer is a UI helper function and not part of the Nokia Maps API
 * See exampleHelpers.js for implementation details 
 */
 var noteContainer = new NoteContainer({
	id: "basicMapUi",
	parent: document.getElementById("uiContainer"),
	title: "Basic map example",
	content:
		'<p>This example shows how to create a basic map with few lines of code</p>'
});
