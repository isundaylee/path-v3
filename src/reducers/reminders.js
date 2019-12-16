const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "REMINDERS_SET_STATUS":
      state[action.payload.tripId] = action.payload.status;
      return state;

    default:
      return state;
  }
}
