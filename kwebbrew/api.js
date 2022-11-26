//===============================//
//                               //
// Copyright Bluebotlaboratories //
//                               //
//===============================//



function fetchData(url, timeout, fixKindleFormatting) {
  if (typeof(fixKindleFormatting) === 'undefined') {
    fixKindleFormatting=true
  }

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

      if (fixKindleFormatting) {
        // (replace applies to a lot of file types, not just directory listings)
        iframeSource = iframeSource.replace('<head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">', '').replace('</pre></body>', '');
      }

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

      for (var i = 0; i < anchorTags.length; i++) {
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