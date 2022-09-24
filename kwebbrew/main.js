//===============================//
//                               //
// Copyright Bluebotlaboratories //
//                               //
//===============================//

addEventListener("error", function (event) {
  document.body.innerText = event.message + "\nAt: " + event.lineno + ":" + event.colno + "\nIn: " + event.filename;
});

// Button function to get source of file listings and such
function getSource() {
  // Get the source displaying element
  const sourcer = document.getElementById("sourcesource");

  // Fetch data with source callback
  fetchData(document.getElementById("textInput").value).then(function (text) { sourcer.innerText = text; });
}