function fetchData(url, callback) {
  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = url;

  // Add iframe to body
  document.body.appendChild(iframe);

  // Add listener to iframe
  iframe.addEventListener("load", function (event) {
    // Get iframe's documentElement and clone it and get the innerHTML
    iframeSource = (iframe.contentDocument.documentElement || iframe.contentWindow.document.documentElement).cloneNode(true).innerHTML;

    // Remove iframe from DOM
    document.body.removeChild(iframe);

    // Callback function
    callback(iframeSource);
  });
}


// Button function to get source of file listings and such
function getSource() {
  // Get the source displaying element
  var sourcer = document.getElementById("sourcesource");

  // Fetch data with source callback
  fetchData(document.getElementById("textInput").value, function (text) { sourcer.innerText = text; });
}