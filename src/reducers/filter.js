export default function(state = null, action) {
  switch (action.type) {
    case "FILTER_SET":
      return action.payload;
    default:
      return state;
  }
}
