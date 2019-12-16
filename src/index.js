import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import predictionsReducer from "./reducers/predictions";
import filterReducer from "./reducers/filter";
import loaderReducer from "./reducers/loader";
import remindersReducer from "./reducers/reminders";

import { fetchPredictionsFromGlitch } from "./actions/predictions";

import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import { Provider } from "react-redux";

let rootStore = createStore(
  combineReducers({
    predictions: predictionsReducer,
    filter: filterReducer,
    loader: loaderReducer,
    reminders: remindersReducer
  }),
  applyMiddleware(thunkMiddleware)
);

const params = new URLSearchParams(window.location.search);
let station = params.get("station");

const DEFAULT_STATION = "world_trade_center";
const VALID_STATIONS = ["grove_street", "world_trade_center"];

if (!VALID_STATIONS.includes(station)) {
  station = DEFAULT_STATION;
}

// rootStore.dispatch(fetchPredictions("grove_street"));
rootStore.dispatch(fetchPredictionsFromGlitch(station));

ReactDOM.render(
  <Provider store={rootStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
