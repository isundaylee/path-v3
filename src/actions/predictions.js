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
          response.json().then(data => {
            if (!("upcomingTrains" in data)) {
              dispatch(receivePredictions([]));
              return;
            }

            dispatch(
              receivePredictions(
                data.upcomingTrains.map(pred => {
                  return {
                    lineName: pred.lineName,
                    arrivalTime: new Date(Date.parse(pred.projectedArrival)),
                    status: pred.status,
                    color: pred.lineColors[0]
                  };
                })
              )
            );
          });
        } else {
          dispatch(failurePredictions(Error(response.statusText)));
        }
      },
      error => dispatch(failurePredictions(error))
    );
  };
}
