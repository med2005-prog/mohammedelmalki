import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayersList from './PlayersList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', marginTop: '20px', color: '#333' }}>FIFA Player Cards</h1>
      <PlayersList />
    </div>
  );
}

export default App;
