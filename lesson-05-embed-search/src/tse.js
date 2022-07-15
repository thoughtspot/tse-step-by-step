/** Logic for embedding and controlling the application. */
import {
  init,
  AuthType,
  // lesson 05
  SearchEmbed,
  Action,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// 1) - Set the tsURL to point to your ThoughtSpot instance.
// If you are using the free trial the URL will be like the following:
const tsURL = "https://myx.thoughtspot.cloud";

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  // 2) - add code to initialize the SDK and ThoughtSpot.  lesson 05
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None
  });

  document.getElementById("embed").innerHTML = "<p>Select an option from above.</p>";
}

// Show the search page.  lesson 05
const onSearch = () => {
  console.log('searching');

  // Your datasource guid and search will be different.
  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    collapseDataSources: true,
    disabledActions: [Action.Download],
    disabledActionReason: "Permission required",
    hiddenActions: [Action.Share],
    dataSources: ["1b1c237d-9de8-4542-bf1f-0c3157ddb8d2"],
    searchOptions: {
      searchTokenString: '[sales] [product type]',
      executeSearch: true,
    },
  });

  embed.render();
}

// Events for nav bar.  As you add functionality, you'll need to connect the UI to functions. -------------------------

// Copy the following and change the id to the ID from the HTML document and the handler to be the function to call.
// document.getElementById('element-id').addEventListener('click', eventHandler);

document.getElementById('search-link').addEventListener('click', onSearch);  // lesson 05

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
