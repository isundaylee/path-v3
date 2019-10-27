import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import predictionsReducer from './reducers/predictions';
import filterReducer from './reducers/filter';

import { updatePredictions } from './actions/predictions';
import { setLineNameFilter } from './actions/filter';

import { createStore, combineReducers } from 'redux';

import { Provider } from 'react-redux';

let rootStore = createStore(combineReducers({
    predictions: predictionsReducer,
    filter: filterReducer,
}));

fetch('https://path.api.razza.dev/v1/stations/grove_street/realtime')
    .then(response => response.json())
    .then(data => rootStore.dispatch(updatePredictions(data)));

ReactDOM.render(
    <Provider store={rootStore}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
