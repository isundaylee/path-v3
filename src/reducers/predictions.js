const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "UPDATE_PREDICTIONS":
      if (!("upcomingTrains" in action.payload)) {
        return [];
      }

      let newState = [];
      for (const train of action.payload.upcomingTrains) {
        const prediction = {
          lineName: train.lineName,
          arrivalTime: new Date(Date.parse(train.projectedArrival)),
          status: train.status,
          color: train.lineColors[0]
        };
        newState.push(prediction);
      }
      return newState;
    default:
      return state;
  }
}
