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
      return {
        ...state,
        predictions: action.payload,
        isFetching: false,
        fetchError: null
      };

    default:
      return state;
  }
}
