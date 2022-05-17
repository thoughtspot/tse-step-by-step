/** Logic for embedding and controlling the application. */
import {
  init,
  AuthType,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// 1) - Set the tsURL to point to your ThoughtSpot instance.  The default is the trial server.
const tsURL = "https://try.thoughtspot.cloud";

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  // 2) - add code to initialize the SDK and ThoughtSpot.
}

// Events for nav bar.  As you add functionality, you'll need to connect the UI to functions. -------------------------

// Copy the following and change the id to the ID from the HTML document and the handler to be the function to call.
// document.getElementById('element-id').addEventListener('click', eventHandler);

// You shouldn't need to modify code below this point. ----------------------------------------------------------------

//---------------------- UI Function. ---------------------------------------------------------------------------------

// Clears the embedded section.
const clearEmbed = () => {
  const div = document.getElementById("embed");
  div.innerHTML = "";
}

// closes the modal element when the close is selected.
const closeModal = () => {
  const showDataElement = document.getElementById('show-data')
  showDataElement.style.display = 'none';  // hide the box.
}


// Other events in the application.
document.getElementById('close-modal').addEventListener('click', closeModal);

// Start the application.
window.onload = loadApp;
