addEventListener("error", function (event) {
  document.body.innerText = event.message + "\nAt: " + event.lineno + ":" + event.colno + "\nIn: " + event.filename;
});

function fetchData(url) {
  return new Promise(function (callback) {
    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = url;

    // Add iframe to body
    document.body.appendChild(iframe);

    // Add listener to iframe
    iframe.addEventListener("load", function (event) {
      // Get iframe's documentElement and clone it and get the innerHTML
      iframeSource = (event.target.contentDocument.documentElement || event.target.contentWindow.document.documentElement).cloneNode(true).innerHTML;

      // Remove iframe from DOM
      document.body.removeChild(event.target);

      // Callback function
      callback(iframeSource);
    });
  });
}


// Button function to get source of file listings and such
function getSource() {
  // Get the source displaying element
  const sourcer = document.getElementById("sourcesource");

  // Fetch data with source callback
  fetchData(document.getElementById("textInput").value).then(function (text) { sourcer.innerText = text; });
}