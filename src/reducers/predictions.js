const INITIAL_STATE = {
  predictions: [],
  isFetching: false,
  fetchError: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "REQUEST_PREDICTIONS":
      return { ...state, isFetching: true, fetchError: null };

    case "FAILURE_PREDICTIONS":
      return {
        ...state,
        predictions: [],
        isFetching: false,
        fetchError: action.payload
      };

    case "RECEIVE_PREDICTIONS":
      let newPredictions = [];
      if ("upcomingTrains" in action.payload) {
        for (const train of action.payload.upcomingTrains) {
          const prediction = {
            lineName: train.lineName,
            arrivalTime: new Date(Date.parse(train.projectedArrival)),
            status: train.status,
            color: train.lineColors[0]
          };
          newPredictions.push(prediction);
        }
      }

      return {
        ...state,
        predictions: newPredictions,
        isFetching: false,
        fetchError: null
      };
    default:
      return state;
  }
}
