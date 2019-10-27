function requestPredictions() {
  return {
    type: "REQUEST_PREDICTIONS"
  };
}

function receivePredictions(json) {
  return {
    type: "RECEIVE_PREDICTIONS",
    payload: json
  };
}

function failurePredictions(error) {
  return {
    type: "FAILURE_PREDICTIONS",
    payload: error
  };
}

export function fetchPredictions(stationName) {
  return function(dispatch) {
    dispatch(requestPredictions());

    return fetch(
      "https://path.api.razza.dev/v1/stations/" + stationName + "/realtime"
    ).then(
      response => {
        if (response.ok) {
          response.json().then(data => dispatch(receivePredictions(data)));
        } else {
          dispatch(failurePredictions(Error(response.statusText)));
        }
      },
      error => dispatch(failurePredictions(error))
    );
  };
}
