const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "PREDICTIONS_SET":
      return action.payload;

    default:
      return state;
  }
}
