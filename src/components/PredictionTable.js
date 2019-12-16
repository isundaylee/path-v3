import React, { Component } from "react";

import { useSelector } from "react-redux";

import PredictionItem from "./PredictionItem";

class PredictionTable extends Component {
  constructor() {
    super();

    this.state = {
      currentTime: Date.now()
    };
  }

  render() {
    const items = this.props.predictions.map((pred, index) => {
      return (
        <PredictionItem
          key={index}
          currentTime={this.state.currentTime}
          prediction={pred}
          reminderStatus={this.props.reminders[pred.tripId] || "unrequested"}
        />
      );
    });

    return (
      <div className="PredictionTable">
        {this.props.hasFilter && (
          <p className="show-all-button" onClick={this.props.onClearFilter}>
            Show All Predictions
          </p>
        )}
        <div>{items}</div>
        <p className="count">
          {this.props.isFetching
            ? "Fetching predictions..."
            : this.props.predictions.length.toString() + " predictions loaded."}
        </p>
      </div>
    );
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ currentTime: Date.now() });
    }, 1000);
  }
}

export default PredictionTable;
