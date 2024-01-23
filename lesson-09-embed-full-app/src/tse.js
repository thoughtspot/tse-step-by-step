/** Logic for embedding and controlling the application. */
import {
  init,
  AuthType,
  SearchEmbed,
  LiveboardEmbed,
  AppEmbed,
  Page,
  Action,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

// 1) - Set the tsURL to point to your ThoughtSpot instance.
// If you are using the free trial the URL will be like the following:
const tsURL = "https://training.thoughtspot.cloud";

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  // 2) - add code to initialize the SDK and ThoughtSpot.
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None
  });

  document.getElementById("embed").innerHTML = "<p>Select an option from above.</p>";
}

const onSearch = () => {
  console.log('search clicked');

  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    collapseDataSources: true,
    disabledActions: [Action.Download],
    disabledActionReason: "Must request permission",
    hiddenActions: [Action.Share],
    dataSources: ["1b1c237d-9de8-4542-bf1f-0c3157ddb8d2"],
    searchOptions: {
      searchTokenString: '[sales] [product type]',
      executeSearch: true,
    },
  });

  embed.render();
}

const onLiveboard = () => {
  console.log('liveboard clicked');

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "9c3d26af-cf1b-4e89-aa42-f60d34983827",
  });

  embed.render();
}

const onVisualization = () => {
  console.log('visualization clicked');

  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "9c3d26af-cf1b-4e89-aa42-f60d34983827",
    vizId: "33dd2cca-25a5-47ab-9327-ff16aeffc15a",
  });

  embed.render();
}

const onApplication = () => {
  console.log('application clicked');

  const embed = new AppEmbed("#embed", {
    frameParams: {},
    pageId: Page.Home,
  });

  embed.render();
}

// Events for nav bar.  As you add functionality, you'll need to connect the UI to functions. -------------------------

// Copy the following and change the id to the ID from the HTML document and the handler to be the function to call.
// document.getElementById('element-id').addEventListener('click', eventHandler);
document.getElementById('search-link').addEventListener('click', onSearch);
document.getElementById('liveboard-link').addEventListener('click', onLiveboard);
document.getElementById('visualization-link').addEventListener('click', onVisualization);
document.getElementById('app-link').addEventListener('click', onApplication);

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
