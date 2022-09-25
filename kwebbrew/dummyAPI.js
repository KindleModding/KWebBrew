//===============================//
//                               //
// Copyright Bluebotlaboratories //
//                               //
//===============================//

// DO NOT USE IN PROD, THIS API IS DESIGNED FOR DEV USE ONLY
function fetchData(url, timeout) {
  return new Promise(function (callback) {
    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = url;

    // Add iframe to body
    document.body.appendChild(iframe);

    // Timeout To Remove iframe
    if (timeout !== -1) {
      setTimeout(function () {
        iframe.remove();
      }, timeout || 2000);
    }

    // Add listener to iframe
    iframe.addEventListener("load", function (event) {
      // Get iframe's documentElement and clone it and get the innerHTML
      iframeSource = (event.target.contentDocument.documentElement || event.target.contentWindow.document.documentElement).cloneNode(true).innerHTML;

      // Remove iframe from DOM
      event.target.remove();

      // Resolve promise
      callback(iframeSource.replace('<head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">', '').replace('</pre></body>', ''));
    });
  });
}


function getDirectory(location) {
  return new Promise(function (callback) {
    // Get source of directory listing
    fetchData(location).then(function (data) {
      // Create list
      var files = [
        {
          "name": "devtools",
          "path": "../apps/devtools"
        },
        {
          "name": "file browser",
          "path": "../apps/file browser"
        }
      ];

      callback(files); // Resolve promise
    });
  });
}