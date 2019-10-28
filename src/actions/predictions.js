import { setLoader } from "./loader";

function setPredictions(predictions) {
  return {
    type: "PREDICTIONS_SET",
    payload: predictions
  };
}

export function fetchPredictions(stationName) {
  return function(dispatch) {
    dispatch(setLoader(true));

    return fetch(
      "https://path.api.razza.dev/v1/stations/" + stationName + "/realtime"
    ).then(
      response => {
        dispatch(setLoader(false));

        if (response.ok) {
          response.json().then(data => {
            if (!("upcomingTrains" in data)) {
              dispatch(setPredictions([]));
              return;
            }

            dispatch(
              setPredictions(
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
          dispatch(setPredictions([]));
        }
      },
      error => {
        dispatch(setLoader(false));
        dispatch(setPredictions([]));
      }
    );
  };
}
