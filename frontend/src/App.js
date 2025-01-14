import { Web3Provider } from './web3context';
import React from 'react';
import JobComponent from './JobComponent';


function App() {
  return (
    <Web3Provider>
      <div>
        <h1 style={{paddingLeft: 20 + 'px'}}>Blockchain Job Platform</h1>
        <JobComponent />
      </div>
    </Web3Provider>
  );
}

export default App;
