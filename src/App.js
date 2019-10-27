import React from "react";
import "./App.css";

import { useSelector, useDispatch } from "react-redux";

import PredictionTable from "./components/PredictionTable";

import { setLineNameFilter } from "./actions/filter";

function App() {
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

  const dispatch = useDispatch();
  const allLineNames = [...new Set(allPredictions.map(pred => pred.lineName))];
  const lineNameFilterButtons = allLineNames.map(lineName => {
    const onClick = () => {
      dispatch(setLineNameFilter(lineName));
    };

    return <button onClick={onClick}>{lineName}</button>;
  });

  return (
    <div className="App">
      <PredictionTable predictions={predictions} />
      {lineNameFilterButtons}
    </div>
  );
}

export default App;
