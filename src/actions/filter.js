export function setLineNameFilter(filter) {
  return {
    type: "FILTER_SET",
    payload: {
      type: "lineName",
      lineName: filter
    }
  };
}

export function clearFilter() {
  return {
    type: "FILTER_SET",
    payload: null
  };
}
