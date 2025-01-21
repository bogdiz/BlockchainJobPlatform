import { Web3Provider } from './web3context';
import React from 'react';
import JobComponent from './JobComponent';
import JobDetails from './JobDetails'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import React Router

function App() {
  return (
    <Web3Provider>
      <Router>
        <div>
          <h1 style={{paddingLeft: '20px'}}>Blockchain Job Platform</h1>
          <Routes>
            <Route path="/" element={<JobComponent />} />
            <Route path="/job" element={<JobDetails />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
