import React from "react";
import "./App.css";

import { useDispatch, useSelector } from "react-redux";

import PredictionTable from "./components/PredictionTable";
import { clearFilter } from "./actions/filter";

function App() {
  const isFetching = useSelector(state => state.loader);
  const hasFilter = useSelector(state => state.filter !== null);
  const allPredictions = useSelector(state => state.predictions);
  const filter = useSelector(state => state.filter);

  const predictions = allPredictions
    .filter(pred => {
      if (!filter) {
        return true;
      }

      switch (filter.type) {
        case "lineName":
          return pred.lineName === filter.lineName;
        default:
          console.error("Invalid filter type:", filter.type);
          return false;
      }
    })
    .sort((a, b) => {
      return a.arrivalTime > b.arrivalTime;
    });

  const reminders = useSelector(state => state.reminders);

  const dispatch = useDispatch();
  const onClearFilter = event => {
    dispatch(clearFilter());
  };

  return (
    <div className="App">
      <PredictionTable
        isFetching={isFetching}
        hasFilter={hasFilter}
        onClearFilter={onClearFilter}
        predictions={predictions}
        reminders={reminders}
      />
    </div>
  );
}

export default App;
