function setReminderStatus(tripId, status) {
  return {
    type: "REMINDERS_SET_STATUS",
    payload: {
      tripId: tripId,
      status: status
    }
  };
}

export function requestReminder(tripId, lineName, arrivalTime) {
  return async dispatch => {
    dispatch(setReminderStatus(tripId, "requesting"));

    const rawResp = await fetch("/remind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lineName: lineName,
        arrivalTimestamp: arrivalTime.getTime() / 1000
      })
    }).catch(reason => {
      console.error("Failed to set reminder:", reason);
      dispatch(setReminderStatus(tripId, "error"));
      return null;
    });

    if (rawResp === null) {
      return;
    }

    const resp = await rawResp.json().catch(reason => {
      console.error("Failed to set reminder:", reason);
      dispatch(setReminderStatus(tripId, "error"));
      return null;
    });

    if (resp === null) {
      return;
    }

    dispatch(setReminderStatus(tripId, "requested"));
  };
}
