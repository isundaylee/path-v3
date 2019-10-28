export function setLineNameFilter(filter) {
  return {
    type: "SET_FILTER",
    payload: {
      type: "lineName",
      lineName: filter
    }
  };
}

export function clearFilter() {
  return {
    type: "SET_FILTER",
    payload: null
  };
}
