import React from "react";

import { useDispatch } from "react-redux";
import { setLineNameFilter } from "../actions/filter";

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
    const resp = await (await fetch("/remind", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lineName: props.prediction.lineName,
        arrivalTimestamp: props.prediction.arrivalTime.getTime() / 1000
      })
    })).json();
  };

  const lineNameReplaces = {
    "Journal Square via Hoboken": "Journal Square via Hob",
    "33rd via Hoboken": "33rd via Hob"
  };

  const lineName =
    lineNameReplaces[props.prediction.lineName] || props.prediction.lineName;

  return (
    <div className="PredictionItem" style={containerStyle} onClick={onClick}>
      <div className="left">
        <div className="line">{lineName}</div>

        <div className="status">{props.prediction.status}</div>
      </div>
      <div className="right">
        <div className="arrival" onClick={onTimeClick}>
          {timeLeftString}
        </div>
      </div>
    </div>
  );
}

export default PredictionItem;
