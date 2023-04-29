// Globala variabler
var subjectMenuElem, courseMenuElem; // Referenser till select-elementen för menyerna
var subjectInfoElem, courseListElem; // Referenser till div-elementen där inläst data ska skrivas

// Initiering av globala variabler och händelsehanterare
function init() {
      subjectMenuElem = document.getElementById("subjectMenu");
      courseMenuElem = document.getElementById("courseMenu");
      subjectInfoElem = document.getElementById("subjectInfo");
      courseListElem = document.getElementById("courseList");
      subjectMenuElem.addEventListener("change", selectSubject);
      courseMenuElem.addEventListener("change", selectCourses);
} // End init
window.addEventListener("load", init); // init aktiveras då sidan är inladdad

// ----- Meny 1 -----

// Avläser menyn för val av ämne
function selectSubject() {
      var subject = this.selectedIndex; // Valt ämne av användaren
      requestDataSubject(subject); // Anropar funktionen och har valt ämne som parameter
      this.selectedIndex = 0; // Återställer menyn
} // End selectSubject

// Gör ett Ajax-anrop för att läsa in rätt fil
function requestDataSubject(index) {
      // index är id:t på sidan som ska hämtas
      var request = new XMLHttpRequest(); // Object för Ajax-anropet
      request.open("GET", "getSubInfo.php?file=https://wt3.enur.se/subjects.xml&id=" + index, true); // Skickar med rätt länk till filen
      request.send(null); // Skicka begäran till servern
      request.onreadystatechange = function () {
            // Funktion för att avläsa status i kommunikationen
            if (request.readyState == 4)
                  if (request.status == 200)
                        // readyState 4 --> kommunikationen är klar
                        getSubjectData(request.responseXML);
                  // status 200 (OK) --> filen fanns
                  else subjectInfoElem.innerHTML = "Den begärda resursen finns inte.";
      };
} // End requestDataSubject

// Funktion som bearbetar och skriver ut XML-koden
function getSubjectData(XMLcode) {
      var subjectElems = XMLcode.getElementsByTagName("subject"); // Lista med alla "subject"
      var HTMLcode = ""; // Textsträng med ny HTML-kod som skapas
      // Loopar igenom alla "subject" och lägger till dem i HTMLcode på lämpligt sätt.
      var subjectName = subjectElems[i].getElementsByTagName("name")[0].firstChild.data;
      var subjectInfo = subjectElems[i].getElementsByTagName("info")[0].firstChild.data;
      HTMLcode += "<h3>" + subjectName + "</h3>";
      HTMLcode += "<p>" + subjectInfo + "</p>";
      subjectInfoElem.innerHTML = HTMLcode; // Skriver ut informationen till användaren
} // End getSubjectData

// ----- Meny 2 -----

// Avläser menyn för val av ämne att se kurser
function selectCourses() {
      var course = this.selectedIndex; //Valt ämne av användaren
      requestDataCourse(course); // Anropar funktionen och har vald kurslista som parameter
      this.selectedIndex = 0; // Återställer menyn
} // End selectCourses

// Gör ett Ajax-anrop för att läsa in rätt fil
function requestDataCourse(index) {
      // index är "id:t" på sidan som ska hämtas
      var request = new XMLHttpRequest(); // Object för Ajax-anropet
      request.open("GET", "xml/courselist" + index + ".xml", true); // Skickar med rätt länk till filen
      request.send(null); // Skicka begäran till servern
      request.onreadystatechange = function () {
            // Funktion för att avläsa status i kommunikationen
            if (request.readyState == 4)
                  if (request.status == 200)
                        // readyState 4 --> kommunikationen är klar
                        getCourseData(request.responseXML);
                  // status 200 (OK) --> filen fanns
                  else courseListElem.innerHTML = "Den begärda resursen finns inte.";
      };
} // End requestDataCourse

// Funktion som bearbetar och skriver ut XML-koden
function getCourseData(XMLcode) {
      var HTMLcode = ""; // Textsträng med ny HTML-kod som skapas
      var subject = XMLcode.getElementsByTagName("subject")[0]; // Hämtar vilket ämne det är
      var courseElems = XMLcode.getElementsByTagName("course"); // Lista med alla element inom en kurs
      HTMLcode += "<h3>" + subject.firstChild.data + "</h3><ul style='list-style:none;'>"; // Skriver ut rubriken samt förbereder koden

      for (let i = 0; i < courseElems.length; i++) {
            // Referenser till olika element och attribut i aktuellt kurs-element

            var courseCode = courseElems[i].getElementsByTagName("code")[0];
            var courseTitle = courseElems[i].getElementsByTagName("title")[0];
            var courseCredits = courseElems[i].getElementsByTagName("credits")[0];
            var moreInfo = courseElems[i].getElementsByTagName("moreinfo")[0];
            var url = moreInfo.getAttribute("url"); // Titeln på kursen blir till en länk
            HTMLcode += "<li style='padding-bottom: 20px;'>" + courseCode.firstChild.data + ", ";
            HTMLcode += "<a href='" + url + "'>" + courseTitle.firstChild.data + "</a>, ";
            HTMLcode += courseCredits.firstChild.data + "hp";

            // Ifall det finns kontaktinformation skrivs denna ut.
            var courseContact = courseElems[i].getElementsByTagName("contact");
            for (let j = 0; j < courseContact.length; j++) {
                  var courseTeacher = courseContact[j].getElementsByTagName("name")[0];
                  HTMLcode += ", Kontaktperson: " + courseTeacher.firstChild.data;
            }
            HTMLcode += "</li>"; // Avslutar listobjektet
      }
      HTMLcode += "</ul>"; // Avslutar listan
      courseListElem.innerHTML = HTMLcode; // Skriver ut informationen till användaren
} // End getCourseData
