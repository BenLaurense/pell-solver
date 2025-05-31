import React, { useState } from 'react';
import './App.css';

function PellSolver() {
  const [inputN, setInputN] = useState('');
  const [resultText, setResultText] = useState(''); // Text representation of the response (ugly)
  const [calculationSteps, setCalculationSteps] = useState('')
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const n = parseInt(inputN);
    if (isNaN(n) || n <= 0) {
      setSuccess(false);
      setCalculationSteps('');
      setResultText('Please enter a positive squarefree integer!');
      return;
    }

    setLoading(true);

    setSuccess(null);
    setResultText('');
    setCalculationSteps('');

    try {
      const response = await fetch('/backend/pell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n })
      });

      const data = await response.json();
      if (data.success === 'Success') {
        setSuccess(true);
        setResultText(`Fundamental solution: (x, y)=${data.solution}`);
        setCalculationSteps(
          `The continued fraction representation of sqrt{n} is regular and periodic with period ${data.period} `
          + `and is given by ${data.cont_frac}. `
          + `Since the period is ${data.period % 2 === 1 ? 'odd' : 'even'}, the ${data.solution_index}th `
          + `convergent ${data.solution} gives the fundamental solution.`)
      } else if (data.success === 'NotSquarefree') {
        setSuccess(false);
        setCalculationSteps('');
        setResultText('Please enter a positive squarefree integer!');
      } else {
        setSuccess(false);
        setCalculationSteps('')
        setResultText('Calculation Failed');
      }
    } catch (error) {
      setSuccess(false);
      setCalculationSteps('')
      setResultText('An error occurred. Please try another');
    } finally {
      setLoading(false);
    }
  };

 return (
    <div>
      <h2>Pell's Equation Solver</h2>
      <p className="description-box">This applet will find the fundamental solution to the equation x² - ny² = 1
        given an input n. Given the fundamental solution (x*, y*) and any solution (x, y), a further solution is given by
        (x*x + ny*y, x*y + y*x). All solutions are obtained this way.
      </p>
      <input
        className="styled-input"
        type="number"
        value={inputN}
        onChange={e => setInputN(e.target.value)}
        placeholder="Enter n"
      />
      <button className="styled-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
      <p
        className="result-display"
        style={{
          color:
            success === null
              ? '#333'
              : success
              ? '#2e7d32'
              : '#d32f2f'
        }}
      >
        {resultText}
      </p>
      {calculationSteps && (
        <div className="steps-container">
          <div className="steps-label">Show Calculation Steps</div>
          <div className="steps-content">{calculationSteps}</div>
        </div>
      )}
    </div>
  );
}

function NegativePellSolver() {
  const [inputN, setInputN] = useState('');
  const [resultText, setResultText] = useState(''); // Text representation of the response (ugly)
  const [calculationSteps, setCalculationSteps] = useState('')
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const n = parseInt(inputN);
    if (isNaN(n) || n <= 0) {
      setSuccess(false);
      setCalculationSteps('');
      setResultText('Please enter a positive squarefree integer!');
      return;
    }

    setLoading(true);

    setSuccess(null);
    setResultText('');
    setCalculationSteps('');

    try {
      const response = await fetch('/backend/negative_pell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n })
      });

      const data = await response.json();
      if (data.success === 'Success') {
        setSuccess(true);
        setResultText(`Fundamental solution: (x, y)=${data.solution}. ` 
          + `Auxiliary Pell solution: (x', y')=${data.aux_solution}`);
        setCalculationSteps(
          `The continued fraction representation of sqrt{n} is regular and periodic with period ${data.period} `
          + `The period is odd so there is a solution, with index ${data.solution_index} .` 
          + `The auxiliary solution has index ${data.aux_solution_index}`)
      } else if (data.success === 'SuccessNoSolution') {
        setSuccess(true);
        setResultText(`No solutions!`);
        setCalculationSteps(
          `The continued fraction representation of sqrt{n} is regular and periodic with period ${data.period} `
          + `The period is even so there is no solution`)
      } else {
        setSuccess(false);
        setCalculationSteps('')
        setResultText('Calculation Failed');
      }
    } catch (error) {
      setSuccess(false);
      setCalculationSteps('')
      setResultText('An error occurred. Please try another');
    } finally {
      setLoading(false);
    }
  };

 return (
    <div>
      <h2>Negative Pell's Equation Solver</h2>
      <p className="description-box">This applet will find the fundamental solution to the equation x² - ny² = -1
        given an input n. Given the fundamental solution (x*, y*) and the fundamental solution (x',y') of the 
        corresponding Pell's equation x² - ny² = 1, ... . All solutions are obtained this way.
      </p>
      <input
        className="styled-input"
        type="number"
        value={inputN}
        onChange={e => setInputN(e.target.value)}
        placeholder="Enter n"
      />
      <button className="styled-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
      <p
        className="result-display"
        style={{
          color:
            success === null
              ? '#333'
              : success
              ? '#2e7d32'
              : '#d32f2f'
        }}
      >
        {resultText}
      </p>
      {calculationSteps && (
        <div className="steps-container">
          <div className="steps-label">Show Calculation Steps</div>
          <div className="steps-content">{calculationSteps}</div>
        </div>
      )}
    </div>
  );
}

function GeneralizedPellSolver() {
  return (
    <div>
      <h2>Generalized Pell's Equation Solver: </h2>
      {/* Replace with actual calculator logic */}
      <p>Make me</p>
    </div>
  );
}

function PellSolverApp() {
  const [activeTab, setActiveTab] = useState('A');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'A':
        return <PellSolver />;
      case 'B':
        return <NegativePellSolver />;
      case 'C':
        return <GeneralizedPellSolver />;
      default:
        return null;
    }
  };

  return (
    <div className="calculator-container">
      <div className="tab-header">
        <button className={`tab-button ${activeTab === 'A' ? 'active' : ''}`} onClick={() => setActiveTab('A')}>Pell's Equation Solver</button>
        <button className={`tab-button ${activeTab === 'B' ? 'active' : ''}`} onClick={() => setActiveTab('B')}>Negative Pell's Equation Solver</button>
        <button className={`tab-button ${activeTab === 'C' ? 'active' : ''}`} onClick={() => setActiveTab('C')}>Generalised Pell's Equation Solver</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default PellSolverApp;
