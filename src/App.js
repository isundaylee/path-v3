import React from 'react';
import './App.css';

import { useSelector } from 'react-redux';
import PredictionTable from './components/PredictionTable';

function App() {
  return (
    <div className="App">
      <PredictionTable predictions={useSelector(a => a)} />
    </div>
  );
}

export default App;
