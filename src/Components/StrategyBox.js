import React, { useState } from 'react';
import './StrategyBox.css'; // Import your CSS file for styling

const StrategyBox = () => {
  const [strategyName, setStrategyName] = useState('');
  const [execution, setExecution] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  const saveToJson = () => {
    const data = {
      strategy: {
        strategyName,
        execution,
        pros,
        cons,
      },
    };
  
    const jsonStrategy = JSON.stringify(data.strategy);
    const blob = new Blob([jsonStrategy], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'strategy_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const strategyData = JSON.parse(event.target.result);
      setStrategyName(strategyData.strategyName || '');
      setExecution(strategyData.execution || '');
      setPros(strategyData.pros || '');
      setCons(strategyData.cons || '');
    };
    reader.readAsText(file);
  };
  return (
    <div className="strategy-box-container">
      <div className="strategy-box">
        <h2>Strategy Box</h2>
        <label>
          Strategy Name:
          <input
            type="text"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Execution:
          <textarea
            value={execution}
            onChange={(e) => setExecution(e.target.value)}
            rows="4"
          />
        </label>
        <br />
        <label>
          Pros:
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            rows="4"
          />
        </label>
        <br />
        <label>
          Cons:
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            rows="4"
          />
        </label>
        <br />
        <input type="file" onChange={handleFileChange} />
        <button onClick={saveToJson}>Save Strategy</button>
      </div>
    </div>
  );
};

export default StrategyBox;
