// Globala variabler
var linkListElem; // Referens till div-elementet för länkarna
var courseListElem; // Referens till div-element där valda kurser ska läggas.

// Initiering av globala variabler och händelsehanterare.
function init() {
      linkListElem = document.getElementById("linkList");
      document.getElementById("linkBtn").addEventListener("click", listLinks);

      // Array med referenser till alla li-element i den andra section
      let courseElems = document.querySelectorAll(
            "main section:nth-of-type(2) div:first-of-type li"
      );
      for (let i = 0; i < courseElems.length; i++) {
            courseElems[i].addEventListener("click", addCourse);
            courseElems[i].style.cursor = "pointer";
      }
      courseListElem = document.getElementById("courseList");

      document.getElementById("teacherBtn").addEventListener("click", requestTeacherList); // Används i extramerit - Anropar att kalla in XML-filen direkt
} // End init
window.addEventListener("load", init); // init aktiveras då sidan är inladdad
// ---------------------------------------------------------------

// Kopiera alla länkar ur huvudtexten och lägg upp dem i en lista.
function listLinks() {
      // Array med referenser till alla a-element i den första section
      var linkElements = document.querySelectorAll("main section:nth-of-type(1) div a");
      // Loop som klonar element och lägger till element och attribut
      for (let i = 0; i < linkElements.length; i++) {
            var clonedElem = linkElements[i].cloneNode(true); // Klonar rätt element
            clonedElem.setAttribute("target", "_blank"); // Lägger till attribut
            var newElem = document.createElement("p"); // Nytt element
            newElem.appendChild(clonedElem); // Lägger in det klonade elementet i det nya elementet
            linkListElem.appendChild(newElem); // Lägger in det nya elementet i div-elementet "linkList"
      }
} // End listLinks

// ---------------------------------------------------------------

// Den kurs användaren klickat på, läggs in överst i kurslistan.
function addCourse() {
      // Referens till alla p-element som blivit tillaggda i "courseList"
      var pElements = document.querySelectorAll("main section:nth-of-type(2) div:nth-of-type(2) p");
      var alreadyAdded = null; // variabel som håller reda på om elementet finns redan

      // Loopen går igenom alla element som finns, och jämför med det vi vill lägga till
      for (let i = 0; i < pElements.length; i++) {
            if (this.innerHTML == pElements[i].innerHTML) {
                  alreadyAdded = true; // Meddelar att elementet redan finns
            }
      }

      // Om elementet inte finns läggs det till i listan
      if (alreadyAdded != true) {
            var newTextNode = document.createTextNode(this.innerHTML); // Ny textnod
            var newElem = document.createElement("p"); // Nytt element
            newElem.appendChild(newTextNode); // lägger till textnoden i elemetet
            newElem.style.cursor = "pointer";
            newElem.addEventListener("click", removeCourse);
            var firstPelemInList = courseListElem.querySelector("p"); // Hämtar upp det första elementet i listan
            courseListElem.insertBefore(newElem, firstPelemInList); // Lägger till det nya elementet först i listan
      }
} // End addCourse

// Den kurs användaren klickat på i kurslistan, tas bort.
function removeCourse() {
      this.parentNode.removeChild(this);
} // End removeCourse

// ---------------------------------------------------------------

// ----- Extramerit -----

// Gör ett Ajax-anrop för att läsa in rätt fil
function requestTeacherList() {
      var request = new XMLHttpRequest(); // Object för Ajax-anropet
      request.open("GET", "xml/teachers.xml", true); // Skickar med rätt länk till filen
      request.send(null); // Skicka begäran till servern
      request.onreadystatechange = function () {
            // Funktion för att avläsa status i kommunikationen
            if (request.readyState == 4)
                  if (request.status == 200)
                        // readyState 4 --> kommunikationen är klar
                        addTeachers(request.responseXML);
                  // status 200 (OK) --> filen fanns
                  else alert("Den begärda resursen finns inte.");
      };
} // End requestTeacherList

// Funktion som lägger till kursansvariglärare i kurslistan
function addTeachers(XMLcode) {
      var courseElem = XMLcode.getElementsByTagName("course"); // Lista med alla "courses"

      // Referenser till alla kurserna
      var courseList = document.querySelectorAll("main section:nth-of-type(3) div:first-of-type li");

      // Loopar igenom alla kurserna i XML-filen och sparar ner information i variabler
      for (let i = 0; i < courseElem.length; i++) {
            var teacher = courseElem[i].getElementsByTagName("teacher")[0];
            teacher = teacher.firstChild.data; // Sparar ner datan i variabeln
            var teacherLink = courseElem[i].getElementsByTagName("link")[0];
            var url = teacherLink.getAttribute("url");
            var TeachercourseCode = courseElem[i].getAttribute("code");

            // Loopar igenom kurslistan som finns på hemsidan
            for (let j = 0; j < courseList.length; j++) {
                  var courseCode = courseList[j].innerHTML.substring(0, 6); // Sparar kurskoden som en variabel

                  // Om kurskoden från kursen stämmer överens med lärarens, så läggs läraren till i listan
                  if (courseCode == TeachercourseCode) {
                        var newElem1 = document.createElement("br"); // Nytt element <br>
                        var newElem2 = document.createElement("a"); // Nytt element <a>
                        newElem2.setAttribute("target", "_blank"); // Lägger till attribut
                        var newTextNode = document.createTextNode(teacher); // Ny textnod för lärarens namn
                        newElem2.appendChild(newTextNode); // Lägger till lärarens namn i <a>
                        newElem2.setAttribute("href", url); // Lägger till länk

                        // Lägger till elementen på kurselementet
                        courseList[j].appendChild(newElem1);
                        courseList[j].appendChild(newElem2);
                  }
            }
      }
}
// End addTeachers
