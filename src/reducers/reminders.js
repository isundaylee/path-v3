const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "REMINDERS_SET_STATUS":
      var newState = {};
      newState[action.payload.tripId] = action.payload.status;
      return Object.assign(Object.assign({}, state), newState);

    default:
      return state;
  }
}
