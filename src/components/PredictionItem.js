import React from "react";

import { useDispatch } from "react-redux";
import { setLineNameFilter } from "../actions/filter";
import { requestReminder } from "../actions/reminders";

function PredictionItem(props) {
  const totalSecondsLeft = Math.floor(
    (props.prediction.arrivalTime - props.currentTime) / 1000
  );

  const minutesLeft = Math.floor(totalSecondsLeft / 60);
  const secondsLeft = totalSecondsLeft - 60 * minutesLeft;

  const containerStyle = { backgroundColor: props.prediction.color };

  const timeLeftString =
    totalSecondsLeft <= 0
      ? "Now"
      : minutesLeft.toString() + ":" + secondsLeft.toString().padStart(2, "0");

  const dispatch = useDispatch();
  const onClick = event => {
    dispatch(setLineNameFilter(props.prediction.lineName));
  };

  const onTimeClick = async event => {
    dispatch(
      requestReminder(
        props.prediction.tripId,
        props.prediction.lineName,
        props.prediction.arrivalTime
      )
    );
  };

  const lineNameReplaces = {
    "Journal Square via Hoboken": "Journal Square via Hob",
    "33rd via Hoboken": "33rd via Hob"
  };

  const lineName =
    lineNameReplaces[props.prediction.lineName] || props.prediction.lineName;

  return (
    <div className="PredictionItem" style={containerStyle}>
      <div className="left" onClick={onClick}>
        <div className="line">{lineName}</div>

        <div className="status">{props.prediction.status}</div>
      </div>
      <div className="right">
        <div className="arrival" onClick={onTimeClick}>
          {
            {
              unrequested: timeLeftString,
              requesting: "...",
              requested: "Set",
              error: "Error"
            }[props.reminderStatus]
          }
        </div>
      </div>
    </div>
  );
}

export default PredictionItem;
