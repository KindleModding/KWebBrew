//===============================//
//                               //
// Copyright Bluebotlaboratories //
//                               //
//===============================//

var versionInt = 2;
var versionString = 'v1.1.0'

// Log js errors to log
addEventListener("error", function (event) {
  document.body.innerText = event.message + "\nAt: " + event.lineno + ":" + event.colno + "\nIn: " + event.filename;
});

// Create fancy HTML table to display apps
function generateTable(appList, columns) {
  if (typeof(columns) === 'undefined') {
    columns = 3;
  }

  log("Apps:");
  log(JSON.stringify(appList));

  // Create list for app manifest fetching
  var appManifestPromises = [];

  for (var i = 0; i < appList.length; i++) {
    log(appList[i].path + "manifest.json");
    // Add app manifest promise to list
    appManifestPromises.push(fetchFile(joinPaths(appList[i].path, "/manifest.json")));
  }

  // Execute all promises
  Promise.all(appManifestPromises).then(function (appManifests) {
    log("Obtained manifests");
    log(JSON.stringify(appManifests));

    // Loop through app manifests
    for (var i = 0; i < appManifests.length; i++) {
      if (i % columns == 0 && i != 0) {
        // If it is the end of a row, add the row to the table and create a new row
        document.getElementById("appTable").appendChild(tableRow);
        var tableRow = document.createElement("tr");
        tableRow.class = "appRow";
      } else if (i == 0) {
        // If it is the first row, create a new row without adding the (non-existent) previous row to the body
        var tableRow = document.createElement("tr");
        tableRow.classList.add("appRow");
      }

      // Try/Catch for malformed manifests
      try {
        // Parse manifest file
        var appData = JSON.parse(appManifests[i]);

        // Handle different manifest versions
        switch (appData.manifestVersion) {
          case 2:
            if (appData.minVersion > versionInt || appData.waf) {
              continue
            }
        }

        // Create table cell
        const appCell = document.createElement("td");
        appCell.classList.add("app");

        // Create app link (cross-reference path from the appList since the manifest doesn't contain it)
        const appAnchor = document.createElement("a");
        appAnchor.href = joinPaths(appList[i].path, appData.entrypoint);

        // Create app icon element
        const appImage = document.createElement("img");
        appImage.src = joinPaths(appList[i].path, appData.icon);

        // Create app title element
        const appName = document.createElement("p");
        appName.innerText = appData.name;

        // Add all the elements together
        appAnchor.appendChild(appImage);
        appAnchor.appendChild(appName);
        appCell.appendChild(appAnchor);
        tableRow.appendChild(appCell);
      }
      catch (error) {
        // Send error to log
        log("APP ERROR [" + appList[i].name + "]" + error.toString());
      }
    }

    // Add the last row to the table
    document.getElementById("appTable").appendChild(tableRow);
  });
}

// The logging function
function log(logStuff) {
  var p = document.createElement("p");
  p.innerText = logStuff.toString();
  document.getElementById("log").appendChild(p);
}

// Toggles the display of the log
function toggleLog() {
  const logElement = document.getElementById("log");

  if (logElement.style.getPropertyValue("display") == "none") {
    document.getElementById("log").style.setProperty("display", "block");
  } else {
    document.getElementById("log").style.setProperty("display", "none");
  }
}

function onPageLoad() {
  // Actually do the stuff
  // Get directory info for apps
  getDirectory("../apps/").then(function (data) {
    // Generate the actual table given the list of app folders
    generateTable(data);
  });
}