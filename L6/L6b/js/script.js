// Globala variabler
var myMap; // Objekt för kartan
var myMarkers = []; // Array med markeringar
var userMarker; // Objekt för markering där användaren klickar
const markerData = [
      // Data för markeringar som hör till knapparna
      { position: { lat: 50.800288, lng: -1.107818 }, title: "Historic Dockyard" },
      { position: { lat: 50.790397, lng: -1.104818 }, title: "Portsmouth Cathedral" },
      { position: { lat: 50.800729, lng: -1.090011 }, title: "Primark Portsmouth" },
      { position: { lat: 50.795567, lng: -1.107998 }, title: "Spinnaker Tower" },
      { position: { lat: 50.797291, lng: -1.091581 }, title: "Portsmouth Kommunhus" },
];
var mapLocationElem; // Element för utskrift av koordinater
var myApiKey = "2ec0d698734efad5a23ddce638e0b5cd"; // Ersätt DIN-API-KEY med din egen Flickr API key
var flickrImgElem; // Referens till element där bilderna ska visas

// Initiering av programmet
function init() {
      initMap();
      mapLocationElem = document.getElementById("mapLocation");
      flickrImgElem = document.getElementById("flickrImg");
      var addrBtns = document.querySelectorAll("#addrBtns button");

      // Ändrar namn på adresserna och lägger till händelse och index
      for (let i = 0; i < markerData.length; i++) {
            addrBtns[i].innerHTML = markerData[i].title;
            addrBtns[i].addEventListener("click", showAddrMarker);
            addrBtns[i].setAttribute("data-ix", i);
      }
} // End init
window.addEventListener("load", init);

// -----------------------------------------------------------------------------------------

// Skapa en karta och markeringar
function initMap() {
      myMap = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 50.796495, lng: -1.088748 },
            zoom: 14,
            styles: [
                  { featureType: "poi", stylers: [{ visibility: "off" }] }, // No points of interest.
                  { featureType: "transit.station", stylers: [{ visibility: "off" }] }, // No bus stations, etc.
            ],
      });
      for (let i = 0; i < markerData.length; i++) {
            let newMarker = new google.maps.Marker(markerData[i]); // Objekt för markering
            myMarkers.push(newMarker);
      }
      userMarker = null;
      google.maps.event.addListener(myMap, "click", newUserMarker);
} // End initMap

// Sätt markerns position till var användaren klickade och lägg in markern på kartan.
function newUserMarker(e) {
      hideMarkers();
      userMarker = new google.maps.Marker();
      userMarker.setPosition(e.latLng);
      userMarker.setMap(myMap);

      // Skriver ut positionen
      mapLocationElem.innerHTML = "Latitud: " + e.latLng.lat() + "\t Longitud: " + e.latLng.lng();

      requestImgsByLocation(e.latLng.lat(), e.latLng.lng());
} // End newUserMarker

// Visa marker för den adressknapp som användaren klickat på
function showAddrMarker(e) {
      hideMarkers(); // Döljer alla markeringar
      var ix = e.currentTarget.getAttribute("data-ix"); // Hämtar in index för markören

      // Visar markören på kartan
      myMarkers[ix].setMap(myMap);
} // End showAddrMarker

// Dölj alla markeringar
function hideMarkers() {
      for (let i = 0; i < myMarkers.length; i++) {
            myMarkers[i].setMap(null);
      }
      if (userMarker) userMarker.setMap(null);
} // End hideMarkers

// ----- Foton från Flickr ----- Extramerit

// Ajax-begäran av nya bilder
function requestImgsByLocation(lat, lon) {
      let request = new XMLHttpRequest(); // Object för Ajax-anropet

      //Argument är en plats där bilderna ska visas ifrån
      request.open(
            "GET",
            "https://api.flickr.com/services/rest/?api_key=" +
                  myApiKey +
                  "&method=flickr.photos.search&lat=" +
                  lat +
                  "&lon=" +
                  lon +
                  "&per_page=3&has_geo=1&format=json&nojsoncallback=1",
            true
      );
      request.send(null); // Skicka begäran till servern
      request.onreadystatechange = function () {
            // Funktion för att avläsa status i kommunikationen
            if (request.readyState == 4)
                  if (request.status == 200) showMoreImgs(request.responseText);
                  else flickrImgElem.innerHTML = "Den begärda resursen finns inte.";
      };
} // End requestImgsByLocation

// Tolka svaret och visa upp bilderna.
function showMoreImgs(response) {
      response = JSON.parse(response);
      flickrImgElem.innerHTML = "";
      for (let i = 0; i < response.photos.photo.length; i++) {
            let photo = response.photos.photo[i]; // Ett foto i svaret
            let imgUrl =
                  "https://live.staticflickr.com/" +
                  photo.server +
                  "/" +
                  photo.id +
                  "_" +
                  photo.secret +
                  "_s.jpg"; // Adress till en bild
            let newElem = document.createElement("img"); // Nytt img-element
            newElem.setAttribute("src", imgUrl);
            flickrImgElem.appendChild(newElem);
      }
} // End showMoreImgs
