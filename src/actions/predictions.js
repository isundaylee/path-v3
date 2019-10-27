export function updatePredictions(json) {
  return {
    type: "UPDATE_PREDICTIONS",
    payload: json
  };
}
