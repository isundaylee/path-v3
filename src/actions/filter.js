export function setLineNameFilter(filter) {
    return {
        type: 'SET_FILTER',
        payload: {
            type: 'lineName',
            lineName: filter
        }
    };
}