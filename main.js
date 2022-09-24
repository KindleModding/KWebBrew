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


function getDirectory(location) {
  return new Promise(function (callback) {
    fetchData(location).then(function (data) {
      var files = [];

      const tagReg = new RegExp('<a(\n|.)*?(?=<\/a>)', "gim");
      const hrefReg = new RegExp('href="(\n|.)*?(?=")', 'gim');
      const tagRemovalReg = new RegExp('<a(\n|.)*?>', 'gim');

      const anchorTags = Array.from(data.matchAll(tagReg));

      for (var i=0; i < anchorTags.length; i++) {
        const source = Array.from(anchorTags[i][0].matchAll(hrefReg));

        files.push({
          "name": anchorTags[i][0].replace(tagRemovalReg, '').toString(),
          "path": source[0][0].substring(6).toString()
        });
      }

      callback(files);
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