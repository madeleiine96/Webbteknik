// Initiering av händelsehanterare samt skapandet av objekt
function init() {
      var bildSpel = new ImageViewer("imgViewer"); // Skapar ett bildspel

      // Menyval
      document.querySelector("#categoryMenu").addEventListener("change", function () {
            bildSpel.imgIx = 0; // Gör bildindex till 0 så första bilden visas vid byte av kategori.
            bildSpel.requestImg("xml/images" + this.selectedIndex + ".xml");

            this.selectedIndex = 0;
      });

      /* -- Huvudbildspel -- */
      // Förra bilden
      document.querySelector("#prevBtn").addEventListener("click", function () {
            bildSpel.prev();
      });

      // Nästa bild
      document.querySelector("#nextBtn").addEventListener("click", function () {
            bildSpel.next();
      });

      // ----- Extramerit -----
      document.querySelector("#autoBtn").addEventListener("click", function (e) {
            bildSpel.auto(e, 3000);
      });

      // ----- Guldstjärna -----
      //		Här ska du lägga kod, om du gör guldstjärneuppgiften

      // Skapar de små bildspelen, requestar rätt fil och lägger till händelsehanterare
      // Minibildspelare 1
      miniBildSpel1 = new ImageViewer("viewer1");
      miniBildSpel1.requestImg("xml/images1.xml");
      document.querySelector("#viewer1").addEventListener("mouseenter", function () {
            miniBildSpel1.auto(null, 500);
      });
      document.querySelector("#viewer1").addEventListener("mouseleave", function () {
            miniBildSpel1.auto(null, null);
      });
      document.querySelector("#viewer1").addEventListener("click", function () {
            bildSpel.requestImg("xml/images1.xml");
            bildSpel.imgIx = miniBildSpel1.imgIx;
            bildSpel.show();
      });

      // Minibildspelare 2
      miniBildSpel2 = new ImageViewer("viewer2");
      miniBildSpel2.requestImg("xml/images2.xml");
      document.querySelector("#viewer2").addEventListener("mouseenter", function () {
            miniBildSpel2.auto(null, 500);
      });
      document.querySelector("#viewer2").addEventListener("mouseleave", function () {
            miniBildSpel2.auto(null, null);
      });
      document.querySelector("#viewer2").addEventListener("click", function () {
            bildSpel.requestImg("xml/images2.xml");
            bildSpel.imgIx = miniBildSpel2.imgIx;
            bildSpel.show();
      });

      // Minibildspelare 3
      miniBildSpel3 = new ImageViewer("viewer3");
      miniBildSpel3.requestImg("xml/images3.xml");
      document.querySelector("#viewer3").addEventListener("mouseenter", function () {
            miniBildSpel3.auto(null, 500);
      });
      document.querySelector("#viewer3").addEventListener("mouseleave", function () {
            miniBildSpel3.auto(null, null);
      });
      document.querySelector("#viewer3").addEventListener("click", function () {
            bildSpel.requestImg("xml/images3.xml");
            bildSpel.imgIx = miniBildSpel3.imgIx;
            bildSpel.show();
      });
} // End init
window.addEventListener("load", init);

// ---------------------------------------------------------------

// Constructor för objeket ImageViewer
function ImageViewer(id) {
      this.titleElem = document.querySelector("#" + id + " h3"); // Referens till element för bildspelets titel
      this.imgElem = document.querySelector("#" + id + " img"); // Referens till img-element för bildspelet
      this.captionElem = document.querySelector("#" + id + " p"); // Referens till element för bildtext
      this.list = []; // Array med objekt, som kommer innehålla url och caption till bilderna
      this.imgIx = 0; // Index för aktuell bild
      this.timer = null; // Referens till timern för bildspelet
}

// Metod som gör ett Ajax-anrop för att läsa in begärd fil
ImageViewer.prototype.requestImg = function (file) {
      // Parametern file används i url:en för den fil som ska läsas in
      var self = this; // Skapar en variabel som pekar på objeketet för att använda senare i funktionen.
      let request = new XMLHttpRequest(); // Object för Ajax-anropet
      request.open("GET", file, true);
      request.send(null); // Skicka begäran till servern
      request.onreadystatechange = function () {
            // Funktion för att avläsa status i kommunikationen
            if (request.readyState == 4)
                  if (request.status == 200) {
                        // readyState 4 --> kommunikationen är klar
                        self.getImg(request.responseXML); // status 200 (OK) --> filen fanns
                  } else
                        document.getElementById("result").innerHTML =
                              "Den begärda resursen fanns inte.";
      };
}; // End requestImg

// Metod för att tolka XML-koden och lägga in innehållet i objektet som visas i bildspelet
ImageViewer.prototype.getImg = function (XMLcode) {
      // Parametern XMLcode är hela den inlästa XML-koden

      this.titleElem.innerHTML = XMLcode.getElementsByTagName("category")[0].firstChild.data; // Skriver ut kategorin man valt
      let urlElems = XMLcode.getElementsByTagName("url"); // Alla url-element
      let captionElems = XMLcode.getElementsByTagName("caption"); // Alla caption-element
      this.list = []; // Rensar eventuell gammal lista.
      // Loopar igenom alla element, och lägger till objekt i listan.
      for (let i = 0; i < urlElems.length; i++) {
            let obj = {
                  urls: urlElems[i].firstChild.data, // Lägger till url
                  captions: captionElems[i].firstChild.data, // Lägger till caption
            };
            this.list.push(obj); // Lägger till objektet i listan.
      }
      this.show(); // Visar första bilden
}; // End getImg

// Visar bilden med index imgIx
ImageViewer.prototype.show = function () {
      this.imgElem.src = this.list[this.imgIx].urls; // Ändrar rätt src
      this.imgElem.alt = this.list[this.imgIx].captions; // Lägger caption som alt-tagg
      this.captionElem.innerHTML = this.imgIx + 1 + ". " + this.list[this.imgIx].captions; // Lägger till caption
}; // End show

// Visar föregående bild
ImageViewer.prototype.prev = function () {
      if (this.imgIx > 0) this.imgIx--;
      else this.imgIx = this.list.length - 1; // Gå runt till sista bilden
      this.show();
}; // End prev

// Visar nästa bild
ImageViewer.prototype.next = function () {
      if (this.imgIx < this.list.length - 1) this.imgIx++;
      else this.imgIx = 0; // Gå runt till första bilden
      this.show();
}; // End next

// ----- Extramerit -----

// Starta/stoppa automatisk bildvisning
ImageViewer.prototype.auto = function (e, interval) {
      if (this.timer == null) {
            // Start
            var self = this; // Skapar en variabel som pekar på objeketet för att använda senare i funktionen.
            this.timer = setInterval(function () {
                  // Går till nästa bild och visar bilden
                  if (self.imgIx < self.list.length - 1) self.imgIx++;
                  else self.imgIx = 0; // Gå runt till första bilden
                  self.show();
            }, interval);
            if (e) e.currentTarget.style.backgroundColor = "green";
      } else {
            // Stopp
            clearInterval(this.timer);
            this.timer = null;
            if (e) e.currentTarget.style.backgroundColor = "white";
      }
}; // End auto
