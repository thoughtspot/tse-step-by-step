/** Logic for embedding and controlling the application. */
import {
  init,
  Action,
  AuthType,
  LiveboardEmbed,
  SearchEmbed,
  SageEmbed,
} from "https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js";

// 1) - Set the tsURL to point to your ThoughtSpot instance.
// If you are using the free trial the URL will be like the following:
const tsURL = "https://training.thoughtspot.cloud";

/** Initializes the application with ThoughtSpot. */
const loadApp = () => {
  init({
    thoughtSpotHost: tsURL,
    authType: AuthType.None,
  });

  document.getElementById("embed").innerHTML =
    "<p>Select an option from above.</p>";
};

const onSearch = () => {
  const embed = new SearchEmbed("#embed", {
    frameParams: {},
    collapseDataSources: true,
    disabledActions: [Action.Download],
    disabledActionReason: "Permission required",
    hiddenActions: [Action.Share],
    dataSources: ["4d98d3f5-5c6a-44eb-82fb-d529ca20e31f"],
    searchOptions: {
      searchTokenString: "[sales] [product type]",
      executeSearch: true,
    },
  });

  embed.render();
};

const onSage = () => {
  const embed = new SageEmbed("#embed", {
    frameParams: {},
    disableWorksheetChange: true,
    hideSageAnswerHeader: true,
    dataSource: "4d98d3f5-5c6a-44eb-82fb-d529ca20e31f",
    searchOptions: {
      searchQuery: "top selling items",
      executeSearch: true,
    },
  });

  embed.render();
};

const onLiveboard = () => {
  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "0dc92611-2643-4c3e-a7c3-e7e421af9fd1",
  });

  embed.render();
};

const onVisualization = () => {
  const embed = new LiveboardEmbed("#embed", {
    frameParams: {},
    liveboardId: "0dc92611-2643-4c3e-a7c3-e7e421af9fd1",
    vizId: "9bf48c6e-4d2a-4817-9417-e62c0cff184d",
  });

  embed.render();
};

// ===============================================================================================
// Events for nav bar.  As you add functionality, you'll need to connect the UI to functions.
// Copy the following and change the id to the ID from the HTML document and the handler to be the function to call.
// document.getElementById('element-id').addEventListener('click', eventHandler);

document.getElementById("search-link").addEventListener("click", onSearch);
document.getElementById("sage-link").addEventListener("click", onSage);
document
  .getElementById("liveboard-link")
  .addEventListener("click", onLiveboard);
document
  .getElementById("liveboard-viz-link")
  .addEventListener("click", onVisualization);

// ===============================================================================================
// You shouldn't need to modify code below this point.
// ===============================================================================================

// Start the application.
window.onload = loadApp;
