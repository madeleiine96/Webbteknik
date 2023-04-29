// Initiering av händelsehanterare samt skapandet av objekt
function init() {
      var imgGallery = new ImageViewer("imgViewer"); // Skapar ett bildspel

      document.getElementById("imgViewerMenu").addEventListener("change", function () {
            // Lägger rätt index till bildvisningen som man väljer
            imgGallery.imgIx = this.selectedIndex - 1;
            imgGallery.show(); // Visar rätt bild
      });

      // Menyval
      document.querySelector("#categoryMenu").addEventListener("change", function () {
            imgGallery.imgIx = 0; // Gör bildindex till 0 så första bilden visas vid byte av kategori.
            imgGallery.requestImg("json/images" + this.selectedIndex + ".json");

            // Nollställer menyn
            this.selectedIndex = 0;

            // Skapar en referens till menyn.
            var optionsmenu = document.getElementById("imgViewerMenu");

            // Rensar listan, men behåller "välj bild"
            var L = optionsmenu.options.length - 1;
            for (let i = L; i >= 1; i--) {
                  optionsmenu.remove(i);
            }
      });

      /* -- Huvudbildspel -- */
      // Förra bilden
      document.querySelector("#prevBtn").addEventListener("click", function () {
            imgGallery.prev();
      });

      // Nästa bild
      document.querySelector("#nextBtn").addEventListener("click", function () {
            imgGallery.next();
      });

      // ----- Extramerit -----
      document.querySelector("#autoBtn").addEventListener("click", function (e) {
            imgGallery.auto(e, 3000);
      });

      // ----- Guldstjärna -----
      //		Här ska du lägga kod, om du gör guldstjärneuppgiften

      // Skapar de små bildspelen, requestar rätt fil och lägger till händelsehanterare
      // Minibildspelare 1
      var imgGallerySmall1 = new ImageViewer("viewer1");
      imgGallerySmall1.requestImg("json/images1.json");
      document.querySelector("#viewer1").addEventListener("mouseenter", function () {
            imgGallerySmall1.auto(null, 500);
      });
      document.querySelector("#viewer1").addEventListener("mouseleave", function () {
            imgGallerySmall1.auto(null, null);
      });
      document.querySelector("#viewer1").addEventListener("click", function () {
            imgGallery.requestImg("json/images1.json");
            imgGallery.imgIx = imgGallerySmall1.imgIx;
            imgGallery.show();

            // Skapar en referens till menyn.
            var optionsmenu = document.getElementById("imgViewerMenu");

            // Rensar listan, men behåller "välj bild"
            var L = optionsmenu.options.length - 1;
            for (let i = L; i >= 1; i--) {
                  optionsmenu.remove(i);
            }
      });

      // Minibildspelare 2
      var imgGallerySmall2 = new ImageViewer("viewer2");
      imgGallerySmall2.requestImg("json/images2.json");
      document.querySelector("#viewer2").addEventListener("mouseenter", function () {
            imgGallerySmall2.auto(null, 500);
      });
      document.querySelector("#viewer2").addEventListener("mouseleave", function () {
            imgGallerySmall2.auto(null, null);
      });
      document.querySelector("#viewer2").addEventListener("click", function () {
            imgGallery.requestImg("json/images2.json");
            imgGallery.imgIx = imgGallerySmall2.imgIx;
            imgGallery.show();

            // Skapar en referens till menyn.
            var optionsmenu = document.getElementById("imgViewerMenu");

            // Rensar listan, men behåller "välj bild"
            var L = optionsmenu.options.length - 1;
            for (let i = L; i >= 1; i--) {
                  optionsmenu.remove(i);
            }
      });

      // Minibildspelare 3
      var imgGallerySmall3 = new ImageViewer("viewer3");
      imgGallerySmall3.requestImg("json/images3.json");
      document.querySelector("#viewer3").addEventListener("mouseenter", function () {
            imgGallerySmall3.auto(null, 500);
      });
      document.querySelector("#viewer3").addEventListener("mouseleave", function () {
            imgGallerySmall3.auto(null, null);
      });
      document.querySelector("#viewer3").addEventListener("click", function () {
            imgGallery.requestImg("json/images3.json");
            imgGallery.imgIx = imgGallerySmall3.imgIx;
            imgGallery.show();

            // Skapar en referens till menyn.
            var optionsmenu = document.getElementById("imgViewerMenu");

            // Rensar listan, men behåller "välj bild"
            var L = optionsmenu.options.length - 1;
            for (let i = L; i >= 1; i--) {
                  optionsmenu.remove(i);
            }
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

      // Denna egenskapen finns endast på det stora bildspelet.
      if (id == "imgViewer") {
            this.menu = document.querySelector("#" + id + "Menu");
      }
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
                        self.getImg(request.responseText); // status 200 (OK) --> filen fanns
                  } else
                        document.getElementById("result").innerHTML =
                              "Den begärda resursen fanns inte.";
      };
}; // End requestImg

// Metod för att tolka JSON-koden och lägga in innehållet i objektet som visas i bildspelet
ImageViewer.prototype.getImg = function (JSONcode) {
      // Parametern JSONcode är hela den inlästa JSON-koden
      this.titleElem.innerHTML = JSON.parse(JSONcode).category; // Skriver ut kategorin man valt
      let images = JSON.parse(JSONcode).image; // Alla url-element ligger i arrayen images
      this.list = []; // Rensar eventuell gammal lista.

      // Loopar igenom alla element, och lägger till objekt i listan.
      for (let i = 0; i < images.length; i++) {
            let obj = {
                  url: images[i].url, // Lägger till url
                  caption: images[i].caption, // Lägger till caption
            };
            this.list.push(obj); // Lägger till objektet i listan.

            // Skapar option taggar till undermenyn enbart på stora bildspelet
            if (this.menu) {
                  var newElem = document.createElement("option");
                  var newTextNode = document.createTextNode(images[i].caption);
                  newElem.appendChild(newTextNode);
                  this.menu.appendChild(newElem);
            }
      }
      this.show(); // Visar första bilden
}; // End getImg

// Visar bilden med index imgIx
ImageViewer.prototype.show = function () {
      this.imgElem.src = this.list[this.imgIx].url; // Ändrar rätt src
      this.imgElem.alt = this.list[this.imgIx].caption; // Lägger caption som alt-tagg
      this.captionElem.innerHTML = this.imgIx + 1 + ". " + this.list[this.imgIx].caption; // Lägger till caption
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
