import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import predictionsReducer from "./reducers/predictions";
import filterReducer from "./reducers/filter";

import { fetchPredictions } from "./actions/predictions";

import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import { Provider } from "react-redux";

let rootStore = createStore(
  combineReducers({
    predictions: predictionsReducer,
    filter: filterReducer
  }),
  applyMiddleware(thunkMiddleware)
);

rootStore.dispatch(fetchPredictions("grove_street"));

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
