/** Logic for embedding and controlling the application. */
import {
  init,
  AuthType,
  SearchEmbed,
  LiveboardEmbed,
  AppEmbed,
  Page,
  Action,
  EmbedEvent,
  RuntimeFilterOp,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import { LiveboardContextActionData } from "./apis/dataclasses.js";
import { getSearchData } from "./apis/rest-api.js";

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
  console.log("application clicked");

  const embed = new AppEmbed("#embed", {
    pageId: Page.Home,
  });

  embed.render();
}

const onCustomAction = () => {
  const embed = new LiveboardEmbed("#embed", {
    disabledActions: [],
    disabledActionReason: "Reason for disabling",
    visibleActions: ['show-details'], /* Removes all actions if empty array */
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "8d2e93ad-cae8-4c8e-a364-e7966a69a41e",
  });
  embed
       .on(EmbedEvent.CustomAction, payload => {
            if (payload.id === 'show-details') {
                 showDetails(payload)
            }
       })
      .render();
}

const showDetails = (payload) => {
  const liveboardContextData = LiveboardContextActionData.createFromJSON(payload);
  // Only gets the first column value.
  const filter = liveboardContextData.data[liveboardContextData.columnNames[0]];

  const embed = new LiveboardEmbed("#modal-data-content", {
    visibleActions: [Action.DrillDown],
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "96db6db8-662a-45b5-bc70-00341d75846b",
    runtimeFilters: [{
      columnName: 'state',
      operator: RuntimeFilterOp.EQ,
      values: [filter]
    }],
  });

  embed.render();

  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}

const onCustomChart = () => {
  console.log('custom chart clicked');

  const worksheetID = "1b1c237d-9de8-4542-bf1f-0c3157ddb8d2";  // Worksheet GUID
  const search = "[sales] [product type] [product] top 15";  // Search string

  getSearchData(tsURL, worksheetID, search).then(data => {  // call from rest-api.js
    console.log(data);

    // Get the indexes of the columns in the data.
    const salesIdx = data.columnNames.findIndex(v => v == 'Total Sales');
    const productTypeIdx = data.columnNames.findIndex(v => v == 'Product Type');
    const productIdx = data.columnNames.findIndex(v => v == 'Product');

    // convert the resulting data to the series for the HighChart.  Format is:
    // [
    //   { name: '<product type>', data: [{ name: <product>, value: <sales> }, ... ]}
    //   { name: '<product type>', data: [{ name: <product>, value: <sales> }, ... ]}
    // ]

    const series = {}
    for (const r of data.data) {
      const productType = r[productTypeIdx]
      if (! Object.keys(series).includes(productType)) {
        series[productType] = []
      }
      // Combines all the data items to the key for each series.
      series[productType].push({ name: r[productIdx], value: r[salesIdx]/1000});
    }

    // Now need to as the chart series.
    const chartSeries = []
    for (const productType of Object.keys(series)) {
      chartSeries.push({name: productType, data: series[productType]})
    }

        // Render the chart.
    Highcharts.chart('embed', {
      chart: {
        type: 'packedbubble'
        /* height: '80%'*/
      },
      title: {
        text: 'Sales of product by product type'
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> ${point.value:.1f}M</sub>'
      },
      plotOptions: {
        packedbubble: {
          minSize: '20%',
          maxSize: '40%',
          zMin: 0,
          zMax: 1000,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 250
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      series: chartSeries
    });

  });
}

// Events for nav bar.  As you add functionality, you'll need to connect the UI to functions. -------------------------

// Copy the following and change the id to the ID from the HTML document and the handler to be the function to call.
// document.getElementById('element-id').addEventListener('click', eventHandler);
document.getElementById('search-link').addEventListener('click', onSearch);
document.getElementById('liveboard-link').addEventListener('click', onLiveboard);
document.getElementById('visualization-link').addEventListener('click', onVisualization);
document.getElementById('application-link').addEventListener('click', onApplication);
document.getElementById('custom-action-link').addEventListener('click', onCustomAction);
document.getElementById('custom-chart-link').addEventListener('click', onCustomChart);

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
