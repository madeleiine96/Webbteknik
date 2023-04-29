// Globala variabler
var resElem; // Referens till elementet för resultat

// Initiering av globala variabler och requestar data.
function init() {
      resElem = document.getElementById("result");
      requestData();
} // End init

window.addEventListener("load", init);

// -----------------------------------------------------------------------------------------

// Gör ett Ajax-anrop för att läsa in begärd fil
function requestData() {
      //
      let request = new XMLHttpRequest(); // Object för Ajax-anropet
      request.open("GET", "data/booklist_romance.json", true);
      request.send(null); // Skicka begäran till servern
      request.onreadystatechange = function () {
            // Funktion för att avläsa status i kommunikationen
            if (request.readyState == 4)
                  if (request.status == 200)
                        // readyState 4 --> kommunikationen är klar
                        getData(request.responseText); // status 200 (OK) --> filen fanns
                  else resElem.innerHTML = "Den begärda resursen finns inte.";
      };
} // End requestData

// Tolka JSON-koden och skriver ut
function getData(JSONtext) {
      var booklist = JSON.parse(JSONtext).booklist; // Array med alla böcker i boklistan
      var genre = JSON.parse(JSONtext).genre; // Hämtar genren

      switch (
            genre // Översätter genren från engelska till svenska
      ) {
            case "Romance":
                  genre = "Romantik";
                  break;
      }

      var HTMLcode = ""; // Sträng med HTML-kod som skapas
      HTMLcode += "<h2>" + genre + "</h2>"; // Lägger till genren

      // Loopar igenom boklistan och lägger till alla böcker i HTML-koden
      for (let i = 0; i < booklist.length; i++) {
            HTMLcode +=
                  "<div><h3>" +
                  booklist[i].title +
                  "\t(" +
                  booklist[i].language +
                  ")" +
                  "</h3>" +
                  "<p><b>Författare:</b> " +
                  booklist[i].author.firstName +
                  " " +
                  booklist[i].author.lastName +
                  "</p>" +
                  "<p><b>Beskrivning:</b> " +
                  booklist[i].plot +
                  "</p>" +
                  "<p><b>Antal sidor:</b> " +
                  booklist[i].pageNumber +
                  "</p>" +
                  "<p><b>Förlag:</b> " +
                  booklist[i].publisher +
                  "</p>" +
                  "<p><b>ISBN:</b> " +
                  booklist[i].bookedition.ISBN +
                  "</p>" +
                  "<p><b>Utgiven år:</b> " +
                  booklist[i].bookedition.publishYear +
                  "</p>" +
                  "<p><b>Bokomslag:</b> <img src='" +
                  booklist[i].bookcover.image +
                  "'/></p>" +
                  "<p><b><a href='" +
                  booklist[i].buyBookLink +
                  "'>Köp boken här</a></b></p>" +
                  "</div><hr>";
      }
      // Skriver ut resultatet i HTML-koden
      resElem.innerHTML = HTMLcode;
} // End getData
