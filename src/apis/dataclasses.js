/*
 * Contains classes for handing API data.
 */

/**
 * combines and inverts arrays, so a = [1, 2, 3], b = [4, 5, 6] becomes [[1,4], [2,5], [3,6]]
 * this function is used to convert column-based representations of the data to a table for display
 */
const zip = (arrays) => {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i]
    })
  });
}

/**
 * Sorts an array of objects (changinge the array) based on some attribute in the array.
 * @param arrayOfObjs The array of objects to sort.
 * @param attr The attribute to use for sorting.  Always sorts ascending.
 */
export const sortObjects = (arrayOfObjs, attr) => {
  arrayOfObjs.sort((first, second) => {
    if (first[attr] < second[attr]) return -1;
    if (first[attr] > second[attr]) return 1;
    return 0
  });
}

/**
 * Returns values from an object.  JS offers no direct method to do so.
 * @param obj The object to get the values from.
 * @returns {*[]} The values from the object.
 */
const getValues = (obj) => {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

/**
 * Holds the data in a tabular format for easy use and retrieval.  Base class of all data classes.
 */
export class TabularData {
  /**
   * Creates a new TabularData object.
   * @param originalData The original data from the API.
   */
  constructor(originalData = null) {
    // Creates a tabular object from data.  The columns are the names of the columns.
    // The data can either be row oriented, i.e. one entry per row, or columns oriented.
    this.data = {};  // The data is narmalized to be stored by column with the key being the column name.  This
                     // makes it easy to just get a subset of columns in any order.
    this.originalData = originalData; // The original data from the API.
    this._cns = []   // column names
    this._nbrRows = 0;  // Number of rows of data.
  }

  /**
   * Sets the column names to use.  This also dictates the number of columns and should match the data.
   * @param cns The names of the columns in the same order as the data.
   */
  set columnNames(cns) {
    this._cns = Array.from(cns);
  }

  /**
   * Returns the column names.
   * @returns {[]} An array containing the column names.
   */
  get columnNames() {
    return Array.from(this._cns); // avoid manipulation.
  }

  /**
   * Returns the number of columns in the tabular data.
   * @returns {number} The number of columns.
   */
  get nbrColumns() {
    return this._cns.length;
  }

  /**
   * Returns the number of rows of data.
   * @returns {number} The number of rows of data.
   */
  get nbrRows() {
    return this._nbrRows;
  }

  /**
   * Populates the data by row.  This means the data is an array of arrays of the form:
   * [0]: [a|b|1]
   * [1]: [c|d|2]
   * etc
   * The order of the columns is assumed to be the same as the order of the column names and that there are the
   * same number of column headers and values.  In the example above, that would imply three columns/column names.
   * @param data The data to populate.
   */
  populateDataByRow(data) {
    try {

      // Create the columns to populate with data.
      for (const name of this._cns) {
        this.data[name] = [];
      }

      // Assumes the columns are all filled and the same size.
      this._nbrRows = data.length;
      for (let rowCnt = 0; rowCnt < this._nbrRows; rowCnt++) {
        for (let colCnt = 0; colCnt < this.columnNames.length; colCnt++) {
          this.data[this._cns[colCnt]].push(data[rowCnt][colCnt]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Populates the data by column.   In this case, the data is of the form:
   * {
   * col_name_1: [a|b|1]
   * col_name_2: [c|d|2]
   * etc
   * }
   * The order of the columns is assumed to be the same as the order of the column names and that there are the
   * same number of column headers and values.  In the example above, that would imply three columns/column names.
   * @param data The data to populate.
   */
  populateDataByColumn(data) {
    this._nbrRows = data.length ? data[0].length : 0; // doesn't matter which column.
    for (let colCnt = 0; colCnt < this.nbrColumns; colCnt++) {
      const colName = this._cns[colCnt];
      this.data[colName] = Array.from(data[colCnt]);  // shallow copy the data
    }
  }

  /**
   * Returns the set of columns as an array of arrays of data.
   *  The columnNames are the sub-set of columns.  There are three options:
   *    null or undefined: return all columns
   *    string: return a single column with that name
   *    array of strings: return the columns with the given name
   * @param columnNames The names of the columns to return.
   * @returns {*}  An array of arrays with the data in rows, e.g.
   * [
   * [a|b|1]
   * [c|d|2]
   * etc.
   * ]
   */
  getDataAsTable(columnNames) {
    if (!columnNames) {
      columnNames = this.columnNames;
    } else if (!(columnNames instanceof Array)) {
      columnNames = [columnNames];
    }

    let arrays = []
    for (let cname of columnNames) {
      arrays.push(this.data[cname])
    }

    const results = zip(arrays);
    return results;  // returns a two dimensional data array for the columns requested.
  }
}

/**
 * This class handles data from Search and Answers where the action was from the main menu or main action.
 * It does not work for liveboard visualizations or context menus.
 */
export class ActionData extends TabularData {

  static createFromJSON(jsonData) {
    // Creates a new ActionData object from JSON.
    const actionData = new ActionData(jsonData);

    try {
      let dataRoot = jsonData.payload.embedAnswerData; // sep 21 release
      if (!dataRoot) {
        dataRoot = jsonData.data.embedAnswerData;  // jul-aug 21
      }
      if (!dataRoot) {
        // Data root changed in pre-7.jul.cl.  This can be eventually taken out.
        dataRoot = jsonData.data.columnsAndData;
      }

      // Note that you can get more column names than data and that the data column are aligned by column ID.
      let originalColumnNames = [];
      let columnIds = [];
      // Get the column meta information.
      const nbrCols = dataRoot.columns.length;
      for (let colCnt = 0; colCnt < nbrCols; colCnt += 1) {
        originalColumnNames.push(dataRoot.columns[colCnt].column.name);
        columnIds.push(dataRoot.columns[colCnt].column.id);
      }

      // can come in two flavors, so need to get the right data
      const dataSet = (Array.isArray(dataRoot.data))
        ? dataRoot.data[0].columnDataLite
        : dataRoot.data.columnDataLite;

      const data = [];
      let columnNames = [];
      for (let cnt = 0; cnt < dataSet.length; cnt++) {
        const columnIdx = columnIds.indexOf(dataSet[cnt].columnId);  // find the right column.
        if (columnIdx < 0) {
          console.error(`Data error: ${dataSet[cnt].columnId} not found in the columns names.`);
        } else {
          columnNames.push(originalColumnNames[columnIdx]);
          data.push(dataSet[cnt].dataValue);  // should be an array of columns values.
        }
      }

      actionData.columnNames = columnNames;
      actionData.populateDataByColumn(data);
    } catch (error) {
      console.error(`Error creating action data: ${error}`);
      console.error(jsonData);
    }

    return actionData;
  }
}

/**
 * This class handles data from Liveboard visualizations where the action was from the main menu or main action.
 * It does not work for Search/Answer visualizations or context menus.
 */
export class LiveboardActionData extends TabularData {

  /**
   * Creates a new LiveboardActionData object from JSON.  Liveboard actions pass the JSON as a string, so it has to be
   * converted first.
   * @param jsonData A string from the payload.data.
   * @returns {LiveboardActionData}
   */
  static createFromJSON(jsonData) {
    jsonData = JSON.parse(jsonData);
    const liveboardActionData = new LiveboardActionData(jsonData);

    try {

      const reportBookData = getValues(jsonData.reportBookData)[0]; // assume there's only one.
      const vizData = getValues(reportBookData.vizData)[0]; // assume there's only one.

      let columnNames = [];
      // Get the column meta information.
      const columns = vizData.dataSets.PINBOARD_VIZ.columns;
      const nbrCols = columns.length;
      for (let colCnt = 0; colCnt < nbrCols; colCnt += 1) {
        columnNames.push(columns[colCnt].column.name);
      }

      // can come in two flavors, so need to get the right data
      const dataSet = (Array.isArray(vizData.dataSets.PINBOARD_VIZ.data))
        ? vizData.dataSets.PINBOARD_VIZ.data[0].columnDataLite
        : vizData.dataSets.PINBOARD_VIZ.data.columnDataLite;

      const data = [];
      for (let cnt = 0; cnt < columnNames.length; cnt++) {
        data.push(dataSet[cnt].dataValue);  // should be an array of columns values.
      }

      liveboardActionData.columnNames = columnNames;
      liveboardActionData.populateDataByColumn(data);
    } catch (error) {
      console.error(`Error creating liveboard action data: ${error}`);
      console.error(jsonData);
    }

    return liveboardActionData;
  }
}

/**
 * This class handles data from Search and Answer context actions.  It doesn't work with Answer V1 (Liveboard viz).
 */
export class ContextActionData extends TabularData {

  static createFromJSON(jsonData) {
    // Creates a new ActionData object from JSON.
    const contextActionData = new ContextActionData(jsonData);

    try {

      const columnNames = [];
      const columnValues = [];

      // The actual data is stored in
      // jsonData.data.contextMenuPoints.[deselectedAttributes|deselectedMeasures|selectedAttributes|selectedMeasures]
      // This approach means attributes will always come first and then measures.  This gets all values in the row.
      let contextMenuPoints = jsonData.payload.contextMenuPoints; // sep 21
      if (!contextMenuPoints) {  // pre-sep 21
        contextMenuPoints = jsonData.data.contextMenuPoints;
      }

      for (let section of ["selectedAttributes", "deselectedAttributes", "selectedMeasures", "deselectedMeasures"]) {
        for (let column of contextMenuPoints.clickedPoint[section]) {
          const columnName = column.column.name;
          columnNames.push(columnName);
          columnValues.push([column.value]);
        }
      }

      contextActionData.columnNames = columnNames;
      contextActionData.populateDataByColumn(columnValues);
    } catch (error) {
      console.error(`Error creating context action data: ${error}`);
      console.error(jsonData);
    }

    return contextActionData;
  }
}

/**
 * Represents the data from liveboard context actions.  Does not work with Search/Answer context actions.
 */
export class LiveboardContextActionData extends TabularData {

  /**
   * Creates a new LiveboardContextActionData from the payload.
   * @param jsonData  A string from payload.data
   * @returns {LiveboardContextActionData}
   */
  static createFromJSON(jsonData) {
    jsonData = JSON.parse(jsonData.data);
    const contextActionData = new LiveboardContextActionData();

    try {

      const columnNames = [];
      const columnValues = [];

      // The actual data is stored in
      // jsonData.data.contextMenuPoints.[deselectedAttributes|deselectedMeasures|selectedAttributes|selectedMeasures]
      // This approach means attributes will always come first and then measures.  This gets all values in the row.
      for (let section of ["selectedAttributes", "deselectedAttributes", "selectedMeasures", "deselectedMeasures"]) {
        for (let column of jsonData.clickedPoint[section]) {
          const columnName = column.column.name;
          columnNames.push(columnName);
          columnValues.push([column.value]);
        }
      }

      contextActionData.columnNames = columnNames;
      contextActionData.populateDataByColumn(columnValues);
    } catch (error) {
      console.error(`Error creating liveboard context action data: ${error}`);
      console.error(jsonData);
    }

    return contextActionData;
  }
}

/**
 * Represents the individual visualizations in a liveboard.
 */
class VizData extends TabularData {

  constructor(ID, jsonData) {
    super(jsonData);
    this.ID = ID;  // ID for the visualization.
  }
}

/**
 * Represents the liveboard data class.  This is returned when calling the liveboard data API.
 */
export class LiveboardData {

  /**
   * Creates a new liveboard data class, which is just a collection of VizData.
   */
  constructor() {
    this.vizData = {}  // Set of VizData objects keyed by the viz ID.
  }

  /**
   * Creates the liveboard data object from JSON.
   * @param jsonData The data from the liveboard data API.
   * @returns {LiveboardData}
   */
  static createFromJSON(jsonData) {
    // Creates a LiveboardData object from JSON.
    const liveboardData = new LiveboardData();
    try {
      for (const vizId in jsonData) {
        const vizData = new VizData();
        vizData.columnNames = jsonData[vizId].columnNames;
        vizData.populateDataByRow(jsonData[vizId].data);

        liveboardData.vizData[vizId] = vizData;
      }
    } catch (error) {
      console.error(`Error creating liveboard data: ${error}`);
      console.error(jsonData);
    }

    return liveboardData;
  }
}

/**
 * Creates a new search data object with the results of the Search Data API call.
 */
export class SearchData extends TabularData {

  /**
   * Create a new search data object.
   * @param jsonData The data returned from the API call.
   * @returns {SearchData}
   */
  static createFromJSON(jsonData) {
    // Creates a new SearchData object from JSON
    const searchData = new SearchData(jsonData);
    try {
      searchData.columnNames = jsonData.columnNames;
      searchData.populateDataByRow(jsonData.data);
    } catch (error) {
      console.error(`Error creating search data: ${error}`);
      console.error(jsonData);
    }

    return searchData;
  }

}

/**
 * Converts a tabular data object to an HTML table for display.
 * @param tabularData
 * @returns {string}
 */
export const tabularDataToHTML = (tabularData) => {
  // Converts TabularData to HTML.
  let table = '<table class="tabular-data">';

  // Add a header
  table += '<tr>';
  for (const columnName of tabularData.columnNames) {
    table += `<th class="tabular-data-th">${columnName}</th>`;
  }
  table += '</tr>';

  const data = tabularData.getDataAsTable();
  for (let rnbr = 0; rnbr < tabularData.nbrRows; rnbr++) {
    table += '<tr>';
    for (let cnbr = 0; cnbr < tabularData.columnNames.length; cnbr++) {
      table += `<td class="tabular-data">${data[rnbr][cnbr]}</td>`;
    }
    table += '</tr>';
  }
  table += '</table>';

  return table;
}

/**
 * Converts tabular data to CSV format that can be displayed or downloaded.
 * @param tabularData A TabularData object.
 */
export const tabularDataToCSV = (tabularData) => {
  let csv = 'data:text/csv;charset=utf-8,';

  // Get the column names as header values.
  const columnNames = tabularData.columnNames.map(cn => cn.replaceAll('"', '""')); // convert quotes for embedding.
  csv += '"' + columnNames.join('","') + '"\n';

  // get the data as a table and add it to the CSV.
  const data = tabularData.getDataAsTable();
  for (let rnbr = 0; rnbr < tabularData.nbrRows; rnbr++) {
    const row = data[rnbr].map(d => d.replaceAll('"', '""')); // convert quotes for embedding
    csv += '"' + row.join('","') + '"\n';
  }

  return csv;
}
