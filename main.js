addEventListener("error", function (event) {
  document.body.innerText = event.message + "\nAt: " + event.lineno + ":" + event.colno + "\nIn: " + event.filename;
});

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
      }, timeout||2000);
    }

    // Add listener to iframe
    iframe.addEventListener("load", function (event) {
      // Get iframe's documentElement and clone it and get the innerHTML
      iframeSource = (event.target.contentDocument.documentElement || event.target.contentWindow.document.documentElement).cloneNode(true).innerHTML;

      // Remove iframe from DOM
      event.target.remove();

      // Resolve promise
      callback(iframeSource);
    });
  });
}


function getDirectory(location) {
  return new Promise(function (callback) {
    // Get source of directory listing
    fetchData(location).then(function (data) {
      // Create list
      var files = [];

      // Define regex for extracting different things
      const tagReg = new RegExp('<a(\n|.)*?(?=<\/a>)', "gim");
      const hrefReg = new RegExp('href="(\n|.)*?(?=")', 'gim');
      const tagRemovalReg = new RegExp('<a(\n|.)*?>', 'gim');

      // Get anchor tags (without closing tag)
      const anchorTags = Array.from(data.matchAll(tagReg));

      for (var i=0; i < anchorTags.length; i++) {
        // Get href source (URL)
        const source = Array.from(anchorTags[i][0].matchAll(hrefReg));

        files.push({
          "name": anchorTags[i][0].replace(tagRemovalReg, ''), // Remove anchor tags from match to get only their innerText
          "path": source[0][0].substring(6) // Remove the href=" part of the href source
        });
      }

      callback(files); // Resolve promise
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